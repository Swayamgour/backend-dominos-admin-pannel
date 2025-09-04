import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const franchiseId =
      req.user.role === "franchise_admin" ? req.user.franchiseId : req.body.franchiseId;

    const { name, price, categoryId } = req.body;

    const product = await Product.create({
      name,
      price,
      categoryId,
      franchiseId,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const franchiseId =
      req.user.role === "franchise_admin" ? req.user.franchiseId : req.query.franchiseId;

    const filter = franchiseId ? { franchiseId } : {};
    const products = await Product.find(filter).populate("categoryId", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
