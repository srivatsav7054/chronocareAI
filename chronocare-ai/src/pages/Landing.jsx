import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, ShieldCheck, Activity, AlertTriangle, Clock, Upload } from "lucide-react";
import beeLogo from "../assets/bee-logo.svg";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img src={beeLogo} alt="HealthHive" className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
              Your medical history,<br />
              <span className="text-amber-500">all in one place.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
              Store, track, and route your medical reports with AI-powered insights. HealthHive keeps your entire health journey organized and accessible.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="btn-honey"
              >
                Get Started — Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-outline"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
          Everything you need for your health records
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Clock className="text-amber-500 w-5 h-5" />}
            title="Health Timeline"
            description="Track every diagnosis, surgery, and checkup across your entire life."
            onClick={() => navigate("/login")}
          />
          <FeatureCard
            icon={<Upload className="text-amber-500 w-5 h-5" />}
            title="Upload & Route Reports"
            description="Upload reports and let AI route them to the right department automatically."
            onClick={() => navigate("/login")}
          />
          <FeatureCard
            icon={<Brain className="text-amber-500 w-5 h-5" />}
            title="AI Medical Story"
            description="Get a plain-English summary of your medical records using AI."
            onClick={() => navigate("/login")}
          />
          <FeatureCard
            icon={<Activity className="text-amber-500 w-5 h-5" />}
            title="Health Score"
            description="Monitor cardiac, diabetes, and surgical risk scores over time."
            onClick={() => navigate("/login")}
          />
          <FeatureCard
            icon={<ShieldCheck className="text-amber-500 w-5 h-5" />}
            title="Access Control"
            description="Share records securely with doctors via time-limited links."
            onClick={() => navigate("/login")}
          />
          <FeatureCard
            icon={<AlertTriangle className="text-amber-500 w-5 h-5" />}
            title="Emergency Mode"
            description="Instantly show critical health info — allergies, blood type, medications."
            onClick={() => navigate("/login")}
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:shadow-md hover:border-amber-200 transition-all"
    >
      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-1.5">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};
