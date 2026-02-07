import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    },
    { timestamps: true }
);

wishlistSchema.index({ user: 1 });

export default mongoose.model("Wishlist", wishlistSchema);
