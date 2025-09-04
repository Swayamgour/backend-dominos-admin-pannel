// src / middleware / authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-passwordHash");
      if (!req.user) return res.status(401).json({ message: "Not authorized" });
      return next();
    }
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Role '${req.user.role}' is not allowed to access this resource` });
  }
  next();
};