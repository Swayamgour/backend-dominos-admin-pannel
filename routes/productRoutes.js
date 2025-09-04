import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createProduct, listProducts } from "../controllers/productController.js";
const router = express.Router();
router.post('/', protect, authorize('super_admin', 'franchise_admin'), createProduct);
router.get('/', protect, authorize('super_admin', 'franchise_admin'), listProducts);
export default router;
