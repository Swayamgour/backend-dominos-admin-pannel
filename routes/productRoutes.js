import express from "express";
import { createProduct, listProducts } from "../controllers/productController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Franchise admin can add product in his franchise
// Super admin can also add product by giving franchiseId in body
router.post("/", protect, authorize("super_admin", "franchise_admin"), createProduct);

// List products -> by franchise or all
router.get("/", protect, listProducts);

export default router;
