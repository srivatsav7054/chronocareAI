import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Sparkles, CheckCircle, Loader, AlertCircle, FileText, X } from "lucide-react";
import api from "../api/api";

export const Upload = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 20 * 1024 * 1024) {
        setError("File is too large. Maximum size is 20MB.");
        return;
      }
      setFile(selected);
      setError("");
      setResult(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file && !text.trim()) {
      setError("Please select a file or paste report text.");
      return;
    }

    setIsProcessing(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text.trim()) formData.append("text", text);

      const response = await api.post("/api/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.analysis);
      setText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Upload Medical Report</h1>
        <p className="text-gray-400 text-sm">Upload a PDF/Image or paste your report text for AI analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* File Upload Area */}
        <div className="card flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 hover:border-amber-400 transition-colors bg-gray-50/50">
          {!file ? (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <FileUp className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Upload a Document</p>
              <p className="text-xs text-gray-400 mb-6 text-center">PDF, JPG, PNG, DOCX up to 20MB</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-outline text-sm py-2 px-6"
              >
                Browse Files
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={removeFile} className="p-2 text-gray-400 hover:text-red-500 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
          />
        </div>

        {/* Text Input Area */}
        <div className="card flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">Or Paste Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste medical report text here as an alternative or supplement to the file..."
            className="flex-1 w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none text-sm"
          />
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      <motion.button
        onClick={handleUpload}
        disabled={isProcessing || (!file && !text.trim())}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 btn-honey flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <><Loader className="w-5 h-5 animate-spin" /> Processing AI Analysis...</>
        ) : (
          <><Sparkles className="w-5 h-5" /> Upload & Analyze</>
        )}
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="card border-2 border-emerald-100 mt-8"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">AI Analysis Complete</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Primary Diagnosis</p>
                <p className="font-semibold text-gray-800">{result.diagnosis}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Recommended Department</p>
                <p className="font-semibold text-blue-600">{result.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Severity</p>
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${
                  result.severity?.toLowerCase() === 'critical' ? 'bg-red-100 text-red-700' :
                  result.severity?.toLowerCase() === 'high' ? 'bg-orange-100 text-orange-700' :
                  result.severity?.toLowerCase() === 'moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {result.severity}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Urgency</p>
                <p className="font-medium text-gray-700">{result.urgency}</p>
              </div>
            </div>

            {result.red_flags && result.red_flags.length > 0 && (
              <div className="mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Red Flags
                </p>
                <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                  {result.red_flags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">AI Reasoning</p>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {result.reasoning}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Recommendations</p>
                <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                  {result.recommendations}
                </p>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
