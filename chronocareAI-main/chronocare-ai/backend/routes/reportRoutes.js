import express from "express";
import { uploadReport } from "../controllers/reportController.js";

const router = express.Router();

// Upload and route report
router.post("/upload", uploadReport);

export default router;
