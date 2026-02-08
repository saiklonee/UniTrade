import College from "../models/College.js";
import { v2 as cloudinary } from "cloudinary";

// Upload helper: returns secure_url (or null if no file)
const uploadToCloudinary = async (file, folder = "unitrade/colleges") => {
    if (!file?.path) return null;

    const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: "image",
    });

    return result.secure_url;
};

// POST /add
// multipart/form-data:
// fields: code, name, shortName, slug, city, state, country
// files: logo, image
const addCollege = async (req, res) => {
    try {
        const { code, name, shortName, slug, city, state, country } = req.body;

        // ✅ Since schema requires code/name/slug
        if (!code || !name || !slug) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: code, name, or slug",
            });
        }

        const normalizedCode = code.trim().toUpperCase();
        const normalizedName = name.trim();
        const normalizedSlug = slug.trim().toLowerCase();

        // ✅ Check duplicates for ALL unique fields
        const exists = await College.findOne({
            $or: [{ code: normalizedCode }, { name: normalizedName }, { slug: normalizedSlug }],
        });

        if (exists) {
            let conflict = "College already exists";
            if (exists.code === normalizedCode) conflict = "College with this code already exists";
            else if (exists.slug === normalizedSlug) conflict = "College with this slug already exists";
            else if (exists.name === normalizedName) conflict = "College with this name already exists";

            return res.status(409).json({ success: false, message: conflict });
        }

        // Upload images (optional)
        const logoFile = req.files?.logo?.[0];
        const imageFile = req.files?.image?.[0];

        const [logoUrl, imageUrl] = await Promise.all([
            uploadToCloudinary(logoFile, "unitrade/colleges/logos"),
            uploadToCloudinary(imageFile, "unitrade/colleges/images"),
        ]);

        const newCollege = await College.create({
            code: normalizedCode,
            name: normalizedName,
            shortName: shortName?.trim(),
            slug: normalizedSlug,
            city: city?.trim(),
            state: state?.trim(),
            country: country?.trim() || "India",
            ...(logoUrl ? { logoUrl } : {}),
            ...(imageUrl ? { imageUrl } : {}),
        });

        return res.status(201).json({
            success: true,
            message: "College added successfully",
            college: newCollege,
        });
    } catch (error) {
        console.error("Error adding college:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /list
const getAllColleges = async (req, res) => {
    try {
        // If dropdown: College.find({ isActive: true }).sort({ name: 1 })
        const colleges = await College.find({}).sort({ name: 1 });

        return res.status(200).json({ success: true, colleges });
    } catch (error) {
        console.error("Error fetching colleges:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /get/:id
const getCollegeById = async (req, res) => {
    try {
        const { id } = req.params;

        const college = await College.findById(id);
        if (!college) {
            return res.status(404).json({ success: false, message: "College not found" });
        }

        return res.status(200).json({ success: true, college });
    } catch (error) {
        console.error("Error fetching college:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /update/:id
// multipart/form-data:
// fields (optional): code, name, shortName, slug, city, state, country, isActive
// files (optional): logo, image
const updateCollegeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, shortName, slug, city, state, country, isActive } = req.body;

        const college = await College.findById(id);
        if (!college) {
            return res.status(404).json({ success: false, message: "College not found" });
        }

        // If code is being updated, ensure unique
        if (code !== undefined) {
            const normalizedCode = code.trim().toUpperCase();
            const exists = await College.findOne({ code: normalizedCode, _id: { $ne: id } });
            if (exists) {
                return res.status(409).json({ success: false, message: "College with this code already exists" });
            }
            college.code = normalizedCode;
        }

        // If name is being updated, ensure unique
        if (name !== undefined) {
            const normalizedName = name.trim();
            const exists = await College.findOne({ name: normalizedName, _id: { $ne: id } });
            if (exists) {
                return res.status(409).json({ success: false, message: "College with this name already exists" });
            }
            college.name = normalizedName;
        }

        // If slug is being updated, ensure unique
        if (slug !== undefined) {
            const normalizedSlug = slug.trim().toLowerCase();
            const exists = await College.findOne({ slug: normalizedSlug, _id: { $ne: id } });
            if (exists) {
                return res.status(409).json({ success: false, message: "College with this slug already exists" });
            }
            college.slug = normalizedSlug;
        }

        // Other fields
        if (shortName !== undefined) college.shortName = shortName?.trim();
        if (city !== undefined) college.city = city?.trim();
        if (state !== undefined) college.state = state?.trim();
        if (country !== undefined) college.country = country?.trim() || "India";

        if (isActive !== undefined) {
            college.isActive = String(isActive) === "true";
        }

        // Upload images if provided
        const logoFile = req.files?.logo?.[0];
        const imageFile = req.files?.image?.[0];

        const [logoUrl, imageUrl] = await Promise.all([
            uploadToCloudinary(logoFile, "unitrade/colleges/logos"),
            uploadToCloudinary(imageFile, "unitrade/colleges/images"),
        ]);

        if (logoUrl) college.logoUrl = logoUrl;
        if (imageUrl) college.imageUrl = imageUrl;

        await college.save();

        return res.status(200).json({
            success: true,
            message: "College updated successfully",
            college,
        });
    } catch (error) {
        console.error("Error updating college:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /remove/:id
const removeCollege = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCollege = await College.findByIdAndDelete(id);

        if (!deletedCollege) {
            return res.status(404).json({ success: false, message: "College not found" });
        }

        return res.status(200).json({ success: true, message: "College removed successfully" });
    } catch (error) {
        console.error("Error removing college:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { addCollege, getAllColleges, getCollegeById, updateCollegeById, removeCollege };
