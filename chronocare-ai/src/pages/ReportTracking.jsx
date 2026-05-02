import React, { useState, useEffect } from "react";
import api from "../api/api";
import { FileText, Clock, CheckCircle, Activity, ChevronRight, Stethoscope, FileSearch } from "lucide-react";

export const ReportTracking = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get("/api/reports");
        setReports(data.reports);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusStep = (status) => {
    switch (status) {
      case "uploaded": return 1;
      case "under_review": return 2;
      case "routed": return 3;
      case "completed": return 4;
      default: return 1;
    }
  };

  const statusColors = {
    uploaded: "bg-gray-100 text-gray-600",
    under_review: "bg-blue-100 text-blue-600",
    routed: "bg-amber-100 text-amber-600",
    completed: "bg-emerald-100 text-emerald-600",
  };

  const statusLabels = {
    uploaded: "Uploaded",
    under_review: "Analyzing",
    routed: "Routed to Dept",
    completed: "Reviewed",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex h-full gap-8">
      
      {/* Left Column: Report List */}
      <div className="w-1/3 flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">My Reports</h2>
          <p className="text-sm text-gray-500 mt-1">Track status and review notes</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No reports uploaded yet.</p>
            </div>
          ) : (
            reports.map((report) => (
              <button
                key={report._id}
                onClick={() => setSelectedReport(report)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedReport?._id === report._id
                    ? "border-amber-400 bg-amber-50 shadow-sm"
                    : "border-gray-100 hover:border-amber-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 truncate pr-2">{report.fileName}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium ${statusColors[report.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[report.status] || report.status}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  {report.reportType && (
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {report.reportType}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Tracking Details */}
      <div className="flex-1 flex flex-col h-full">
        {selectedReport ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedReport.fileName}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-10 pb-6 border-b border-gray-100">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Uploaded {new Date(selectedReport.createdAt).toLocaleDateString()}</span>
              {selectedReport.assignedDoctor && (
                <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4" /> {selectedReport.assignedDoctor}</span>
              )}
            </div>

            {/* Visual Stepper */}
            <div className="mb-12 relative">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Processing Status</h3>
              
              <div className="absolute top-[45px] left-8 right-8 h-1 bg-gray-100 rounded-full z-0"></div>
              
              <div className="relative z-10 flex justify-between">
                {[
                  { step: 1, title: "Uploaded", desc: "Received file" },
                  { step: 2, title: "AI Analysis", desc: "Extracted data" },
                  { step: 3, title: "Routed", desc: selectedReport.reportType || "Pending department" },
                  { step: 4, title: "Reviewed", desc: "Doctor notes available" }
                ].map((item) => {
                  const currentStep = getStatusStep(selectedReport.status);
                  const isCompleted = currentStep >= item.step;
                  const isActive = currentStep === item.step;
                  
                  return (
                    <div key={item.step} className="flex flex-col items-center text-center w-1/4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3 transition-colors ${
                        isCompleted 
                          ? "bg-amber-500 text-white ring-4 ring-amber-50" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : item.step}
                      </div>
                      <h4 className={`font-semibold text-sm ${isActive ? "text-amber-600" : (isCompleted ? "text-gray-800" : "text-gray-400")}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-[100px]">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Doctor's Notes Section */}
            {selectedReport.status === "completed" ? (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">Doctor's Review Notes</h3>
                    <p className="text-xs text-emerald-700">by {selectedReport.assignedDoctor || "Assigned Specialist"}</p>
                  </div>
                </div>
                <div className="prose prose-sm text-emerald-800 max-w-none">
                  {selectedReport.notes ? (
                    <p className="whitespace-pre-wrap">{selectedReport.notes}</p>
                  ) : (
                    <p className="italic opacity-70">The doctor has reviewed the report but left no additional notes.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-600">Pending Review</h3>
                <p className="text-sm text-gray-500 mt-1">This report is currently waiting in the {selectedReport.reportType || "General"} department queue.</p>
              </div>
            )}

            {/* AI Summary Snapshot */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI Extraction Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Diagnosis / Focus</p>
                  <p className="font-medium text-gray-800">{selectedReport.analysisResult?.diagnosis || "N/A"}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Severity & Urgency</p>
                  <p className="font-medium text-gray-800">
                    {selectedReport.analysisResult?.severity || "N/A"} • {selectedReport.analysisResult?.urgency || "N/A"}
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
            <FileSearch className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a report to track its status</p>
          </div>
        )}
      </div>
    </div>
  );
};
