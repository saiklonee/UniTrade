import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 80 },
        description: { type: String, trim: true, maxlength: 2000 },

        category: {
            type: String,
            enum: [
                "books",
                "electronics",
                "furniture",
                "notes",
                "sports",
                "cycles",
                "stationery",
                "hostel",
                "other",
            ],
            default: "other",
        },

        condition: {
            type: String,
            enum: ["new", "like_new", "good", "fair", "poor"],
            default: "good",
        },

        // ✅ Cloudinary URLs only
        imageUrls: {
            type: [String],
            default: [],
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Which college feed this item belongs to
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true,
        },

        listingType: {
            type: String,
            enum: ["sell", "rent"],
            required: true,
        },

        // Sell
        price: { type: Number, min: 0 },

        // Rent
        rentPrice: { type: Number, min: 0 },
        rentUnit: { type: String, enum: ["day", "week", "month"] },
        securityDeposit: { type: Number, min: 0, default: 0 },

        // ⭐ Core logic
        isActive: { type: Boolean, default: true },
        status: {
            type: String,
            enum: ["available", "sold", "rented_out"],
            default: "available",
        },

        views: { type: Number, default: 0 },
        tags: { type: [String], default: [] },
    },
    { timestamps: true }
);

itemSchema.index({ college: 1, isActive: 1, createdAt: -1 });
itemSchema.index({ seller: 1, isActive: 1, createdAt: -1 });
itemSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Item", itemSchema);
