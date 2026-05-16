import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import healthScoreRoutes from "./routes/healthScoreRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/health-score", healthScoreRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "HealthHive API Running" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
