import Franchise from "../models/Franchise.js";
import User from "../models/User.js";



export const createFranchise = async (req, res) => {
  try {
    // Only super_admin can create franchises
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super_admin can create franchises' });
    }

    const { name, city, address, contact, ownerName, ownerEmail, ownerPassword } = req.body;

    // ✅ Validate required fields
    if (!name || !city || !address || !contact) {
      return res.status(400).json({ message: 'Please provide name, city, address, and contact' });
    }

    // ✅ Check if contact already exists
    const existingFranchise = await Franchise.findOne({ contact });
    if (existingFranchise) {
      return res.status(400).json({ message: 'Franchise with this contact number already exists' });
    }

    // ✅ Create Franchise
    const franchise = await Franchise.create({ name, city, address, contact });

    let ownerUser = null;

    // ✅ Create owner user if data is provided
    if (ownerName && ownerEmail && ownerPassword) {
      // Check if email already exists
      const exists = await User.findOne({ email: ownerEmail });
      if (exists) {
        return res.status(400).json({ message: 'Owner email is already registered' });
      }

      // Hash password
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash(ownerPassword, 10);

      ownerUser = await User.create({
        name: ownerName,
        email: ownerEmail,
        passwordHash: hash,
        role: 'franchise_admin',
        franchiseId: franchise._id
      });

      franchise.ownerUserId = ownerUser._id;
      await franchise.save();
    }

    res.status(201).json({ franchise, ownerUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listFranchises = async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') return res.status(403).json({ message: 'Only super_admin can list franchises' });
    const items = await Franchise.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};