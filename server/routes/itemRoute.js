import express from "express";
import { upload } from "../configs/multer.js";
import authUser from "../middlewares/authUser.js";
import {
    addItem,
    getItems,
    getItemById,
    getMyItems,
    updateItem,
    deleteItem,
    toggleItemActive
} from "../controllers/itemController.js";

const itemRouter = express.Router();

// Multer config for multiple images (max 5)
const itemImageUpload = upload.array("images", 5);

// Public routes
itemRouter.get("/list", getItems);
itemRouter.get("/get/:id", getItemById);

// Protected routes (require authentication)
itemRouter.post("/add", authUser, itemImageUpload, addItem);
itemRouter.get("/my-items", authUser, getMyItems);
itemRouter.put("/update/:id", authUser, itemImageUpload, updateItem);
itemRouter.delete("/remove/:id", authUser, deleteItem);
itemRouter.patch("/toggle-active/:id", authUser, toggleItemActive);

export default itemRouter;