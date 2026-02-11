import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoute.js"
import collegeRouter from "./routes/collegeRoute.js";
import itemRouter from "./routes/itemRoute.js";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import wishlistRouter from "./routes/wishlistRoute.js";


const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// Allow multiple origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://unitrade-delta.vercel.app"
];

//Middle Ware Configuration
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Hello World");
});

// apis
app.use("/api/user", userRouter)
app.use("/api/college", collegeRouter)
app.use("/api/item", itemRouter)
app.use("/api/wishlist", wishlistRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})