import mongoose from "mongoose";

const franchiseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: String,
    address: String,
    contact: String,
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

export default mongoose.model("Franchise", franchiseSchema);