import express from "express";
import { register, login, updateProfileImage } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
// router.put("/profile-image", protect, updateProfileImage);
router.put("/profile/image", protect, upload.single("profileImage"), updateProfileImage);


router.get("/check-token", protect, (req, res) => {
    res.json({
        valid: true,
        user: req.user, // user details return kar rahe (without passwordHash)
    });
});
export default router;