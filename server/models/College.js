import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    code: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

})

const College = mongoose.models.college || mongoose.model("college", collegeSchema);

export default College;
