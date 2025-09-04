import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // payload
    process.env.JWT_SECRET, // secret from .env file
    { expiresIn: "30d" } // token expiry (30 days)
  );
};
