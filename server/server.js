import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
const port = process.env.PORT || 4000;


// Allow multiple origins

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
];

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})