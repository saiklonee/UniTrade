import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true }, // Amity University
        shortName: { type: String, trim: true }, // Amity
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, default: "India" },

        // ✅ Cloudinary URLs only
        logoUrl: { type: String, trim: true },   // small logo
        imageUrl: { type: String, trim: true },  // banner / cover image

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

collegeSchema.index({ slug: 1 });
collegeSchema.index({ name: 1 });

const College = mongoose.models.College || mongoose.model("College", collegeSchema);

export default College;

