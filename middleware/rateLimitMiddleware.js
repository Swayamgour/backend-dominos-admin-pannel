import rateLimit from "express-rate-limit";

export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // max 5 requests per 15 minutes per IP
  message: "Too many OTP requests, please try again later",
  standardHeaders: true, // ✅ good practice - adds RateLimit-* headers
  legacyHeaders: false,  // ✅ disables X-RateLimit-* headers
});
