import React, { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Access Control</h1>
        <p className="text-gray-400 text-sm">Manage who can view your medical records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card space-y-5">
            <Toggle label="Doctor Access" value={doctorAccess} onChange={() => setDoctorAccess(!doctorAccess)} />
            <Toggle label="Emergency Access" value={emergencyAccess} onChange={() => setEmergencyAccess(!emergencyAccess)} />
            <Toggle label="Hospital Access" value={hospitalAccess} onChange={() => setHospitalAccess(!hospitalAccess)} />

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Link Expiry</label>
              <select
                value={tokenExpiry}
                onChange={(e) => setTokenExpiry(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
              </select>
            </div>

            <button onClick={handleGenerateLink} className="btn-honey w-full py-3">
              Generate Secure Link
            </button>

            {generatedLink && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-700 text-sm font-mono break-all">
                {generatedLink}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
            <h3 className="font-semibold text-amber-700 mb-2 text-sm">AI Suggestion</h3>
            <p className="text-amber-600 text-sm">
              Enabling Emergency Access is recommended for faster treatment during critical situations.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">What Gets Shared</h3>
            <p className="text-gray-500 text-sm">
              Only allergies, chronic conditions, and current medications are shared via secure links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={onChange}
      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
        value ? "bg-amber-400" : "bg-gray-200"
      }`}
    >
      <div className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform ${value ? "translate-x-5" : ""}`} />
    </button>
  </div>
);
