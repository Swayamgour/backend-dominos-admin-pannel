import express from "express";
import { sendEmailOtp, verifyEmailOtp } from "../controllers/customerAuthController.js";
import { otpRateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Apply middleware only to OTP sending route
router.post("/send-email-otp", otpRateLimiter, sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);

export default router;
