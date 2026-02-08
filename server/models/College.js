import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, trim: true, unique: true },
        name: { type: String, required: true, trim: true, unique: true },
        shortName: { type: String, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, default: "India" },

        logoUrl: { type: String, trim: true },
        imageUrl: { type: String, trim: true },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

collegeSchema.index({ slug: 1 });
collegeSchema.index({ name: 1 });

const College = mongoose.models.College || mongoose.model("College", collegeSchema);

export default College;

