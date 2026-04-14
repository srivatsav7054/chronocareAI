import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingUp,
  Activity,
  Heart,
  Brain,
  Shield,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { dummyUserData, dummyHealthTrendData } from "../data/dummyData";

export const RiskAnalysis = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const hasHypertension = dummyUserData.chronicConditions?.some((condition) =>
    condition.toLowerCase().includes("hypertension")
  );
  const hasDiabetes = dummyUserData.chronicConditions?.some((condition) =>
    condition.toLowerCase().includes("diabetes")
  );
  const hasMentalHealth = dummyUserData.chronicConditions?.some((condition) =>
    /(depression|anxiety|bipolar|mental)/i.test(condition)
  );

  const cardioMeds = dummyUserData.currentMedications?.filter((med) =>
    /lisinopril|amlodipine|losartan|metoprolol|atenolol/i.test(med.name)
  );
  const diabetesMeds = dummyUserData.currentMedications?.filter((med) =>
    /metformin|insulin|glipizide|glyburide|sitagliptin/i.test(med.name)
  );

  const riskFactors = [
    ...(hasHypertension
      ? [
          {
            category: "Cardiovascular",
            risk: "Moderate",
            score: 65,
            icon: Heart,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            factors: [
              "Hypertension diagnosis"
            ],
            recommendations: [
              ...(cardioMeds?.length
                ? cardioMeds.map((med) => `Continue current medication: ${med.name}`)
                : [])
            ]
          }
        ]
      : []),
    ...(hasDiabetes
      ? [
          {
            category: "Diabetes",
            risk: "High",
            score: 78,
            icon: Activity,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            factors: [
              "Type 2 Diabetes diagnosis"
            ],
            recommendations: [
              ...(diabetesMeds?.length
                ? diabetesMeds.map((med) => `Continue current medication: ${med.name}`)
                : [])
            ]
          }
        ]
      : []),
    ...(hasMentalHealth
      ? [
          {
            category: "Mental Health",
            risk: "Low",
            score: 25,
            icon: Brain,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            factors: [
              "Mental health condition identified"
            ],
            recommendations: [
              "Follow up with a mental health provider"
            ]
          }
        ]
      : [])
  ];

  // Risk trend data
  const riskTrendData = [
    { month: "Jan", cardiovascular: 60, diabetes: 75, mentalHealth: 20 },
    { month: "Feb", cardiovascular: 62, diabetes: 76, mentalHealth: 22 },
    { month: "Mar", cardiovascular: 58, diabetes: 78, mentalHealth: 18 },
    { month: "Apr", cardiovascular: 65, diabetes: 78, mentalHealth: 25 },
    { month: "May", cardiovascular: 63, diabetes: 77, mentalHealth: 23 },
    { month: "Jun", cardiovascular: 65, diabetes: 78, mentalHealth: 25 }
  ];

  // Risk distribution data
  const overallRiskScore = riskFactors.length
    ? Math.round(riskFactors.reduce((sum, risk) => sum + risk.score, 0) / riskFactors.length)
    : 20;
  const overallRiskLevel = overallRiskScore >= 75 ? "High" : overallRiskScore >= 50 ? "Moderate" : "Low";

  const lowRiskValue = Math.max(10, Math.round((100 - overallRiskScore) * 0.35));
  const highRiskValue = Math.max(10, Math.round(overallRiskScore * 0.35));
  const moderateRiskValue = 100 - lowRiskValue - highRiskValue;

  const riskDistribution = [
    { name: "Low Risk", value: lowRiskValue, color: "#10b981" },
    { name: "Moderate Risk", value: moderateRiskValue, color: "#f59e0b" },
    { name: "High Risk", value: highRiskValue, color: "#ef4444" },
  ];

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "low": return "text-green-600 bg-green-100";
      case "moderate": return "text-yellow-600 bg-yellow-100";
      case "high": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Risk Analysis Dashboard</h1>
          <p className="text-gray-600">Comprehensive health risk assessment and personalized recommendations</p>
        </div>

        {/* Overall Risk Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Overall Health Risk Assessment</h2>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className={`text-2xl font-bold ${overallRiskLevel === 'High' ? 'text-red-600' : overallRiskLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {overallRiskLevel}
                </p>
                <p className="text-sm text-gray-600">Overall Risk</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{overallRiskScore}</p>
                <p className="text-sm text-gray-600">Risk Score</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Distribution Chart */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Trend Chart */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-gray-800 mb-4">Risk Trend (6 Months)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  {hasHypertension && (
                    <Line type="monotone" dataKey="cardiovascular" stroke="#ef4444" strokeWidth={2} name="Cardiovascular" />
                  )}
                  {hasDiabetes && (
                    <Line type="monotone" dataKey="diabetes" stroke="#f59e0b" strokeWidth={2} name="Diabetes" />
                  )}
                  {hasMentalHealth && (
                    <Line type="monotone" dataKey="mentalHealth" stroke="#3b82f6" strokeWidth={2} name="Mental Health" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Detailed Risk Categories */}
        <div className="space-y-6">
          {riskFactors.map((risk, index) => {
            const IconComponent = risk.icon;
            const isExpanded = expandedSection === index;

            return (
              <motion.div
                key={risk.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-sm border ${risk.borderColor} overflow-hidden`}
              >
                {/* Header */}
                <div
                  className={`p-6 cursor-pointer ${risk.bgColor} border-b ${risk.borderColor}`}
                  onClick={() => setExpandedSection(isExpanded ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <IconComponent className={`w-8 h-8 ${risk.color}`} />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{risk.category} Risk</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(risk.risk)}`}>
                            {risk.risk} Risk
                          </span>
                          <span className="text-gray-600">Score: {risk.score}/100</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${risk.risk === 'High' ? 'bg-red-500' : risk.risk === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${risk.score}%` }}
                          />
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6"
                  >
                    {(risk.factors?.length > 0 || risk.recommendations?.length > 0) ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {risk.factors?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              Contributing Factors
                            </h4>
                            <ul className="space-y-2">
                              {risk.factors.map((factor, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {risk.recommendations?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-green-500" />
                              Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {risk.recommendations.map((rec, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-700">
                        <p className="text-sm">
                          Detailed contributing factors and recommendations will appear once relevant report data is available.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Preventive Measures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Preventive Health Measures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Regular Exercise</h3>
              <p className="text-sm text-gray-600">150 min/week recommended</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Heart Health</h3>
              <p className="text-sm text-gray-600">Monitor blood pressure</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Mental Wellness</h3>
              <p className="text-sm text-gray-600">Stress management</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Regular Checkups</h3>
              <p className="text-sm text-gray-600">Annual health screening</p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};