import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createFranchise, getFranchiseDetails, listFranchises, updateFranchiseStatus } from "../controllers/franchiseController.js";
const router = express.Router();
router.post('/', protect, authorize('super_admin'), createFranchise);
router.get('/', protect, authorize('super_admin'), listFranchises);
router.get('/:franchiseId', protect, authorize('super_admin'), getFranchiseDetails);
// Update franchise by ID
router.put('/:franchiseId', protect, authorize('super_admin'), updateFranchiseStatus);

export default router;