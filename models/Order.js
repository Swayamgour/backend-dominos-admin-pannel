import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    quantity: Number,
    unitPrice: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Franchise", required: true },
    items: [orderItemSchema],
    subTotal: Number,
    tax: Number,
    deliveryFee: Number,
    discount: Number,
    grandTotal: Number,
    paymentMode: { type: String, enum: ["COD", "UPI", "CARD"], default: "COD" },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"], default: "PENDING" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);