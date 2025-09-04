import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post('/register', register);
router.post('/login', login);

router.get("/check-token", protect, (req, res) => {
    res.json({
        valid: true,
        user: req.user, // user details return kar rahe (without passwordHash)
    });
});
export default router;