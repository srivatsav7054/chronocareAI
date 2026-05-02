import express from "express";
import { uploadReport, getReports, getAllRoutedReports, reviewReport } from "../controllers/reportController.js";
import { upload } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getReports);
router.post("/upload", protect, upload.single("file"), uploadReport);

// Doctor Routes
router.get("/routed", protect, getAllRoutedReports);
router.put("/:id/review", protect, reviewReport);

export default router;
