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
    if (!text) { alert("Please enter report text"); return; }
    setIsProcessing(true);
    try {
      const response = await axios.post("http://localhost:5000/api/reports/upload", { patientId: "patient123", text });
      setResult(response.data);
      setIsCompleted(true);
    } catch (error) {
      console.error(error);
      alert("Upload failed — is the backend running?");
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Upload Medical Report</h1>
        <p className="text-gray-400 text-sm">Paste your report text and let AI route it to the right department.</p>
      </div>

      <div className="card">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste medical report text here..."
          className="w-full h-40 p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
        />

        <motion.button
          onClick={handleExplainWithAI}
          disabled={isProcessing}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full py-3 btn-honey flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
          ) : isCompleted ? (
            <><CheckCircle className="w-4 h-4" /> Done!</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Upload & Analyze</>
          )}
        </motion.button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">AI Routing Result</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Department</span>
              <span className="font-medium text-gray-700">{result.aiResult.department}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Risk Level</span>
              <span className="font-medium text-gray-700">{result.aiResult.risk_level}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Status</span>
              <span className="font-medium text-gray-700">{result.aiResult.status}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Report ID</span>
              <span className="font-mono text-xs text-gray-500">{result.report._id}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
