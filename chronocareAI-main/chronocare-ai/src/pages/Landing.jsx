import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from "lucide-react";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">

          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            HealthHive
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            AI-Powered Unified Health Intelligence Platform.
          </p>

          <div className="flex justify-center gap-6">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Sign In
            </button>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">
          Core Intelligence Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          <FeatureCard
            icon={<Brain className="text-blue-600 w-6 h-6" />}
            title="AI Medical Story"
            description="Unified AI narrative."
            onClick={() => navigate("/medical-story")}
          />

          <FeatureCard
            icon={<Activity className="text-green-600 w-6 h-6" />}
            title="Health Intelligence Score"
            description="Risk scoring engine."
            onClick={() => navigate("/health-intelligence")}
          />

          <FeatureCard
            icon={<ShieldCheck className="text-purple-600 w-6 h-6" />}
            title="Access Control"
            description="Secure sharing controls."
            onClick={() => navigate("/access-control")}
          />

          <FeatureCard
            icon={<AlertTriangle className="text-red-600 w-6 h-6" />}
            title="Unified Patient Profile"
            description="Cross-hospital intelligence."
            onClick={() => navigate("/unified-profile")}
          />

        </div>
      </section>

    </div>
  );
};

const FeatureCard = ({ icon, title, description, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};
