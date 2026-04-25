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

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl p-6 flex items-start gap-4"
      >
        <AlertTriangle className="text-amber-800 w-6 h-6 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900 text-sm">
            AI Alert: Mild Cardiovascular Risk Detected
          </h3>
          <p className="text-amber-800/80 text-sm mt-1">
            Based on recent cholesterol trends, we recommend reviewing lifestyle adjustments.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Timeline Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-base font-semibold text-gray-800 mb-5">
            Recent Timeline
          </h3>

          <div className="space-y-4">
            {dummyTimelineEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 text-sm">
                    {event.title}
                  </p>
                  <p className="text-gray-400 text-xs">
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
          className="card"
        >
          <h3 className="text-base font-semibold text-gray-800 mb-5">
            Health Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dummyHealthTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                }}
              />
              <Line
                type="monotone"
                dataKey="healthScore"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ fill: "#f59e0b", r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#f59e0b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Activity className="text-amber-500 w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Health Score</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {dummyUserData.healthScore}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="text-emerald-500 w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Risk Level</h4>
          </div>
          <p className="text-lg font-semibold text-emerald-600">
            Moderate
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-500 w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Active Alerts</h4>
          </div>
          <p className="text-lg font-semibold text-red-500">
            1 Critical
          </p>
        </div>

      </div>

    </div>
  );
};
