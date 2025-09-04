import mongoose from 'mongoose';


const itemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    qty: Number,
    price: Number,
    variant: String
}, { _id: false });


const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Franchise' },
    items: [itemSchema],
    totals: {
        subtotal: Number,
        tax: Number,
        deliveryFee: Number,
        grandTotal: Number
    },
    payment: {
        provider: String,
        providerPaymentId: String,
        status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
        method: { type: String, enum: ['cod', 'razorpay', 'stripe', 'paypal'] }
    },
    status: { type: String, enum: ['placed', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'], default: 'placed' },
    assignedRider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


const Order = mongoose.model('Order', orderSchema);
export default Order;