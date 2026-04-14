import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Link2, Clock } from "lucide-react";

export const AccessControl = () => {
  const [doctorAccess, setDoctorAccess] = useState(true);
  const [emergencyAccess, setEmergencyAccess] = useState(true);
  const [hospitalAccess, setHospitalAccess] = useState(false);
  const [tokenExpiry, setTokenExpiry] = useState("24h");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerateLink = () => {
    const fakeToken = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`https://healthhive.app/share/${fakeToken}`);
  };

  return (
    <div className="min-h-screen bg-honey-50 p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-10"
      >
        Access Control
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* MAIN SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Patient Profile
            </h2>
            <p className="text-gray-600">
              Manage who can access your medical records.
            </p>
          </div>

          {/* Toggles */}
          <div className="card space-y-6">

            {/* Doctor */}
            <Toggle
              label="Doctor Access"
              value={doctorAccess}
              onChange={() => setDoctorAccess(!doctorAccess)}
            />

            {/* Emergency */}
            <Toggle
              label="Emergency Access"
              value={emergencyAccess}
              onChange={() => setEmergencyAccess(!emergencyAccess)}
            />

            {/* Hospital */}
            <Toggle
              label="Hospital Access"
              value={hospitalAccess}
              onChange={() => setHospitalAccess(!hospitalAccess)}
            />

            {/* Token Expiry */}
            <div>
              <label className="text-gray-700 font-medium">
                Token Expiry
              </label>
              <select
                value={tokenExpiry}
                onChange={(e) => setTokenExpiry(e.target.value)}
                className="mt-2 w-full p-3 rounded-lg border border-gray-200"
              >
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>

            {/* Generate Link */}
            <button
              onClick={handleGenerateLink}
              className="w-full py-3 rounded-lg bg-honey-500 text-white font-bold hover:bg-honey-600 transition"
            >
              Generate Secure Link
            </button>

            {generatedLink && (
              <div className="bg-honey-100 p-4 rounded-lg text-honey-700 break-all">
                {generatedLink}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="space-y-6">

          {/* AI Consent Suggestion */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">
              AI Consent Suggestion
            </h3>
            <p className="text-gray-600 text-sm">
              Based on your profile, enabling Emergency Access is recommended
              for faster treatment during critical situations.
            </p>
          </div>

          {/* AI Summary Preview */}
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">
              Shared Summary Preview
            </h3>
            <p className="text-gray-600 text-sm">
              Only allergies, chronic conditions, and medications will be shared.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

/* Toggle Component */
const Toggle = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}</span>
      <button
        onClick={onChange}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          value ? "bg-honey-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
            value ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
};
