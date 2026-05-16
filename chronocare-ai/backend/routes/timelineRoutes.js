import express from "express";
import { getTimeline, addEvent, deleteEvent, getStory } from "../controllers/timelineController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/story", protect, getStory);
router.get("/", protect, getTimeline);
router.post("/", protect, addEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
