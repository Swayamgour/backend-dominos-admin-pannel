import mongoose from "mongoose";
import dotenv from "dotenv";
import Franchise from "./models/Franchise.js";
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";
import Customer from "./models/Customer.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

const createDummyData = async () => {
  try {
    // Find a franchise and customer
    const franchise = await Franchise.findOne(); // Or create a new one
    const customer = await Customer.findOne(); // Or create a new one

    if (!franchise || !customer) {
      console.log("Franchise or Customer not found");
      return;
    }

    // Create dummy order
    const order = await Order.create({
      franchiseId: '68b9707692498ed846206b43',
      customerId: customer._id,
      items: [
        { name: "Pizza", quantity: 2, unitPrice: 200 },
        { name: "Burger", quantity: 1, unitPrice: 100 },
        { name: "Pizza", quantity: 2, unitPrice: 200 },
        // { productName: "Burger", quantity: 1, price: 100 },
      ],
      totalAmount: 500,
      status: "PENDING",
    });

    // Create dummy payment
    await Payment.create({
      franchiseId: '68b9707692498ed846206b43',
      customerId: customer._id,
      orderId: order._id,
      amount: 500,
      paymentMode: "Online",
      status: "Completed",
      transactionId: "TXN123456789",
    });

    console.log("Dummy order & payment created!");
    process.exit();
  } catch (error) {
    console.error("Error creating dummy data:", error);
    process.exit(1);
  }
};

connectDB().then(createDummyData);
