import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({

  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
    required: true
  },

  action: {
    type: String,
    required: true
  },

  performedBy: {
    type: String,
    required: true
  },

  notes: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
