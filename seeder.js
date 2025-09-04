// seeder.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import Franchise from "./models/Franchise.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();
await connectDB();

const seedData = async () => {
  try {
    console.log("🌱 Seeding database...");

    // 1️⃣ Clear old data
    await User.deleteMany();
    await Franchise.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();

    // 2️⃣ Create Super Admin
    const superAdminPassword = await bcrypt.hash("12345", 10);
    const superAdmin = await User.create({
      name: "Main Admin",
      email: "super@gmail.com",
      passwordHash: superAdminPassword,
      role: "super_admin"
    });

    console.log("✅ Super Admin created:", superAdmin.email);

    // 3️⃣ Create Sample Franchise
    const franchise = await Franchise.create({
      name: "Delhi Central",
      city: "Delhi",
      address: "Connaught Place, Delhi",
      contact: "+91-9876543210",
      ownerUserId: superAdmin._id
    });

    console.log("✅ Franchise created:", franchise.name);

    // 4️⃣ Create Sample Categories
    const categories = await Category.insertMany([
      { name: "Pizzas", position: 1, franchiseId: franchise._id },
      { name: "Sides", position: 2, franchiseId: franchise._id },
      { name: "Drinks", position: 3, franchiseId: franchise._id }
    ]);

    console.log("✅ Categories created:", categories.length);

    // 5️⃣ Create Sample Products
    await Product.insertMany([
      {
        name: "Veggie Paradise",
        price: 299,
        description: "Onion, capsicum, mushroom, and more!",
        categoryId: categories[0]._id,
        franchiseId: franchise._id
      },
      {
        name: "Cheesy Dip",
        price: 49,
        description: "Delicious cheesy dip for your sides.",
        categoryId: categories[1]._id,
        franchiseId: franchise._id
      },
      {
        name: "Coke 500ml",
        price: 60,
        description: "Refreshing cold drink.",
        categoryId: categories[2]._id,
        franchiseId: franchise._id
      }
    ]);

    console.log("✅ Sample products created");
    console.log("🎉 Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error while seeding:", error);
    process.exit(1);
  }
};

seedData();
