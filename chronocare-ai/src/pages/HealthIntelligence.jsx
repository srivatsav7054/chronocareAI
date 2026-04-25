import React from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const trendData = [
  { month: "Jan", score: 68 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 75 },
  { month: "Apr", score: 78 },
  { month: "May", score: 82 },
];

export const HealthIntelligence = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Health Score</h1>
        <p className="text-gray-400 text-sm">AI-powered risk assessment across key health areas</p>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RiskGauge title="Cardiac Risk" value={72} color="text-red-500" bg="bg-red-50" />
        <RiskGauge title="Diabetes Risk" value={64} color="text-amber-500" bg="bg-amber-50" />
        <RiskGauge title="Surgical Risk" value={58} color="text-emerald-500" bg="bg-emerald-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Explanation */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">AI Explanation</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Based on your longitudinal lab trends, cardiac markers show moderate elevation. Diabetes indicators remain stable but require lifestyle optimization. Surgical risk is low due to stable vitals and absence of major complications.
          </p>
        </div>

        {/* Chart */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Overall Health Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }} />
              <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 4, stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const RiskGauge = ({ title, value, color, bg }) => {
  return (
    <div className="card text-center">
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      <div className={`w-20 h-20 rounded-full ${bg} mx-auto flex items-center justify-center`}>
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-xs text-gray-400 mt-2">/ 100</p>
    </div>
  );
};
