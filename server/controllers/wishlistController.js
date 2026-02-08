import Wishlist from "../models/Wishlist.js";
import Item from "../models/Item.js";

// GET /api/wishlist - Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find or create wishlist for user
        let wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: 'items',
                populate: [
                    { path: 'seller', select: 'username name avatarUrl' },
                    { path: 'college', select: 'name code' }
                ]
            });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [] });
        }

        return res.status(200).json({
            success: true,
            wishlist: wishlist
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// POST /api/wishlist/add/:itemId - Add item to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Check if item is active
        if (!item.isActive || item.status !== "available") {
            return res.status(400).json({
                success: false,
                message: "Item is not available"
            });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, items: [itemId] });
        } else {
            // Check if item already in wishlist
            if (wishlist.items.includes(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: "Item already in wishlist"
                });
            }

            // Add item to wishlist
            wishlist.items.push(itemId);
            await wishlist.save();
        }

        // Populate the items
        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'items',
                populate: [
                    { path: 'seller', select: 'username name avatarUrl' },
                    { path: 'college', select: 'name code' }
                ]
            });

        return res.status(200).json({
            success: true,
            message: "Item added to wishlist",
            wishlist: populatedWishlist
        });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// DELETE /api/wishlist/remove/:itemId - Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        // Check if item is in wishlist
        if (!wishlist.items.includes(itemId)) {
            return res.status(400).json({
                success: false,
                message: "Item not in wishlist"
            });
        }

        // Remove item from wishlist
        wishlist.items = wishlist.items.filter(id => id.toString() !== itemId);
        await wishlist.save();

        // Populate remaining items
        const populatedWishlist = await Wishlist.findById(wishlist._id)
            .populate({
                path: 'items',
                populate: [
                    { path: 'seller', select: 'username name avatarUrl' },
                    { path: 'college', select: 'name code' }
                ]
            });

        return res.status(200).json({
            success: true,
            message: "Item removed from wishlist",
            wishlist: populatedWishlist
        });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// DELETE /api/wishlist/clear - Clear entire wishlist
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        wishlist.items = [];
        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Wishlist cleared",
            wishlist: wishlist
        });
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// GET /api/wishlist/check/:itemId - Check if item is in wishlist
export const checkInWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const wishlist = await Wishlist.findOne({ user: userId });

        const isInWishlist = wishlist ? wishlist.items.includes(itemId) : false;

        return res.status(200).json({
            success: true,
            isInWishlist: isInWishlist
        });
    } catch (error) {
        console.error("Error checking wishlist:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// GET /api/wishlist/count - Get wishlist item count
export const getWishlistCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId });

        const count = wishlist ? wishlist.items.length : 0;

        return res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error("Error getting wishlist count:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};