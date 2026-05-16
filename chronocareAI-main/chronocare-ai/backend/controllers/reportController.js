import { Report } from "../models/Report.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { analyzeReport } from "../services/aiService.js";

export const uploadReport = async (req, res) => {

  try {

    const { patientId, text } = req.body;

    // Call AI service
    const aiResult = await analyzeReport(text);

    if (!aiResult) {
      return res.status(500).json({
        message: "AI analysis failed"
      });
    }

    // Save report
    const report = new Report({

      patientId: patientId,

      fileName: "text-report",

      fileUrl: "N/A",

      reportType: aiResult.department,

      status: aiResult.status,

      notes: `Risk Level: ${aiResult.risk_level}`

    });

    await report.save();

    // Create activity log
    const log = new ActivityLog({

      reportId: report._id,

      action: "Report Uploaded and Routed",

      performedBy: "AI System",

      notes: `Assigned to ${aiResult.department}`

    });

    await log.save();

    res.json({
      message: "Report uploaded and routed successfully",
      report,
      aiResult
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
