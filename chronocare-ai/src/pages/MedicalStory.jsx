import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileText, Loader, BookOpen } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export const MedicalStory = () => {
  const { userProfile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [aiStory, setAiStory] = useState(null);
  const [generatingStory, setGeneratingStory] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get("/api/reports");
        setReports(data.reports || []);
      } catch (err) {
        console.error("Failed to fetch reports for story", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleGenerateStory = async () => {
    setGeneratingStory(true);
    try {
      const res = await api.get("/api/timeline/story");
      setAiStory(res.data.storyData);
    } catch (err) {
      console.error("Failed to generate story", err);
      alert("Failed to generate AI medical story");
    } finally {
      setGeneratingStory(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Derive entities from user profile + reports
  const profileConditions = userProfile?.chronicConditions || [];
  const reportDiagnoses = Array.from(new Set(reports.map(r => r.analysisResult?.diagnosis).filter(d => d && d !== "Unknown")));
  const allDiagnoses = Array.from(new Set([...profileConditions, ...reportDiagnoses]));

  const meds = userProfile?.currentMedications || [];
  
  const redFlags = Array.from(new Set(reports.flatMap(r => r.analysisResult?.red_flags || [])));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">AI Medical Story</h1>
        <p className="text-gray-400 text-sm">A plain-English summary of your medical records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entities */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card">
          <h3 className="font-semibold text-gray-800 mb-4 text-sm">Extracted Entities</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-amber-600 mb-1">Diagnoses & Conditions</p>
              {allDiagnoses.length > 0 ? (
                <ul className="text-gray-500 space-y-0.5">
                  {allDiagnoses.map((d, i) => <li key={i}>• {d}</li>)}
                </ul>
              ) : (
                <p className="text-gray-400 text-xs">None recorded</p>
              )}
            </div>
            <div>
              <p className="font-medium text-blue-600 mb-1">Medications</p>
              {meds.length > 0 ? (
                <ul className="text-gray-500 space-y-0.5">
                  {meds.map((m, i) => <li key={i}>• {m.name} {m.dosage ? `(${m.dosage})` : ''}</li>)}
                </ul>
              ) : (
                <p className="text-gray-400 text-xs">None recorded</p>
              )}
            </div>
            <div>
              <p className="font-medium text-red-500 mb-1">Risk Indicators & Flags</p>
              {redFlags.length > 0 ? (
                <ul className="text-gray-500 space-y-0.5">
                  {redFlags.slice(0, 5).map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
              ) : (
                <p className="text-gray-400 text-xs">No active red flags</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Story + Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flow */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card overflow-x-auto">
            <h3 className="font-semibold text-gray-800 mb-5 text-sm">Medical Event Flow</h3>
            <div className="flex flex-wrap gap-3 items-center text-sm min-w-max">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-medium border border-blue-100">Upload</span>
              <span className="text-gray-300">→</span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-medium border border-emerald-100">AI Analysis</span>
              <span className="text-gray-300">→</span>
              <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg font-medium border border-amber-100">Scoring</span>
              <span className="text-gray-300">→</span>
              <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg font-medium border border-purple-100">Monitoring</span>
            </div>
          </motion.div>

          {/* AI Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <BookOpen className="text-amber-500 w-4 h-4" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Comprehensive Clinical Story</h3>
              </div>
              {!aiStory && (
                <button 
                  onClick={handleGenerateStory}
                  disabled={generatingStory}
                  className="btn-honey text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  {generatingStory ? <Loader className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  {generatingStory ? "Writing Story..." : "Generate AI Story"}
                </button>
              )}
            </div>

            <AnimatePresence>
              {aiStory ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-gray-600 leading-relaxed text-sm border-l-2 border-amber-300 pl-4 whitespace-pre-wrap">
                    {aiStory.story}
                  </p>
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">Key Takeaway</p>
                    <p className="text-sm font-medium text-blue-900">{aiStory.key_takeaway}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl mt-2">
                  <p className="text-sm text-gray-500">
                    Your medical story is unwritten. Click the button above to have our AI generate a cohesive, easy-to-read narrative of your entire health journey.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
