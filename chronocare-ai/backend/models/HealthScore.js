import mongoose from "mongoose";

const healthScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  score: { type: Number, default: 0, min: 0, max: 100 },

  // Sub-scores / breakdown
  breakdown: {
    chronicConditionsPenalty: { type: Number, default: 0 },
    allergyPenalty: { type: Number, default: 0 },
    agePenalty: { type: Number, default: 0 },
    bmiPenalty: { type: Number, default: 0 },
    reportRiskPenalty: { type: Number, default: 0 },
  },

  // 6-month rolling trend  [{month: "Jan 26", score: 78}, ...]
  trend: [
    {
      month: { type: String },
      score: { type: Number },
    },
  ],

  lastComputed: { type: Date, default: Date.now },
}, { timestamps: true });

export const HealthScore = mongoose.model("HealthScore", healthScoreSchema);
