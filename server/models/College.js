import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true }, // "Amity University"
        shortName: { type: String, trim: true }, // "Amity"
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // "amity"
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, default: "India" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

collegeSchema.index({ slug: 1 });

export default mongoose.model("College", collegeSchema);
