import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const franchiseId = req.user.role === 'franchise_admin' ? req.user.franchiseId : req.body.franchiseId;
    if (!franchiseId) return res.status(400).json({ message: 'franchiseId required' });

    const { items, paymentMode = 'COD' } = req.body; // items: [{ productId, quantity }]
    if (!items || !items.length) return res.status(400).json({ message: 'items required' });

    const enriched = [];
    let subTotal = 0;
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p || p.franchiseId.toString() !== franchiseId.toString()) return res.status(400).json({ message: 'Invalid product' });
      const unitPrice = p.price || 0;
      enriched.push({ productId: p._id, name: p.name, quantity: it.quantity, unitPrice });
      subTotal += unitPrice * it.quantity;
    }

    const tax = Math.round(subTotal * 0.05);
    const deliveryFee = 30;
    const grandTotal = subTotal + tax + deliveryFee;

    const order = await Order.create({ customerId: req.user._id, franchiseId, items: enriched, subTotal, tax, deliveryFee, discount: 0, grandTotal, paymentMode });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'franchise_admin' ? { franchiseId: req.user.franchiseId } : (req.query.franchiseId ? { franchiseId: req.query.franchiseId } : {});
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["PENDING", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const filter = { _id: id };
    if (req.user.role === 'franchise_admin') filter.franchiseId = req.user.franchiseId;

    const ord = await Order.findOne(filter);
    if (!ord) return res.status(404).json({ message: 'Order not found' });
    ord.status = status;
    await ord.save();
    res.json(ord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};