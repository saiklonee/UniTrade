// middlewares/requireAdmin.js
import User from "../models/User.js";

const requireAdmin = async (req, res, next) => {
    try {
        const me = await User.findById(req.user.id).select("role isBlocked");
        if (!me) return res.status(401).json({ success: false, message: "Not authenticated" });
        if (me.isBlocked) return res.status(403).json({ success: false, message: "Account blocked" });
        if (me.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }
        next();
    } catch (e) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export default requireAdmin;
