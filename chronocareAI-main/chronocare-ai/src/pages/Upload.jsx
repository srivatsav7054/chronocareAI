import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FileUp, Sparkles, CheckCircle, Loader } from "lucide-react";

export const Upload = () => {

  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState(null);

  const handleExplainWithAI = async () => {

    if (!text) {
      alert("Please enter report text");
      return;
    }

    setIsProcessing(true);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/reports/upload",
        {
          patientId: "patient123",
          text: text
        }
      );

      setResult(response.data);

      setIsCompleted(true);

    } catch (error) {

      console.error(error);
      alert("Upload failed");

    }

    setIsProcessing(false);

  };

  return (
    <div className="p-10">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >

          <h1 className="text-2xl font-bold mb-4">
            Upload Medical Report
          </h1>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter medical report text..."
            className="w-full h-40 p-4 border rounded-lg"
          />

          <motion.button
            onClick={handleExplainWithAI}
            disabled={isProcessing}
            className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg"
          >

            {isProcessing ? (
              <>
                <Loader className="inline mr-2" />
                Processing...
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle className="inline mr-2" />
                Completed
              </>
            ) : (
              <>
                <Sparkles className="inline mr-2" />
                Upload and Analyze
              </>
            )}

          </motion.button>

        </motion.div>

        {result && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
          >

            <h2 className="text-xl font-bold mb-4">
              AI Routing Result
            </h2>

            <p>
              <strong>Department:</strong>{" "}
              {result.aiResult.department}
            </p>

            <p>
              <strong>Risk Level:</strong>{" "}
              {result.aiResult.risk_level}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {result.aiResult.status}
            </p>

            <p>
              <strong>Report ID:</strong>{" "}
              {result.report._id}
            </p>

          </motion.div>

        )}

    </div>
  );
};
