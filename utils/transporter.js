// utils/transporter.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ Gmail use kar rahe ho to
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
