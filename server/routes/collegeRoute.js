import express from "express";
import {
    addCollege,
    getAllColleges,
    getCollegeById,
    updateCollegeById,
    removeCollege,
} from "../controllers/collegeController.js";
import { upload } from "../configs/multer.js";

const collegeRouter = express.Router();

// ✅ multer needed for logo/image
const collegeUpload = upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
]);

collegeRouter.post("/add", collegeUpload, addCollege);
collegeRouter.get("/list", getAllColleges);
collegeRouter.get("/get/:id", getCollegeById);
collegeRouter.put("/update/:id", collegeUpload, updateCollegeById);
collegeRouter.delete("/remove/:id", removeCollege);

export default collegeRouter;
