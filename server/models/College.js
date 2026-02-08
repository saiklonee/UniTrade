import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, trim: true, unique: true }, // e.g. AMITY_NOIDA
        name: { type: String, required: true, trim: true, unique: true }, // e.g. Amity University
        shortName: { type: String, trim: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        }, // e.g. amity

        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, default: "India", trim: true },

        // Cloudinary URLs only
        logoUrl: { type: String, trim: true },
        imageUrl: { type: String, trim: true },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);


const College = mongoose.models.College || mongoose.model("College", collegeSchema);

export default College;
