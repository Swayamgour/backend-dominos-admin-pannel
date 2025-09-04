import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import franchiseRoutes from "./routes/franchiseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
await connectDB();

const app = express();
app.use(express.json());

// ✅ Enable CORS for external access
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

app.get("/", (req, res) => res.json({ message: "API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/franchise", franchiseRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

// Error handler (should be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // ✅ Important for Render

app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));
