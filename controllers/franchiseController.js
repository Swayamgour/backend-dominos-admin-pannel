import Franchise from '../models/Franchise.js';
import User from '../models/User.js';

// Create Franchise (only superadmin)
export const createFranchise = async (req, res) => {
  try {
    const { name, city, address, contact, ownerName, ownerEmail, ownerPassword } = req.body;

    // ✅ Create the franchise
    const franchise = await Franchise.create({
      name,
      city,
      address,
      contact,
      ownerUserId: null // We'll fill after creating the owner
    });

    let ownerUser = null;

    // ✅ Optionally create a new franchise admin user if details are provided
    if (ownerName && ownerEmail && ownerPassword) {
      const bcrypt = await import("bcryptjs"); // or require if you use commonjs
      const hash = await bcrypt.hash(ownerPassword, 10);

      ownerUser = await User.create({
        name: ownerName,
        email: ownerEmail,
        passwordHash: hash,
        role: "franchise_admin",
        franchiseId: franchise._id
      });

      // ✅ Update franchise with ownerUserId
      franchise.ownerUserId = ownerUser._id;
      await franchise.save();
    }

    res.status(201).json({
      message: "Franchise created successfully",
      franchise,
      ownerUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List Franchises (superadmin & franchise_admin)
export const listFranchises = async (req, res) => {
  try {
    const { city } = req.query;
    const filter = city ? { city } : {};
    const franchises = await Franchise.find(filter);
    res.json(franchises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
