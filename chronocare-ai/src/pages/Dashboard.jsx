import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Activity, Loader } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [timelineRes, healthRes, reportsRes] = await Promise.all([
          api.get("/api/timeline"),
          api.get("/api/health-score"),
          api.get("/api/reports")
        ]);

        setTimeline(timelineRes.data.events || []);
        setHealthData(healthRes.data.healthScore || null);
        setRecentReports(reportsRes.data.reports || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  // Derive alert from recent reports
  let alertSeverity = null;
  let alertMessage = "No recent critical alerts. Your health looks stable.";
  if (recentReports.length > 0) {
    const latestSev = (recentReports[0].analysisResult?.severity || "").toLowerCase();
    if (latestSev === "critical" || latestSev === "severe") {
      alertSeverity = "high";
      alertMessage = `High risk detected in recent report: ${recentReports[0].analysisResult?.diagnosis}`;
    } else if (latestSev === "moderate") {
      alertSeverity = "medium";
      alertMessage = `Moderate risk detected: ${recentReports[0].analysisResult?.diagnosis}`;
    }
  }

  const score = healthData?.score ?? userProfile?.healthScore ?? 0;
  const trendData = healthData?.trend?.length > 0
    ? healthData.trend
    : [{ month: new Date().toLocaleString('default', { month: 'short' }), score }];

  return (
    <div className="space-y-8">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 flex items-start gap-4 ${
          alertSeverity === "high" ? "bg-gradient-to-r from-red-400 to-rose-300"
          : alertSeverity === "medium" ? "bg-gradient-to-r from-amber-400 to-yellow-300"
          : "bg-gradient-to-r from-emerald-400 to-teal-300"
        }`}
      >
        <AlertTriangle className={`${
          alertSeverity === "high" ? "text-red-900"
          : alertSeverity === "medium" ? "text-amber-900"
          : "text-emerald-900"
        } w-6 h-6 mt-0.5`} />
        <div>
          <h3 className={`font-semibold text-sm ${
            alertSeverity === "high" ? "text-red-900"
            : alertSeverity === "medium" ? "text-amber-900"
            : "text-emerald-900"
          }`}>
            {alertSeverity ? "AI Alert Detected" : "Health Status: Stable"}
          </h3>
          <p className={`text-sm mt-1 ${
            alertSeverity === "high" ? "text-red-900/80"
            : alertSeverity === "medium" ? "text-amber-900/80"
            : "text-emerald-900/80"
          }`}>
            {alertMessage}
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

          {timeline.length === 0 ? (
            <p className="text-sm text-gray-400">No recent events found. Upload a report or add an event to see it here.</p>
          ) : (
            <div className="space-y-4">
              {timeline.slice(0, 4).map((event) => (
                <div
                  key={event._id}
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
          )}
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
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
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
                dataKey="score"
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
            {score}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="text-emerald-500 w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Risk Level</h4>
          </div>
          <p className={`text-lg font-semibold ${
            score > 80 ? "text-emerald-600"
            : score > 50 ? "text-amber-600"
            : "text-red-600"
          }`}>
            {score > 80 ? "Low" : score > 50 ? "Moderate" : "High"}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <AlertTriangle className="text-blue-500 w-4 h-4" />
            </div>
            <h4 className="text-sm font-medium text-gray-500">Total Reports</h4>
          </div>
          <p className="text-lg font-semibold text-blue-600">
            {recentReports.length} Document{recentReports.length !== 1 ? 's' : ''}
          </p>
        </div>

      </div>

    </div>
  );
};
