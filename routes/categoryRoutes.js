import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createCategory, listCategories } from "../controllers/categoryController.js";
const router = express.Router();
router.post('/', protect, authorize('super_admin', 'franchise_admin'), createCategory);
router.get('/', protect, authorize('super_admin', 'franchise_admin'), listCategories);
export default router;
