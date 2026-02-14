import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import userRouter from "./routes/userRoute.js";
import collegeRouter from "./routes/collegeRoute.js";
import itemRouter from "./routes/itemRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

/* =========================================
   TRUST PROXY (IMPORTANT FOR VERCEL/RENDER)
========================================= */
app.set("trust proxy", 1);

/* =========================================
   GLOBAL RATE LIMITER
========================================= */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // max 200 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

// Apply globally
app.use(globalLimiter);

/* =========================================
   STRICT AUTH LIMITER (Brute-force protection)
========================================= */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // only 5 attempts per 15 mins
    message: {
        success: false,
        message: "Too many login attempts. Try again after 15 minutes."
    }
});

/* =========================================
   CORS SETUP
========================================= */
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://unitrade-delta.vercel.app"
];

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, origin);
            }

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);

/* =========================================
   ROUTES
========================================= */

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Apply auth limiter only to login & register routes
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);

app.use("/api/user", userRouter);
app.use("/api/college", collegeRouter);
app.use("/api/item", itemRouter);
app.use("/api/wishlist", wishlistRouter);

/* =========================================
   START SERVER
========================================= */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
