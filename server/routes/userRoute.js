import express from "express";
import { upload } from "../configs/multer.js";
import authUser from "../middlewares/authUser.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import {
    register,
    login,
    logout,
    isAuth,
    updateMe,
    changeMyPassword,
    getAllUsers,
    getUserById,
    blockUser,
    adminUpdateUser,
    deleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

// ✅ Multer config for avatar upload (single file)
const avatarUpload = upload.single("avatar");

// Public routes
userRouter.post("/register", avatarUpload, register);
userRouter.post("/login", login);

// Protected routes (requires authentication)
userRouter.get("/is-auth", authUser, isAuth);
userRouter.post("/logout", authUser, logout);
userRouter.patch("/me", authUser, avatarUpload, updateMe);
userRouter.patch("/me/password", authUser, changeMyPassword);

// Admin routes
userRouter.get("/", authUser, requireAdmin, getAllUsers);
userRouter.get("/:id", authUser, requireAdmin, getUserById);
userRouter.patch("/:id/block", authUser, requireAdmin, blockUser);
userRouter.patch("/:id", authUser, requireAdmin, avatarUpload, adminUpdateUser);
userRouter.delete("/:id", authUser, requireAdmin, deleteUser);

export default userRouter;