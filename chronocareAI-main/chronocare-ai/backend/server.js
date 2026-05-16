import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports", reportRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("HealthHive API Running");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
