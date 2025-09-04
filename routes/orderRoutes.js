import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createOrder, listOrders, updateOrderStatus } from "../controllers/orderController.js";
const router = express.Router();
router.post('/', protect, authorize('super_admin', 'franchise_admin', 'customer'), createOrder);
router.get('/', protect, authorize('super_admin', 'franchise_admin'), listOrders);
router.patch('/:id/status', protect, authorize('super_admin', 'franchise_admin'), updateOrderStatus);
export default router;