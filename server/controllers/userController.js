import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { username, name, email, password, mobile, role, permanentCollege } = req.body;
        if (!username || !name || !email || !password || !mobile || !role || !permanentCollege) {
            return res.json({ success: false, message: "missing details" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ username, name, email, password: hashedPassword, mobile, role, permanentCollege, currentCollege: permanentCollege });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true, // prevent js to access cookie
            secure: process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF Protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
        });

        return res.json({
            success: true,
            user: { email: user.email, name: user.name },
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Login User : /api/user/login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password || !role) {
            return res.json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            httpOnly: true, // prevent js to access cookie
            secure: process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF Protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiration time
        });

        return res.json({
            success: true,
            user: { email: user.email, name: user.name },
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//Check Auth : /api/user/is-auth

export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user });
    } catch (error) {
        console.error("isAuth error:", error);
        if (error.name === "CastError") {
            return res
                .status(400)
                .json({ success: false, message: "Invalid user ID format" });
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// logout User : /api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true, // prevent js to access cookie
            secure: process.env.NODE_ENV === "production", // use secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF Protection
        });

        return res.json({ success: true, message: "user is logged out" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
