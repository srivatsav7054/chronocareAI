import React, { useState, useEffect } from "react";
import api from "../api/api";
import { FileText, Clock, User, CheckCircle, Activity, Save, AlertTriangle, Stethoscope, Loader } from "lucide-react";

export const DoctorPortal = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRoutedReports = async () => {
    try {
      const { data } = await api.get("/api/reports/routed");
      setReports(data.reports);
    } catch (err) {
      console.error("Failed to fetch routed reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutedReports();
  }, []);

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setNotes(report.notes || "");
  };

  const handleReviewSubmit = async () => {
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      await api.put(`/api/reports/${selectedReport._id}/review`, {
        notes,
        status: "completed"
      });
      
      // Update local state
      const updatedReport = { ...selectedReport, status: "completed", notes };
      setSelectedReport(updatedReport);
      setReports(reports.map(r => r._id === updatedReport._id ? updatedReport : r));
      
      alert("Review submitted successfully! The patient has been notified.");
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex h-full gap-8">
      
      {/* Left Column: Patient Queue */}
      <div className="w-1/3 flex flex-col h-full bg-white rounded-3xl shadow-sm border border-indigo-100 overflow-hidden">
        <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-indigo-900">Patient Queue</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">
              {reports.filter(r => r.status !== "completed").length} Pending
            </span>
          </div>
          <p className="text-sm text-indigo-600">Review AI-routed medical reports</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
          {reports.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-200" />
              <p>Your queue is empty!</p>
            </div>
          ) : (
            reports.map((report) => (
              <button
                key={report._id}
                onClick={() => handleSelectReport(report)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedReport?._id === report._id
                    ? "border-indigo-400 bg-indigo-50 shadow-sm ring-1 ring-indigo-200"
                    : "border-white bg-white hover:border-indigo-200 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 pr-2 overflow-hidden">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <h3 className="font-semibold text-gray-800 truncate">
                      {report.userId?.firstName} {report.userId?.lastName}
                    </h3>
                  </div>
                  {report.status === "completed" ? (
                    <span className="text-xs px-2 py-0.5 rounded text-emerald-600 bg-emerald-100 font-bold shrink-0">Reviewed</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                  )}
                </div>
                <div className="text-xs text-gray-500 truncate mb-2">{report.fileName}</div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {report.reportType || "General"}
                  </span>
                  <span className="text-red-500 flex items-center gap-1">
                    {report.analysisResult?.urgency === "High" && <AlertTriangle className="w-3 h-3" />}
                    {report.analysisResult?.urgency}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Review Workspace */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {selectedReport ? (
          <div className="flex flex-col h-full">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>Patient: <strong className="text-gray-800">{selectedReport.userId?.firstName} {selectedReport.userId?.lastName}</strong></span>
                  <span>•</span>
                  <span>Uploaded {new Date(selectedReport.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedReport.fileName}</h2>
              </div>
              <div className="text-right">
                <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedReport.analysisResult?.severity} Severity
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
              
              {/* Left Side: AI Findings */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Preliminary Diagnosis</h3>
                  <div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl font-medium">
                    {selectedReport.analysisResult?.diagnosis || "No diagnosis provided"}
                  </div>
                </div>

                {selectedReport.analysisResult?.red_flags?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" /> Detected Red Flags
                    </h3>
                    <ul className="space-y-2">
                      {selectedReport.analysisResult.red_flags.map((flag, i) => (
                        <li key={i} className="bg-red-50 text-red-800 px-4 py-2.5 rounded-lg text-sm border border-red-100">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Reasoning</h3>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {selectedReport.analysisResult?.reasoning || "No reasoning provided."}
                  </p>
                </div>
              </div>

              {/* Right Side: Doctor's Form */}
              <div className="flex-1 flex flex-col bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" /> Clinical Evaluation
                  </h3>
                  {selectedReport.status === "completed" && (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded uppercase">Finalized</span>
                  )}
                </div>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  readOnly={selectedReport.status === "completed"}
                  placeholder="Type your clinical assessment, prescriptions, or advice for the patient here..."
                  className={`flex-1 w-full border ${selectedReport.status === "completed" ? "border-transparent bg-white/50" : "border-gray-200 bg-white"} rounded-xl p-5 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all resize-none mb-4 shadow-sm`}
                ></textarea>
                
                {selectedReport.status !== "completed" ? (
                  <button
                    onClick={handleReviewSubmit}
                    disabled={submitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {submitting ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> COMPLETE REVIEW & NOTIFY
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <p className="text-xs text-emerald-800 font-bold">This report has been finalized and shared with the patient.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a patient report from the queue</p>
          </div>
        )}
      </div>
    </div>
  );
};
