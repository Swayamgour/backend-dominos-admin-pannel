import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    variants: [{ name: String, priceDiff: Number }],
    images: [String],
    isAvailable: { type: Boolean, default: true },
    inventoryCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});


const Product = mongoose.model('Product', productSchema);
export default Product;