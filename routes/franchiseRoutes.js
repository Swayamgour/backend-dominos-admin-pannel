import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createFranchise, getFranchiseDetails, listFranchises } from "../controllers/franchiseController.js";
const router = express.Router();
router.post('/', protect, authorize('super_admin'), createFranchise);
router.get('/', protect, authorize('super_admin'), listFranchises);
router.get('/:franchiseId', protect, authorize('super_admin'), getFranchiseDetails);
export default router;