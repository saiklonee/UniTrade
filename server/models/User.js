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

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        mobile: { type: String, required: true, unique: true, trim: true },

        role: {
            type: String,
            required: true,
            enum: ["student", "faculty", "admin"],
            default: "student",
        },

        // ✅ Store ONLY the Cloudinary URL (your frontend will upload first, then send url here)
        avatarUrl: { type: String, trim: true, default: "" },

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

        // hashed password
        password: { type: String, required: true, select: false },

        isBlocked: { type: Boolean, default: false },
        lastLoginAt: { type: Date },
    },
    { timestamps: true }
);

userSchema.index({ currentCollege: 1 });
userSchema.index({ role: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
