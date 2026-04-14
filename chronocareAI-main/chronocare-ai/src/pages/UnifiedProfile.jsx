import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Building2 } from "lucide-react";

export const UnifiedProfile = () => {
  return (
    <div className="min-h-screen bg-honey-50 p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-10"
      >
        Unified Patient Profile
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE — HOSPITAL DATA */}
        <div className="lg:col-span-2 space-y-6">

          {/* Duplicate Warning */}
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl flex items-center gap-3">
            <AlertTriangle className="text-yellow-600 w-5 h-5" />
            <p className="text-yellow-700 text-sm">
              Possible duplicate blood test detected across Hospital A and Hospital B.
            </p>
          </div>

          {/* Hospital A */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-medical-600 w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">
                Hospital A
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="p-3 bg-gray-50 rounded-lg">Blood Test – Jan 2024</div>
              <div className="p-3 bg-gray-50 rounded-lg">Cardiology Check – Feb 2024</div>
              <div className="p-3 bg-gray-50 rounded-lg">HbA1c – 6.2%</div>
              <div className="p-3 bg-gray-50 rounded-lg">Cholesterol – 210 mg/dL</div>
            </div>
          </div>

          {/* Hospital B */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-medical-600 w-5 h-5" />
              <h2 className="text-lg font-bold text-gray-800">
                Hospital B
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="p-3 bg-gray-50 rounded-lg">Blood Test – Jan 2024</div>
              <div className="p-3 bg-gray-50 rounded-lg">Diabetes Screening</div>
              <div className="p-3 bg-gray-50 rounded-lg">HbA1c – 6.3%</div>
              <div className="p-3 bg-gray-50 rounded-lg">Glucose – 118 mg/dL</div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE — AI INTELLIGENCE */}
        <div className="space-y-6">

          {/* Comparison Chart Placeholder */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">
              Comparison Chart
            </h3>
            <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              Trend Chart Placeholder
            </div>
          </div>

          {/* AI Warning Box */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <h3 className="font-bold text-red-600 mb-2">
              AI Risk Warning
            </h3>
            <p className="text-red-500 text-sm">
              Slight upward trend in HbA1c across hospitals. Recommend monitoring diabetes risk.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
