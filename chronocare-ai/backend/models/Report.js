import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  // Keep patientId for backwards compatibility
  patientId: { type: String, default: "" },

  fileName: { type: String, required: true },
  fileUrl: { type: String, default: "" },
  fileType: { type: String, default: "text" },      // "pdf", "image", "text"
  fileSize: { type: Number, default: 0 },           // bytes
  extractedText: { type: String, default: "" },

  reportType: { type: String, default: "General" },

  status: {
    type: String,
    enum: ["uploaded", "under_review", "routed", "assigned", "in_progress", "completed", "flagged"],
    default: "uploaded",
  },

  assignedDoctor: { type: String, default: null },
  hospital: { type: String, default: null },
  notes: { type: String, default: "" },

  // Full AI analysis result stored here
  analysisResult: {
    diagnosis: { type: String, default: "" },
    severity: { type: String, default: "" },
    urgency: { type: String, default: "" },
    department: { type: String, default: "" },
    red_flags: { type: [String], default: [] },
    recommendations: { type: String, default: "" },
    reasoning: { type: String, default: "" },
  },

}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);
