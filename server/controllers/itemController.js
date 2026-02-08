import Item from "../models/Item.js";
import { v2 as cloudinary } from "cloudinary";

// Upload multiple images to Cloudinary
const uploadMultipleToCloudinary = async (files, folder = "unitrade/itemImages") => {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map(async (file) => {
        if (!file.path) return null;

        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
                resource_type: "image",
            });
            return result.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return null;
        }
    });

    const urls = await Promise.all(uploadPromises);
    return urls.filter(url => url !== null);
};

// POST /add
export const addItem = async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            condition,
            listingType,
            price,
            rentPrice,
            rentUnit,
            securityDeposit,
            tags
        } = req.body;

        // Validate required fields
        if (!title || !listingType || !category) {
            console.log("Missing required fields");
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title, listingType, category"
            });
        }

        // Validate user is authenticated
        if (!req.user || !req.user.id) {
            console.log("User not authenticated");
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Validate price based on listing type
        if (listingType === "sell") {
            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum < 0) {
                console.log("Invalid price:", price);
                return res.status(400).json({
                    success: false,
                    message: "Valid price is required for sell items"
                });
            }
        }

        if (listingType === "rent") {
            const rentPriceNum = parseFloat(rentPrice);
            if (isNaN(rentPriceNum) || rentPriceNum < 0) {
                console.log("Invalid rentPrice:", rentPrice);
                return res.status(400).json({
                    success: false,
                    message: "Valid rentPrice is required for rent items"
                });
            }
            if (!rentUnit || !["day", "week", "month"].includes(rentUnit)) {
                console.log("Invalid rentUnit:", rentUnit);
                return res.status(400).json({
                    success: false,
                    message: "Valid rentUnit (day/week/month) is required for rent items"
                });
            }
        }

        // Get user's current college ID
        // Check if currentCollege is populated or just an ObjectId
        let collegeId;
        if (req.user.currentCollege) {
            if (typeof req.user.currentCollege === 'object' && req.user.currentCollege._id) {
                collegeId = req.user.currentCollege._id;
            } else if (typeof req.user.currentCollege === 'string') {
                collegeId = req.user.currentCollege;
            } else {
                console.log("Invalid college format:", req.user.currentCollege);
                return res.status(400).json({
                    success: false,
                    message: "Invalid college data"
                });
            }
        }

        if (!collegeId) {
            console.log("User has no college set");
            return res.status(400).json({
                success: false,
                message: "You must have a current college to post items. Please update your profile."
            });
        }

        // Upload images if provided
        const imageFiles = req.files || [];
        console.log("Uploading", imageFiles.length, "images to Cloudinary");

        let imageUrls = [];
        if (imageFiles.length > 0) {
            imageUrls = await uploadMultipleToCloudinary(imageFiles, "unitrade/itemImages");
        }

        // Parse tags if provided as string
        let parsedTags = [];
        if (tags) {
            if (typeof tags === 'string') {
                parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else if (Array.isArray(tags)) {
                parsedTags = tags;
            }
        }

        // Prepare item data
        const itemData = {
            title: title.trim(),
            description: description?.trim(),
            category,
            condition: condition || "good",
            listingType,
            seller: req.user.id,
            college: collegeId,
            imageUrls,
            tags: parsedTags,
            isActive: true,
            status: "available"
        };

        // Add price fields based on listing type
        if (listingType === "sell") {
            itemData.price = parseFloat(price);
        } else {
            itemData.rentPrice = parseFloat(rentPrice);
            itemData.rentUnit = rentUnit;
            itemData.securityDeposit = securityDeposit ? parseFloat(securityDeposit) : 0;
        }

        console.log("Creating item with data:", itemData);

        // Create new item
        const newItem = await Item.create(itemData);

        // Populate seller and college details
        const populatedItem = await Item.findById(newItem._id)
            .populate("seller", "username name avatarUrl")
            .populate("college", "name code");

        console.log("Item created successfully:", populatedItem._id);

        return res.status(201).json({
            success: true,
            message: "Item listed successfully",
            item: populatedItem
        });

    } catch (error) {
        console.error("Error adding item:", error);

        // Check for specific MongoDB errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: `Validation error: ${messages.join(', ')}`
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate item detected"
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};


// GET /list (with filtering and pagination)
export const getItems = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            condition,
            listingType,
            minPrice,
            maxPrice,
            college,
            q: searchQuery,
            status = "available"
        } = req.query;

        const pageNum = Math.max(parseInt(page), 1);
        const limitNum = Math.min(Math.max(parseInt(limit), 1), 50);
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter = { isActive: true, status };

        // If college is provided, filter by college
        if (college) {
            filter.college = college;
        }

        // Apply other filters
        if (category) filter.category = category;
        if (condition) filter.condition = condition;
        if (listingType) filter.listingType = listingType;

        // Price range filter
        if (minPrice || maxPrice) {
            filter.$or = [];

            if (minPrice || maxPrice) {
                const priceFilter = {};
                if (minPrice) priceFilter.$gte = parseFloat(minPrice);
                if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
                filter.$or.push({ price: priceFilter });
                filter.$or.push({ rentPrice: priceFilter });
            }

            if (filter.$or.length === 0) delete filter.$or;
        }

        // Search in title, description, and tags
        if (searchQuery && searchQuery.trim()) {
            filter.$text = { $search: searchQuery.trim() };
        }

        // Execute query with pagination
        const [items, total] = await Promise.all([
            Item.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .populate("seller", "username name avatarUrl")
                .populate("college", "name code"),
            Item.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
            items
        });

    } catch (error) {
        console.error("Error fetching items:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// GET /get/:id
export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;

        // Increment view count
        await Item.findByIdAndUpdate(id, { $inc: { views: 1 } });

        const item = await Item.findById(id)
            .populate("seller", "username name avatarUrl mobile email")
            .populate("college", "name code city state");

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (!item.isActive) {
            return res.status(403).json({
                success: false,
                message: "This item is no longer available"
            });
        }

        return res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        console.error("Error fetching item:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// GET /my-items (items posted by current user)
export const getMyItems = async (req, res) => {
    try {
        const { status, isActive } = req.query;

        const filter = { seller: req.user.id };

        if (status) filter.status = status;
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }

        const items = await Item.find(filter)
            .sort({ createdAt: -1 })
            .populate("college", "name code");

        return res.status(200).json({
            success: true,
            items
        });

    } catch (error) {
        console.error("Error fetching user items:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// PUT /update/:id
export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            category,
            condition,
            status,
            price,
            rentPrice,
            rentUnit,
            securityDeposit,
            tags,
            removeImages
        } = req.body;

        // Find item
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Check if user owns the item
        if (item.seller.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You can only update your own items"
            });
        }

        // Update fields
        if (title !== undefined) item.title = title.trim();
        if (description !== undefined) item.description = description?.trim();
        if (category !== undefined) item.category = category;
        if (condition !== undefined) item.condition = condition;
        if (status !== undefined) item.status = status;

        if (item.listingType === "sell" && price !== undefined) {
            item.price = parseFloat(price);
        }

        if (item.listingType === "rent") {
            if (rentPrice !== undefined) item.rentPrice = parseFloat(rentPrice);
            if (rentUnit !== undefined) item.rentUnit = rentUnit;
            if (securityDeposit !== undefined) item.securityDeposit = parseFloat(securityDeposit);
        }

        // Handle tags
        if (tags !== undefined) {
            if (typeof tags === 'string') {
                item.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            } else if (Array.isArray(tags)) {
                item.tags = tags;
            }
        }

        // Handle image removal
        if (removeImages && Array.isArray(removeImages)) {
            item.imageUrls = item.imageUrls.filter(url => !removeImages.includes(url));
        }

        // Handle new image uploads
        const newImageFiles = req.files || [];
        if (newImageFiles.length > 0) {
            const newImageUrls = await uploadMultipleToCloudinary(newImageFiles, "unitrade/items");
            item.imageUrls = [...item.imageUrls, ...newImageUrls];
        }

        // Limit to 5 images max
        if (item.imageUrls.length > 5) {
            item.imageUrls = item.imageUrls.slice(0, 5);
        }

        await item.save();

        // Get populated item
        const populatedItem = await Item.findById(item._id)
            .populate("seller", "username name avatarUrl")
            .populate("college", "name code");

        return res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item: populatedItem
        });

    } catch (error) {
        console.error("Error updating item:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// DELETE /remove/:id
export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Check if user owns the item or is admin
        if (item.seller.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own items"
            });
        }

        // Soft delete (set isActive to false)
        item.isActive = false;
        await item.save();

        return res.status(200).json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting item:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// PATCH /toggle-active/:id (toggle isActive for seller)
export const toggleItemActive = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean"
            });
        }

        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Check if user owns the item
        if (item.seller.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only modify your own items"
            });
        }

        item.isActive = isActive;
        await item.save();

        return res.status(200).json({
            success: true,
            message: isActive ? "Item is now visible" : "Item is now hidden",
            isActive: item.isActive
        });

    } catch (error) {
        console.error("Error toggling item active:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};