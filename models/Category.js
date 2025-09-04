import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: Number, default: 0 },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Franchise", required: true }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);