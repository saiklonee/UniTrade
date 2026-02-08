// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },

        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        mobile: { type: String, trim: true },

        role: {
            type: String,
            enum: ["student", "faculty", "admin"],
            default: "student",
        },

        // ✅ Cloudinary URL only
        avatarUrl: { type: String, trim: true },

        permanentCollege: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true,
        },

        currentCollege: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true,
        },

        passwordHash: { type: String, required: true },

        isBlocked: { type: Boolean, default: false },
        lastLoginAt: { type: Date },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ currentCollege: 1 });
userSchema.index({ role: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
