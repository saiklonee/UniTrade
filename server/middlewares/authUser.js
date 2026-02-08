// middlewares/authUser.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authUser = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user WITHOUT populating first (debug)
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked"
            });
        }


        // Now populate the college fields separately to debug
        if (user.currentCollege) {
            const populatedUser = await User.findById(user._id)
                .populate("currentCollege")
                .populate("permanentCollege")
                .select("-password");

            req.user = populatedUser;
        } else {
            req.user = user;
        }

        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authUser;