
import { otpSet, otpGet, otpDel } from "../config/otpStore.js";
import Customer from "../models/Customer.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/transporter.js";



const OTP_TTL = 5 * 60; // 5 minutes


export const sendEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("📩 Email received:", email);

        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("✅ Generated OTP:", otp);

        await otpSet(`otp:email:${email}`, { otp, attempts: 0 }, OTP_TTL);
        console.log("💾 OTP saved");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Login OTP",
            html: `<h2>Your OTP: ${otp}</h2><p>This code will expire in 5 minutes.</p>`,
        });

        console.log("📨 Email sent:", info.messageId);
        return res.json({ message: "OTP sent to email" });
    } catch (error) {
        console.error("sendEmailOtp error:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};






export const verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP required" });
        }

        // 1️⃣ Get saved OTP from store
        const savedOtpData = await otpGet(`otp:email:${email}`);
        if (!savedOtpData) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        // 2️⃣ Check OTP match
        if (savedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // 3️⃣ OTP is correct → delete from store
        await otpDel(`otp:email:${email}`);

        // 4️⃣ Check if customer exists, else create one
        let customer = await Customer.findOne({ email });

        if (!customer) {
            customer = await Customer.create({
                email,
                contactNumber: "NA", // ✅ placeholder so schema validation passes
                name: "",            // optional - can be updated later
            });
        }

        // 5️⃣ Generate token for login
        const token = jwt.sign(
            { id: customer._id, role: "customer" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: customer,
        });
    } catch (error) {
        console.error("verifyEmailOtp error:", error);
        return res.status(500).json({ message: "OTP verification failed" });
    }
};


