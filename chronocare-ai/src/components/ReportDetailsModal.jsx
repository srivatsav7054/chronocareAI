import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Activity, AlertTriangle, Stethoscope, Clock, CheckCircle, Loader } from "lucide-react";
import api from "../api/api";

export const ReportDetailsModal = ({ reportId, onClose }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/api/reports`);
        // Find the specific report from the list (backend doesn't have a get single report by ID yet, let's check)
        // Actually, let's check if there is a GET /api/reports/:id
        const found = data.reports.find(r => r._id === reportId);
        if (found) {
          setReport(found);
        } else {
          setError("Report not found");
        }
      } catch (err) {
        console.error("Failed to fetch report details:", err);
        setError("Failed to load report details");
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
              {report && <p className="text-xs text-gray-500">{report.fileName}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-amber-500">
              <Loader className="w-10 h-10 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Fetching report details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl flex items-center justify-between ${
                report.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                <div className="flex items-center gap-2 font-semibold">
                  {report.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('_', ' ')}
                </div>
                <div className="text-xs font-bold px-3 py-1 bg-white/50 rounded-full">
                  {report.reportType}
                </div>
              </div>

              {/* AI Analysis Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" /> AI Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Diagnosis</p>
                    <p className="text-gray-800 font-semibold">{report.analysisResult?.diagnosis || "Not available"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Urgency / Severity</p>
                    <p className="text-gray-800 font-semibold">
                      {report.analysisResult?.urgency} / {report.analysisResult?.severity}
                    </p>
                  </div>
                </div>

                {report.analysisResult?.red_flags?.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <p className="text-xs text-red-400 font-bold uppercase mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Critical Red Flags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {report.analysisResult.red_flags.map((flag, i) => (
                        <span key={i} className="px-3 py-1 bg-white text-red-600 text-xs font-bold rounded-lg border border-red-100">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <p className="text-xs text-indigo-400 font-bold uppercase mb-1">AI Reasoning</p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    "{report.analysisResult?.reasoning}"
                  </p>
                </div>
              </div>

              {/* Doctor's Review Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" /> Doctor's Evaluation
                </h3>
                
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm relative overflow-hidden">
                  {report.status !== 'completed' && (
                    <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] flex items-center justify-center">
                      <p className="text-gray-400 text-sm font-medium">Pending specialist review...</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{report.assignedDoctor || "Assigned Doctor"}</h4>
                      <p className="text-[10px] text-gray-400 uppercase font-black">ChronoCare Verified Provider</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {report.notes || "The doctor has not added any specific clinical notes yet."}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              {report.analysisResult?.recommendations && (
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                  <p className="text-xs text-amber-500 font-bold uppercase mb-1">Next Steps</p>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {report.analysisResult.recommendations}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            ID: {reportId}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-900 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </div>
  );
};
