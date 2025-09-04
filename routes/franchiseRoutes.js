import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createFranchise, listFranchises } from "../controllers/franchiseController.js";
const router = express.Router();
router.post('/', protect, authorize('super_admin'), createFranchise);
router.get('/', protect, authorize('super_admin'), listFranchises);
export default router;