import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import { Report } from "../models/Report.js";
import { TimelineEvent } from "../models/TimelineEvent.js";
import { analyzeReport } from "../services/aiService.js";
import { computeScore } from "./healthScoreController.js";

// ─── Get Reports ─────────────────────────────────────────────────────────────
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json({ reports });
  } catch (err) {
    console.error("Get reports error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Upload Report ───────────────────────────────────────────────────────────
export const uploadReport = async (req, res) => {
  try {
    let extractedText = "";
    let fileUrl = "";
    let fileName = req.body.fileName || "Text Input Report";
    let fileType = "text";
    let fileSize = 0;

    // Handle file upload if present
    if (req.file) {
      fileName = req.file.originalname;
      fileType = req.file.mimetype.includes("pdf") ? "pdf" : req.file.mimetype.includes("image") ? "image" : "doc";
      fileSize = req.file.size;
      fileUrl = `/uploads/${req.file.filename}`;

      // Extract text if PDF
      if (fileType === "pdf") {
        try {
          const dataBuffer = fs.readFileSync(req.file.path);
          const pdfData = await pdfParse(dataBuffer);
          extractedText = pdfData.text;
        } catch (pdfErr) {
          console.error("PDF Parse error:", pdfErr);
        }
      } else if (fileType === "text") {
         extractedText = fs.readFileSync(req.file.path, 'utf8');
      }
      // Note: for images, we'd ideally use Tesseract OCR here.
    }

    // Append manual text if provided
    if (req.body.text) {
      extractedText += "\n" + req.body.text;
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ message: "No readable text found in the upload." });
    }

    // Call AI Service
    const aiResult = await analyzeReport(extractedText);

    if (!aiResult) {
      return res.status(500).json({ message: "Failed to analyze report via AI Service" });
    }

    // Default aiResult mapping if missing keys
    const analysisResult = {
      diagnosis: aiResult.diagnosis || "Unknown",
      severity: aiResult.severity || "Unknown",
      urgency: aiResult.urgency || "Routine",
      department: aiResult.department || "General",
      red_flags: aiResult.red_flags || [],
      recommendations: aiResult.recommendations || "",
      reasoning: aiResult.reasoning || "",
    };

    // Save Report to MongoDB
    const report = new Report({
      userId: req.userId,
      fileName,
      fileUrl,
      fileType,
      fileSize,
      extractedText,
      analysisResult,
      reportType: analysisResult.department,
      status: "routed", // Routed to department instead of completed
    });
    await report.save();

    // Create Timeline Event
    const timelineEvent = new TimelineEvent({
      userId: req.userId,
      date: new Date().toISOString().split("T")[0],
      title: `Report Uploaded & Routed: ${fileName}`,
      description: `AI routed to ${analysisResult.department}. Waiting for doctor review.`,
      type: "report",
      reportId: report._id,
    });
    await timelineEvent.save();

    // Recompute Health Score based on new report
    await computeScore(req.userId);

    return res.status(201).json({
      message: "Report uploaded and routed successfully",
      report,
      analysis: analysisResult,
    });
  } catch (err) {
    console.error("Upload report error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Doctor Endpoints ────────────────────────────────────────────────────────
export const getAllRoutedReports = async (req, res) => {
  try {
    // For demo purposes, we fetch all reports so user can see them in the portal
    const reports = await Report.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email"); // To see patient name
    return res.json({ reports });
  } catch (err) {
    console.error("Get routed reports error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const reviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, status } = req.body;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.notes = notes || report.notes;
    report.status = status || "completed"; // Usually "completed" once reviewed
    report.assignedDoctor = "Dr. ChronoCare (Demo)"; // Mock doctor name

    await report.save();

    // Create a timeline event for the patient
    const timelineEvent = new TimelineEvent({
      userId: report.userId,
      date: new Date().toISOString().split("T")[0],
      title: `Doctor Notes Added: ${report.fileName}`,
      description: `A doctor has reviewed your report and added notes.`,
      type: "doctor_note",
      reportId: report._id,
    });
    await timelineEvent.save();

    return res.json({ message: "Report reviewed successfully", report });
  } catch (err) {
    console.error("Review report error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
