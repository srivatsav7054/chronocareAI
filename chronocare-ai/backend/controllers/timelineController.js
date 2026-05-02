import { TimelineEvent } from "../models/TimelineEvent.js";
import { User } from "../models/User.js";
import { Report } from "../models/Report.js";

// ─── Get Timeline ────────────────────────────────────────────────────────────
export const getTimeline = async (req, res) => {
  try {
    const events = await TimelineEvent.find({ userId: req.userId })
      .sort({ date: -1, createdAt: -1 });
    return res.json({ events });
  } catch (err) {
    console.error("Get timeline error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Add Event ───────────────────────────────────────────────────────────────
export const addEvent = async (req, res) => {
  try {
    const { date, title, description, type } = req.body;

    if (!date || !title) {
      return res.status(400).json({ message: "Date and title are required" });
    }

    const event = new TimelineEvent({
      userId: req.userId,
      date,
      title,
      description: description || "",
      type: type || "other",
    });

    await event.save();
    return res.status(201).json({ event });
  } catch (err) {
    console.error("Add event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Delete Event ────────────────────────────────────────────────────────────
export const deleteEvent = async (req, res) => {
  try {
    const event = await TimelineEvent.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Delete event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Generate Story ─────────────────────────────────────────────────────────
export const getStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const conditions = user.chronicConditions || [];

    const eventsData = await TimelineEvent.find({ userId: req.userId })
      .sort({ date: -1 }).limit(20);
      
    const reportsData = await Report.find({ userId: req.userId })
      .sort({ createdAt: -1 }).limit(10);

    const timeline = eventsData.map(e => ({
      date: new Date(e.date).toLocaleDateString(),
      title: e.title || "Event",
      type: e.type || "other"
    }));

    const reports = reportsData.map(r => ({
      diagnosis: r.analysisResult?.diagnosis || "Unknown",
      severity: r.analysisResult?.severity || "Unknown"
    }));

    // Call Python AI service
    const axios = (await import("axios")).default;
    const aiResponse = await axios.post("http://127.0.0.1:8000/generate-story", {
      conditions,
      timeline,
      reports
    });

    return res.json({ storyData: aiResponse.data });

  } catch (err) {
    console.error("Generate story error:", err);
    return res.status(500).json({ message: "Failed to generate AI story" });
  }
};
