import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        contactNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        otp: {
            type: String,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        profileImage: {
            type: String, // URL or filename
            default: null, // empty by default
        },
    },
    { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
