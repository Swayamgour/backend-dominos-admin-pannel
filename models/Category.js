import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise' },
    position: Number,
    active: { type: Boolean, default: true }
});


const Category = mongoose.model('Category', categorySchema);
export default Category;