import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, franchiseId } = req.body;

    const finalFranchiseId =
      req.user.role === "franchise_admin" ? req.user.franchiseId : franchiseId;

    if (!finalFranchiseId || !categoryId) {
      return res.status(400).json({ message: "franchiseId and categoryId required" });
    }

    const cat = await Category.findById(categoryId);
    if (!cat || cat.franchiseId.toString() !== finalFranchiseId.toString()) {
      return res.status(400).json({ message: "Invalid category" });
    }

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "product_images");
      imageUrl = uploadResult.secure_url;
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
      franchiseId: finalFranchiseId,
      image: imageUrl,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (
      req.user.role === "franchise_admin" &&
      product.franchiseId.toString() !== req.user.franchiseId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized to update this product" });
    }

    if (categoryId) {
      const cat = await Category.findById(categoryId);
      if (!cat || cat.franchiseId.toString() !== product.franchiseId.toString()) {
        return res.status(400).json({ message: "Invalid category" });
      }
      product.categoryId = categoryId;
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "product_images");
      product.image = uploadResult.secure_url;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ List Products
export const listProducts = async (req, res) => {
  try {
    const filter =
      req.user.role === 'franchise_admin'
        ? { franchiseId: req.user.franchiseId }
        : req.query.franchiseId
          ? { franchiseId: req.query.franchiseId }
          : {};

    const items = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Product

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // check franchise scope
    if (req.user.role === 'franchise_admin' && product.franchiseId.toString() !== req.user.franchiseId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
