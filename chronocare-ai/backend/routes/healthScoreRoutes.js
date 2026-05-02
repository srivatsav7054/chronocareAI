import express from "express";
import { getHealthScore, recomputeHealthScore, predictScore } from "../controllers/healthScoreController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getHealthScore);
router.post("/compute", protect, recomputeHealthScore);
router.get("/predict", protect, predictScore);

export default router;
