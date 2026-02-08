import express from "express";
import authUser from "../middlewares/authUser.js";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkInWishlist,
    getWishlistCount
} from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

// All routes require authentication
wishlistRouter.get("/", authUser, getWishlist);
wishlistRouter.post("/add/:itemId", authUser, addToWishlist);
wishlistRouter.delete("/remove/:itemId", authUser, removeFromWishlist);
wishlistRouter.delete("/clear", authUser, clearWishlist);
wishlistRouter.get("/check/:itemId", authUser, checkInWishlist);
wishlistRouter.get("/count", authUser, getWishlistCount);

export default wishlistRouter;