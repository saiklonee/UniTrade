import mongoose from "mongoose";

const cloudinaryAssetSchema = new mongoose.Schema(
    {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
    },
    { _id: false }
);

const itemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 80 },
        description: { type: String, trim: true, maxlength: 2000 },

        category: {
            type: String,
            enum: ["books", "electronics", "furniture", "notes", "sports", "cycles", "stationery", "hostel", "other"],
            default: "other",
        },

        condition: {
            type: String,
            enum: ["new", "like_new", "good", "fair", "poor"],
            default: "good",
        },

        // Cloudinary only for storing item images
        images: { type: [cloudinaryAssetSchema], default: [] },

        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        // IMPORTANT: which college feed it belongs to
        college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },

        // Sell or Rent
        listingType: { type: String, enum: ["sell", "rent"], required: true },

        // pricing (sell)
        price: { type: Number, min: 0 },

        // pricing (rent)
        rentPrice: { type: Number, min: 0 },
        rentUnit: { type: String, enum: ["day", "week", "month"] },
        securityDeposit: { type: Number, min: 0, default: 0 },

        // Core visibility: if sold outside or inside -> make inactive
        isActive: { type: Boolean, default: true },

        status: {
            type: String,
            enum: ["available", "sold", "rented_out"],
            default: "available",
        },

        views: { type: Number, default: 0 },

        // Optional helpers for UI
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

// Feed performance
itemSchema.index({ college: 1, isActive: 1, createdAt: -1 });
itemSchema.index({ seller: 1, isActive: 1, createdAt: -1 });
itemSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Item", itemSchema);
