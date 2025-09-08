import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Customer from "../models/Customer.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-passwordHash");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};


export const protectCustomer = async (req, res, next) => {
  let token;
  console.log("🔐 Authorization Header:", req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.customer = await Customer.findById(decoded.id);

      if (!req.customer) {
        console.log("❌ Customer not found");
        return res.status(401).json({ message: "Customer not found" });
      }

      next();
    } catch (error) {
      console.error("❌ Token verification error:", error.message); // logs exact reason
      return res.status(401).json({
        message: "Not authorized, token invalid or expired",
        error: error.message, // optional for debugging
      });
    }
  } else {
    console.log("❌ No Authorization header or invalid format");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};




export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Role '${req.user.role}' is not allowed to access this resource` });
  }
  next();
};