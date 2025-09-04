import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["super_admin", "franchise_admin", "customer"], default: "customer" },
  franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Franchise", default: null }
}, { timestamps: true });

export default mongoose.model("User", userSchema);