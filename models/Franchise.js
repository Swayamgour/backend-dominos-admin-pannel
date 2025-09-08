import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String },
    state: { type: String }, // ✅ Added state field
    address: { type: String },
    phone: { type: String },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Franchise", franchiseSchema);
