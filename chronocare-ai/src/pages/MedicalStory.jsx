import React from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText } from "lucide-react";

export const MedicalStory = () => {
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
              <p className="font-medium text-amber-600 mb-1">Diagnoses</p>
              <ul className="text-gray-500 space-y-0.5">
                <li>• Hypertension</li>
                <li>• Vitamin D Deficiency</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-emerald-600 mb-1">Medications</p>
              <ul className="text-gray-500 space-y-0.5">
                <li>• Amlodipine</li>
                <li>• Vitamin D3 Supplements</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-500 mb-1">Risk Indicators</p>
              <ul className="text-gray-500 space-y-0.5">
                <li>• Elevated LDL Cholesterol</li>
                <li>• Mild Cardiac Risk</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Story + Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flow */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
            <h3 className="font-semibold text-gray-800 mb-5 text-sm">Medical Event Flow</h3>
            <div className="flex flex-wrap gap-3 items-center text-sm">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-medium border border-blue-100">Diagnosis</span>
              <span className="text-gray-300">→</span>
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg font-medium border border-emerald-100">Medication</span>
              <span className="text-gray-300">→</span>
              <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg font-medium border border-amber-100">Follow-up</span>
              <span className="text-gray-300">→</span>
              <span className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg font-medium border border-purple-100">Monitoring</span>
            </div>
          </motion.div>

          {/* AI Summary */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Sparkles className="text-amber-500 w-4 h-4" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">AI Summary</h3>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm border-l-2 border-amber-300 pl-4">
              Based on the collected medical records, the patient has been diagnosed with hypertension and mild vitamin deficiency. Treatment includes antihypertensive medication and dietary supplementation. Cholesterol trends indicate a moderate cardiovascular risk requiring periodic monitoring. Lifestyle adjustments and regular follow-up are recommended.
            </p>
            <button className="mt-5 btn-outline text-xs py-2 px-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Expand Details
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
