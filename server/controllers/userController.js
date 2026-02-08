import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";

// Upload helper for Cloudinary
const uploadToCloudinary = async (file, folder = "unitrade/userAvatars") => {
    if (!file?.path) return null;

    const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: "image",
    });

    return result.secure_url;
};

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const safeUser = (u) => ({
    id: u._id,
    username: u.username,
    name: u.name,
    email: u.email,
    mobile: u.mobile,
    role: u.role,
    avatarUrl: u.avatarUrl,
    permanentCollege: u.permanentCollege,
    currentCollege: u.currentCollege,
    isBlocked: u.isBlocked,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
});

// POST /api/user/register
export const register = async (req, res) => {
    try {
        const { username, name, email, password, mobile, role, permanentCollege } = req.body;
        const avatarFile = req.file; // Single file for avatar

        if (!username || !name || !email || !password || !mobile || !permanentCollege) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: username, name, email, password, mobile, permanentCollege"
            });
        }

        // Password validation
        if (String(password).length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const desiredRole = role || "student";
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedUsername = username.toLowerCase().trim();
        const normalizedMobile = String(mobile).trim();

        // Check duplicates
        const existing = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername },
                { mobile: normalizedMobile }
            ],
        });

        if (existing) {
            let conflictField = "email/username/mobile";
            if (existing.email === normalizedEmail) conflictField = "email";
            else if (existing.username === normalizedUsername) conflictField = "username";
            else if (existing.mobile === normalizedMobile) conflictField = "mobile";

            return res.status(409).json({
                success: false,
                message: `User with this ${conflictField} already exists`
            });
        }

        // Upload avatar if provided
        let avatarUrl = "";
        if (avatarFile) {
            avatarUrl = await uploadToCloudinary(avatarFile, "unitrade/userAvatars");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: normalizedUsername,
            name: name.trim(),
            email: normalizedEmail,
            mobile: normalizedMobile,
            role: desiredRole,
            avatarUrl,
            permanentCollege,
            currentCollege: permanentCollege,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        setAuthCookie(res, token);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: safeUser(user)
        });
    } catch (error) {
        if (error?.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(409).json({
                success: false,
                message: `${field} already in use`
            });
        }
        console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked. Please contact administrator."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        setAuthCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: safeUser(user)
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// GET /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("permanentCollege", "name code")
            .populate("currentCollege", "name code");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked"
            });
        }

        return res.status(200).json({
            success: true,
            user: safeUser(user)
        });
    } catch (error) {
        console.error("IsAuth error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// POST /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PATCH /api/user/me
export const updateMe = async (req, res) => {
    try {
        const { name, mobile, currentCollege } = req.body;
        const avatarFile = req.file;

        const update = {};
        if (name !== undefined && name.trim() !== "") {
            update.name = name.trim();
        }

        if (currentCollege !== undefined) {
            update.currentCollege = currentCollege;
        }

        // Handle mobile unique check
        if (mobile !== undefined) {
            const m = String(mobile).trim();
            const taken = await User.findOne({
                mobile: m,
                _id: { $ne: req.user.id }
            });

            if (taken) {
                return res.status(409).json({
                    success: false,
                    message: "Mobile number already in use"
                });
            }
            update.mobile = m;
        }

        // Handle avatar upload
        if (avatarFile) {
            update.avatarUrl = await uploadToCloudinary(avatarFile, "unitrade/userAvatars");
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            update,
            { new: true, runValidators: true }
        ).populate("permanentCollege", "name code")
            .populate("currentCollege", "name code");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: safeUser(user)
        });
    } catch (error) {
        if (error?.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(409).json({
                success: false,
                message: `${field} already in use`
            });
        }
        console.error("UpdateMe error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// PATCH /api/user/me/password
export const changeMyPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old and new password are required"
            });
        }

        if (String(newPassword).length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error("ChangeMyPassword error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ADMIN: GET /api/user
export const getAllUsers = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
        const skip = (page - 1) * limit;

        const { q, role, currentCollege, isBlocked } = req.query;
        const filter = {};

        if (role) filter.role = role;
        if (currentCollege) filter.currentCollege = currentCollege;

        if (isBlocked === "true") filter.isBlocked = true;
        else if (isBlocked === "false") filter.isBlocked = false;

        if (q && q.trim() !== "") {
            const searchTerm = q.trim();
            filter.$or = [
                { name: { $regex: searchTerm, $options: "i" } },
                { username: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
                { mobile: { $regex: searchTerm, $options: "i" } },
            ];
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("permanentCollege", "name code")
                .populate("currentCollege", "name code"),
            User.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            users: users.map(safeUser),
        });
    } catch (error) {
        console.error("GetAllUsers error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ADMIN: GET /api/user/:id
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("permanentCollege", "name code")
            .populate("currentCollege", "name code");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: safeUser(user)
        });
    } catch (error) {
        console.error("GetUserById error:", error);
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
};

// ADMIN: PATCH /api/user/:id/block
export const blockUser = async (req, res) => {
    try {
        const { blocked } = req.body;

        if (typeof blocked !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Blocked must be a boolean value"
            });
        }

        // Prevent self-blocking
        if (String(req.params.id) === String(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot block yourself"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked: blocked },
            { new: true }
        ).populate("permanentCollege", "name code")
            .populate("currentCollege", "name code");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: blocked ? "User blocked successfully" : "User unblocked successfully",
            user: safeUser(user),
        });
    } catch (error) {
        console.error("BlockUser error:", error);
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
};

// ADMIN: PATCH /api/user/:id
export const adminUpdateUser = async (req, res) => {
    try {
        const { name, mobile, role, currentCollege, permanentCollege } = req.body;
        const avatarFile = req.file;

        const update = {};

        if (name !== undefined && name.trim() !== "") {
            update.name = name.trim();
        }

        if (role !== undefined) {
            update.role = role;
        }

        if (currentCollege !== undefined) {
            update.currentCollege = currentCollege;
        }

        if (permanentCollege !== undefined) {
            update.permanentCollege = permanentCollege;
        }

        // Handle mobile unique check
        if (mobile !== undefined) {
            const m = String(mobile).trim();
            const taken = await User.findOne({
                mobile: m,
                _id: { $ne: req.params.id }
            });

            if (taken) {
                return res.status(409).json({
                    success: false,
                    message: "Mobile number already in use"
                });
            }
            update.mobile = m;
        }

        // Handle avatar upload
        if (avatarFile) {
            update.avatarUrl = await uploadToCloudinary(avatarFile, "unitrade/userAvatars");
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        ).populate("permanentCollege", "name code")
            .populate("currentCollege", "name code");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: safeUser(user)
        });
    } catch (error) {
        if (error?.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(409).json({
                success: false,
                message: `${field} already in use`
            });
        }
        console.error("AdminUpdateUser error:", error);
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        });
    }
};

// ADMIN: DELETE /api/user/:id (Optional - if you need delete functionality)
export const deleteUser = async (req, res) => {
    try {
        // Prevent self-deletion
        if (String(req.params.id) === String(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete yourself"
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("DeleteUser error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};