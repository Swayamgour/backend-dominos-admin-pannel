import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, franchiseId } = req.body;
    const payload = { name, description, price };
    payload.franchiseId = req.user.role === 'franchise_admin' ? req.user.franchiseId : franchiseId;
    payload.categoryId = categoryId;
    if (!payload.franchiseId || !payload.categoryId) return res.status(400).json({ message: 'franchiseId and categoryId required' });

    // validate category belongs to franchise (safety)
    const cat = await Category.findById(payload.categoryId);
    if (!cat || cat.franchiseId.toString() !== payload.franchiseId.toString()) return res.status(400).json({ message: 'Invalid category' });

    const item = await Product.create(payload);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const filter = req.user.role === 'franchise_admin' ? { franchiseId: req.user.franchiseId } : (req.query.franchiseId ? { franchiseId: req.query.franchiseId } : {});
    const items = await Product.find(filter).populate('categoryId', 'name').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
