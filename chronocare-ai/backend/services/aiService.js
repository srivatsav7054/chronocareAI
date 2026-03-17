import axios from "axios";

const AI_URL = "http://127.0.0.1:8000/analyze-report";

export const analyzeReport = async (text) => {

  try {

    const response = await axios.post(AI_URL, {
      text: text
    });

    return response.data;

  } catch (error) {

    console.error("AI Service Error:", error.message);

    return null;

  }

};
