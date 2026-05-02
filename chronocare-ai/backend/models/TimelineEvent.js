import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  date: { type: String, required: true },          // ISO date string "YYYY-MM-DD"
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  type: {
    type: String,
    enum: ["diagnosis", "surgery", "treatment", "vaccination", "checkup", "report", "other"],
    default: "other",
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
    default: null,
  },
}, { timestamps: true });

export const TimelineEvent = mongoose.model("TimelineEvent", timelineEventSchema);
