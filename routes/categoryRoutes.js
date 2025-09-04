import express from "express";
import { createCategory, listCategories } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
// import { protect, isSuperAdmin, isFranchiseAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create Category (Super Admin or Franchise Admin)
router.post(
  "/",
  protect,
  (req, res, next) => {
    if (req.user.role === "super_admin" || req.user.role === "franchise_admin") {
      next();
    } else {
      return res.status(403).json({ message: "Not authorized" });
    }
  },
  createCategory
);

// ✅ List Categories (by franchise)
router.get("/", protect, listCategories);

export default router;
