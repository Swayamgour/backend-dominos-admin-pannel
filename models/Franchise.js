import mongoose from 'mongoose';


const franchiseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: String,
    contact: String,
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    config: {
        taxPercent: { type: Number, default: 0 },
        deliveryFee: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});


const Franchise = mongoose.model('Franchise', franchiseSchema);
export default Franchise;