import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, phone, password, role, franchiseId } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone, and password are required" });
    }

    // Check if phone already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      phone,
      passwordHash,
      role: role || "customer",
      franchiseId: franchiseId || null,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid phone or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, franchiseId: user.franchiseId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile image file is required" });
    }

    // upload to cloudinary → profile_pics folder
    const uploadResult = await uploadToCloudinary(req.file.buffer, "profile_pics");

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: uploadResult.secure_url },
      { new: true, select: "-passwordHash" }
    );

    res.json({
      message: "Profile image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile image update error:", error);
    res.status(500).json({ message: error.message });
  }
};



