import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, default: 0 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Franchise", required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
