import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const trendData = [
  { month: "Jan", score: 68 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 78 },
  { month: "May", score: 82 },
];

export const HealthIntelligence = () => {
  return (
    <div className="min-h-screen bg-honey-50 p-10">

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-10"
      >
        Health Intelligence Score
      </motion.h1>

      {/* Gauges Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

        <RiskGauge title="Cardiac Risk" value={72} />
        <RiskGauge title="Diabetes Risk" value={64} />
        <RiskGauge title="Surgical Risk" value={58} />

      </div>

      {/* AI Explanation + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* AI Explanation */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            AI Explanation
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            Based on your longitudinal lab trends, cardiac markers show
            moderate elevation. Diabetes indicators remain stable but require
            lifestyle optimization. Surgical risk is low due to stable vitals
            and absence of major complications.
          </p>
        </div>

        {/* Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Overall Health Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

/* Risk Gauge Component */
const RiskGauge = ({ title, value }) => {
  const angle = (value / 100) * 180;

  return (
    <div className="card text-center">
      <h3 className="text-gray-700 font-semibold mb-4">
        {title}
      </h3>

      <div className="relative w-40 h-24 mx-auto">
        <div className="absolute bottom-0 left-0 right-0 h-24 rounded-t-full bg-gray-200"></div>

        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + angle }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-honey-500 origin-bottom"
          style={{ transformOrigin: "bottom center" }}
        />

        <div className="absolute bottom-2 left-0 right-0 text-xl font-bold text-honey-600">
          {value}
        </div>
      </div>
    </div>
  );
};
