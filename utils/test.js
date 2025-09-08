// testTransporter.js
import { transporter } from "./utils/transporter.js";

async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "your_email@gmail.com",
      subject: "Test Email",
      text: "This is a test email",
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Transporter error:", error);
  }
}

testMail();
