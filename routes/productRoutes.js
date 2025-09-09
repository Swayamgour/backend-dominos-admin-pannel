import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
// import { upload } from "../middleware/uploadMiddleware.js";
import {
    createProduct,
    listProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
    '/',
    protect,
    authorize('super_admin', 'franchise_admin'),
    upload.single("image"),   // <--- image upload here
    createProduct
);

// router.post("/product/add", upload.single("image"), addProduct);

router.get(
    '/',
    protect,
    authorize('super_admin', 'franchise_admin'),
    listProducts
);

router.put(
    '/:id',
    protect,
    authorize('super_admin', 'franchise_admin'),
    upload.single("image"),   // <--- image upload for update too
    updateProduct
);

router.delete(
    '/:id',
    protect,
    authorize('super_admin', 'franchise_admin'),
    deleteProduct
);

export default router;
