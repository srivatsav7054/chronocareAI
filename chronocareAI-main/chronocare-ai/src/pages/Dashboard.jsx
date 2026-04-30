import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { dummyUserData, dummyHealthTrendData, dummyTimelineEvents } from "../data/dummyData";

export const Dashboard = () => {
  return (
    <div className="space-y-8">

      {/* AI Alert Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4"
      >
        <AlertTriangle className="text-yellow-600 w-6 h-6 mt-1" />
        <div>
          <h3 className="font-bold text-yellow-700">
            AI Alert: Mild Cardiovascular Risk Detected
          </h3>
          <p className="text-yellow-600 text-sm">
            Based on recent cholesterol trends, we recommend reviewing lifestyle adjustments.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Timeline Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Lifeline Timeline
          </h3>

          <div className="space-y-4">
            {dummyTimelineEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-blue-600 mt-2" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {event.title}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Trend Graph */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Health Trend Analysis
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dummyHealthTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="healthScore"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="text-blue-600 w-5 h-5" />
            <h4 className="font-semibold text-gray-800">
              Health Score
            </h4>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {dummyUserData.healthScore}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-green-600 w-5 h-5" />
            <h4 className="font-semibold text-gray-800">
              Risk Level
            </h4>
          </div>
          <p className="text-lg font-bold text-green-600">
            Moderate
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="text-red-600 w-5 h-5" />
            <h4 className="font-semibold text-gray-800">
              Active Alerts
            </h4>
          </div>
          <p className="text-lg font-bold text-red-600">
            1 Critical
          </p>
        </div>

      </div>

    </div>
  );
};
