import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, position, franchiseId } = req.body;
    const payload = { name, position: position || 0 };
    payload.franchiseId = req.user.role === 'franchise_admin' ? req.user.franchiseId : franchiseId;
    if (!payload.franchiseId) return res.status(400).json({ message: 'franchiseId required' });
    const cat = await Category.create(payload);
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listCategories = async (req, res) => {
  try {
    const filter = req.user.role === 'franchise_admin' ? { franchiseId: req.user.franchiseId } : (req.query.franchiseId ? { franchiseId: req.query.franchiseId } : {});
    const cats = await Category.find(filter).sort({ position: 1, name: 1 });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};