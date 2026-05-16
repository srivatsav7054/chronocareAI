import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

  patientId: {
    type: String,
    required: true
  },

  fileName: {
    type: String,
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  reportType: {
    type: String,
    default: "General"
  },

  status: {
    type: String,
    enum: [
      "uploaded",
      "under_review",
      "assigned",
      "in_progress",
      "completed",
      "flagged"
    ],
    default: "uploaded"
  },

  assignedDoctor: {
    type: String,
    default: null
  },

  hospital: {
    type: String,
    default: null
  },

  notes: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});

export const Report = mongoose.model("Report", reportSchema);
