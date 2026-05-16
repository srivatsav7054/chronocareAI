import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  AreaChart, Area, BarChart, Bar, Cell
} from "recharts";
import { 
  Loader, Sparkles, TrendingUp, ShieldAlert, ArrowRight, 
  Heart, Activity, Zap, Info, CheckCircle2, AlertTriangle
} from "lucide-react";
import api from "../api/api";

export const HealthIntelligence = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await api.get("/api/health-score");
        setData(res.data.healthScore);
      } catch (err) {
        console.error("Failed to fetch health score", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  const handlePredict = async () => {
    setPredicting(true);
    try {
      const res = await api.get("/api/health-score/predict");
      setPrediction(res.data.prediction);
    } catch (err) {
      console.error("Prediction failed", err);
      alert("Failed to generate AI forecast");
    } finally {
      setPredicting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-gray-500 animate-pulse">Analyzing health data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Activity className="w-16 h-16 text-gray-200 mb-4" />
        <h3 className="text-xl font-bold text-gray-700">No Data Available</h3>
        <p className="text-gray-400 mt-2 max-w-xs text-center">Upload your medical reports to generate your first health score and AI insights.</p>
        <button className="mt-6 btn-honey px-6 py-2 rounded-full font-bold">Upload Now</button>
      </div>
    );
  }

  const { score, breakdown, trend } = data;
  
  const getStatus = (s) => {
    if (s >= 85) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" };
    if (s >= 70) return { label: "Good", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" };
    if (s >= 50) return { label: "Fair", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" };
    return { label: "Needs Attention", color: "text-red-500", bg: "bg-red-50", border: "border-red-100" };
  };

  const status = getStatus(score);

  const metricsData = [
    { name: "Chronic Risk", score: Math.max(0, 100 - (breakdown?.chronicConditionsPenalty || 0)), color: "#ef4444" },
    { name: "Allergy Impact", score: Math.max(0, 100 - (breakdown?.allergyPenalty || 0)), color: "#f97316" },
    { name: "Vitals & Age", score: Math.max(0, 100 - ((breakdown?.bmiPenalty || 0) + (breakdown?.agePenalty || 0))), color: "#3b82f6" },
    { name: "Clinical Risk", score: Math.max(0, 100 - (breakdown?.reportRiskPenalty || 0)), color: "#10b981" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Main Score Card */}
        <div className="flex-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Health Index</h2>
            <div className="flex items-center gap-3">
              <span className={`text-6xl font-black text-gray-900 tracking-tighter`}>{score}</span>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${status.color} px-2 py-0.5 rounded-full ${status.bg} border ${status.border} inline-block`}>
                  {status.label}
                </span>
                <span className="text-xs text-gray-400 ml-1">Out of 100</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 relative z-10">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
              <span>SCORE BREAKDOWN</span>
              <span>STABILITY: HIGH</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r from-amber-400 to-amber-500`}
              />
            </div>
          </div>

          {/* Decorative Elements */}
          <Heart className="absolute -bottom-4 -right-4 w-32 h-32 text-amber-50 opacity-[0.03] rotate-12" />
        </div>

        {/* Quick Insights */}
        <div className="md:w-80 space-y-4">
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Top Priority</p>
              <p className="text-sm text-amber-800 mt-1">Address BMI deviations noted in recent records.</p>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Strength</p>
              <p className="text-sm text-emerald-800 mt-1">Excellent management of chronic conditions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Metrics Visuals */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Metrics Bars */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-800">Core Health Metrics</h3>
              <Info className="w-4 h-4 text-gray-300" />
            </div>
            
            <div className="space-y-6">
              {metricsData.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-600">{m.name}</span>
                    <span className="text-sm font-black text-gray-900">{m.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.score}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{ backgroundColor: m.color }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-50">
              <h4 className="text-sm font-bold text-gray-800 mb-4">Historical Progress</h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Side Panel: AI Predictions & Actions */}
        <div className="space-y-8">
          
          {/* AI Forecast Card */}
          <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">AI Clinical Forecast</h3>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>

            {!prediction ? (
              <div className="py-6 text-center">
                <p className="text-gray-400 text-sm mb-6">Run our advanced AI models to predict your health trajectory for the next 3 months.</p>
                <button 
                  onClick={handlePredict}
                  disabled={predicting}
                  className="w-full bg-white text-gray-900 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
                >
                  {predicting ? <Loader className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                  {predicting ? "ANAYLZING BIOMETRICS..." : "GENERATE FORECAST"}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-gray-800 rounded-2xl p-4 mb-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">3-Month Predicted Score</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-amber-400">{prediction.predicted_score_3_months}</span>
                    <span className="text-xs font-bold bg-gray-700 text-gray-300 px-2 py-1 rounded-lg">
                      {prediction.risk_trajectory}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Clinical Insights</h4>
                    <p className="text-sm text-gray-300 leading-relaxed italic">
                      "{prediction.clinical_forecast}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Action Plan</h4>
                    <ul className="space-y-3">
                      {prediction.preventative_actions.map((act, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                          <div className="w-5 h-5 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-amber-400 transition-colors">
                            <ArrowRight className="w-3 h-3 text-gray-500 group-hover:text-amber-400" />
                          </div>
                          <span className="text-xs text-gray-400 leading-normal">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Glossy Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 opacity-10 blur-[60px] rounded-full -mr-16 -mt-16" />
          </div>

          {/* Advice Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4">Doctor's Note</h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your health score is a synthesis of multiple data points. Always consult with a licensed professional before making significant lifestyle changes based on AI projections.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
