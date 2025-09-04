import express from "express";
import { createFranchise, listFranchises } from "../controllers/franchiseController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only super admin can create franchise
router.post("/", protect, authorize("super_admin"), createFranchise);

// Super admin can see all franchises
router.get("/", protect, authorize("super_admin"), listFranchises);

export default router;
