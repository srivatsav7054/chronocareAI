import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "healthhive_secret_key_change_in_prod";
const JWT_EXPIRES_IN = "7d";

export const generateToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyToken = (token) =>
  jwt.verify(token, JWT_SECRET);
