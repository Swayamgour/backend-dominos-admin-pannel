import Franchise from "../models/Franchise.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const createFranchise = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Only super_admin can create franchises" });
    }

    const { name, city, state, address, phone, owner } = req.body;

    // ✅ Validate required fields
    if (!name || !city || !state || !address || !phone) {
      return res.status(400).json({
        message: "Please provide name, city, state, address, and phone",
      });
    }

    // ✅ Check if franchise with same phone exists
    const existingFranchise = await Franchise.findOne({ phone });
    if (existingFranchise) {
      return res
        .status(400)
        .json({ message: "Franchise with this phone number already exists" });
    }

    // ✅ Create Franchise first
    const franchise = await Franchise.create({
      name,
      city,
      state,
      address,
      phone,
    });

    let ownerUser = null;

    // ✅ Create owner user if provided
    if (owner?.name && owner?.phone && owner?.password) {
      const exists = await User.findOne({ phone: owner.phone });
      if (exists) {
        return res
          .status(400)
          .json({ message: "Owner phone number already exists" });
      }

      const hash = await bcrypt.hash(owner.password, 10);

      ownerUser = await User.create({
        name: owner.name,
        phone: owner.phone,
        passwordHash: hash,
        role: "franchise_admin",
        franchiseId: franchise._id,
      });

      // ✅ Attach owner user to franchise
      franchise.ownerUserId = ownerUser._id;
      await franchise.save();
    }

    res.status(201).json({
      success: true,
      message: "Franchise created successfully",
      franchise,
      ownerUser,
    });
  } catch (err) {
    console.error("Error creating franchise:", err);
    res.status(500).json({ message: err.message });
  }
};


export const listFranchises = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Only super_admin can list franchises" });
    }

    // ✅ Populate owner details for better UI display
    const franchises = await Franchise.find()
      .populate("ownerUserId", "name phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({

      franchises,
    });
  } catch (err) {
    console.error("Error fetching franchises:", err);
    res.status(500).json({ message: err.message });
  }
};
