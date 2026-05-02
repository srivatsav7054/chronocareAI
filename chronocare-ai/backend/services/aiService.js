import axios from "axios";

const AI_URL = "http://127.0.0.1:8000/analyze";

export const analyzeReport = async (reportText, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await axios.post(AI_URL, { report_text: reportText }, {
        timeout: 300000, // 5 minutes
      });
      if (response.data) return response.data;
    } catch (error) {
      console.error(`AI Service Attempt ${i + 1} Failed:`, error.message);
      if (i === retries) {
        return {
          diagnosis: "Analysis Service Timeout",
          severity: "Unknown",
          urgency: "Review Required",
          department: "General Medicine",
          red_flags: ["System was unable to process report in time"],
          recommendations: "Please consult a doctor for manual review.",
          reasoning: "The local AI engine timed out. This often happens if the model is loading for the first time."
        };
      }
      // Wait before retrying (exponential backoff)
      await new Promise(res => setTimeout(res, 2000 * (i + 1)));
    }
  }
};
