import express from "express";
import { getCustomerProfile, sendEmailOtp, verifyEmailOtp } from "../controllers/customerAuthController.js";
import { otpRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { protect, protectCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply middleware only to OTP sending route
router.post("/send-email-otp", otpRateLimiter, sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);


// router.get("/CustomerProfile" , protectCustomer)
router.get("/customerProfile", protectCustomer, getCustomerProfile);

router.get("/check-token", protectCustomer, (req, res) => {
    return res.json({
        message: "Token is valid",
        user: req.user,
    });
});


export default router;
