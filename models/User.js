import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true }, // ✅ Added phone
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "franchise_admin", "customer"],
      default: "customer",
    },
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
      default: null,
    },
    profileImage: {
      type: String, // URL or filename
      default: "", // empty by default
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
