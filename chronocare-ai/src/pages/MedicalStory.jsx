import React from "react";
import { motion } from "framer-motion";
import { Sparkles, FileText } from "lucide-react";

export const MedicalStory = () => {
  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          AI Generated Medical Story
        </h1>
        <p className="text-gray-500">
          Unified interpretation of your medical records using AI intelligence
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Extracted Entities Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="font-bold text-gray-800 mb-4">
            Extracted Entities
          </h3>

          <div className="space-y-4 text-sm">

            <div>
              <p className="font-semibold text-blue-600">Diagnoses</p>
              <ul className="text-gray-600 mt-1 space-y-1">
                <li>• Hypertension</li>
                <li>• Vitamin D Deficiency</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-green-600">Medications</p>
              <ul className="text-gray-600 mt-1 space-y-1">
                <li>• Amlodipine</li>
                <li>• Vitamin D3 Supplements</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-red-600">Risk Indicators</p>
              <ul className="text-gray-600 mt-1 space-y-1">
                <li>• Elevated LDL Cholesterol</li>
                <li>• Mild Cardiac Risk</li>
              </ul>
            </div>

          </div>
        </motion.div>

        {/* Story Visualization + Summary */}
        <div className="lg:col-span-2 space-y-8">

          {/* Flow Blocks */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="font-bold text-gray-800 mb-6">
              Medical Event Flow
            </h3>

            <div className="flex flex-wrap gap-4 items-center text-sm">

              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                Diagnosis
              </div>

              <span className="text-gray-400">→</span>

              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                Medication Prescribed
              </div>

              <span className="text-gray-400">→</span>

              <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium">
                Follow-up Check
              </div>

              <span className="text-gray-400">→</span>

              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                Risk Monitoring
              </div>

            </div>
          </motion.div>

          {/* AI Narrative Summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-blue-600 w-5 h-5" />
              <h3 className="font-bold text-gray-800">
                AI Medical Summary
              </h3>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm">
              Based on the collected medical records, the patient has been
              diagnosed with hypertension and mild vitamin deficiency.
              Treatment includes antihypertensive medication and dietary
              supplementation. Cholesterol trends indicate a moderate
              cardiovascular risk requiring periodic monitoring. Lifestyle
              adjustments and regular follow-up are recommended.
            </p>

            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Explain Further
            </button>
          </motion.div>

        </div>
      </div>

    </div>
  );
};
