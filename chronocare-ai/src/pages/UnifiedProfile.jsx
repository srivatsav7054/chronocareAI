import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Mail, Phone, MapPin, Calendar, Heart, Droplet,
  AlertCircle, Pill, Shield, Maximize2, Activity, Save, Edit2, X, User
} from "lucide-react";
import { useAuth } from "../context/AuthContext";



/* ─── Profile Page ─── */
export const UnifiedProfile = () => {
  const { userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const startEdit = (e) => {
    setEditData({ ...userProfile });
    setIsEditing(true);
  };

  const cancelEdit = (e) => {
    setIsEditing(false);
  };

  const saveEdit = (e) => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const set = (key) => (e) => setEditData({ ...editData, [key]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const p = userProfile;
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition";

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header + Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-400 text-sm">Manage your personal and medical information</p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={cancelEdit}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl text-sm transition"
            >
              <X className="w-4 h-4" /> Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={saveEdit}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-xl text-sm shadow-sm hover:shadow-md transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </motion.button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Avatar + Quick Info */}
        <div className="space-y-4">
          {/* Avatar Card */}
          <div className="card flex flex-col items-center py-8">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-amber-100">
                {p.profilePicture ? (
                  <img src={p.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-14 h-14 text-white" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-9 h-9 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-amber-50 transition group-hover:scale-110">
                <Camera className="w-4 h-4 text-amber-600" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <h2 className="mt-4 text-lg font-bold text-gray-800">{p.name || "Your Name"}</h2>
            <p className="text-gray-400 text-sm">{p.email}</p>

            {/* Quick Stats */}
            <div className="flex gap-4 mt-5 w-full px-4">
              <div className="flex-1 text-center bg-amber-50 rounded-xl py-3">
                <p className="text-xl font-bold text-amber-600">{p.healthScore || "—"}</p>
                <p className="text-xs text-gray-400">Health Score</p>
              </div>
              <div className="flex-1 text-center bg-red-50 rounded-xl py-3">
                <p className="text-xl font-bold text-red-500">{p.bloodGroup || "—"}</p>
                <p className="text-xs text-gray-400">Blood Group</p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-gray-800 text-sm">Allergies</h3>
            </div>
            {isEditing ? (
              <input
                value={Array.isArray(editData.allergies) ? editData.allergies.join(", ") : editData.allergies || ""}
                onChange={(e) => setEditData({ ...editData, allergies: e.target.value.split(",").map(s => s.trim()) })}
                className={inputClass}
                placeholder="Penicillin, Peanuts"
              />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(p.allergies || []).map((a, i) => (
                  <span key={i} className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-medium">{a}</span>
                ))}
                {(!p.allergies || p.allergies.length === 0) && <p className="text-gray-400 text-sm">None listed</p>}
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-gray-800 text-sm">Current Medications</h3>
            </div>
            <div className="space-y-2">
              {(p.currentMedications || []).map((m, i) => (
                <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="font-medium text-gray-700 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.dosage} — {m.frequency}</p>
                </div>
              ))}
              {(!p.currentMedications || p.currentMedications.length === 0) && (
                <p className="text-gray-400 text-sm">No medications listed</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={<User />} label="Full Name" value={p.name} field="name" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
              <InfoRow icon={<Mail />} label="Email" value={p.email} field="email" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} type="email" />
              <InfoRow icon={<Phone />} label="Phone" value={p.phone} field="phone" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
              <InfoRow icon={<Calendar />} label="Date of Birth" value={p.dateOfBirth} field="dateOfBirth" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} type="date" />
              <InfoRow icon={<Heart />} label="Gender" value={p.gender} field="gender" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
              <InfoRow icon={<MapPin />} label="Address" value={p.address} field="address" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
            </div>
          </div>

          {/* Medical Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" /> Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow icon={<Droplet />} label="Blood Group" value={p.bloodGroup} field="bloodGroup" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
              <InfoRow icon={<Maximize2 />} label="Height" value={p.height} field="height" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
              <InfoRow icon={<Activity />} label="Weight" value={p.weight} field="weight" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
              <InfoRow icon={<Shield />} label="Emergency Contact" value={p.emergencyContact} field="emergencyContact" isEditing={isEditing} editData={editData} set={set} inputClass={inputClass} />
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" /> Chronic Conditions
            </h3>
            {isEditing ? (
              <input
                value={Array.isArray(editData.chronicConditions) ? editData.chronicConditions.join(", ") : editData.chronicConditions || ""}
                onChange={(e) => setEditData({ ...editData, chronicConditions: e.target.value.split(",").map(s => s.trim()) })}
                className={inputClass}
                placeholder="Hypertension, Diabetes"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(p.chronicConditions || []).map((c, i) => (
                  <span key={i} className="bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-lg text-xs font-medium">{c}</span>
                ))}
                {(!p.chronicConditions || p.chronicConditions.length === 0) && <p className="text-gray-400 text-sm">None listed</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Reusable Info Row ─── */
const InfoRow = ({ icon, label, value, field, isEditing, editData, set, inputClass, type = "text" }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
      {React.cloneElement(icon, { className: "w-3.5 h-3.5" })}
      {label}
    </label>
    {isEditing ? (
      <input type={type} value={editData[field] || ""} onChange={set(field)} className={inputClass} />
    ) : (
      <p className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2.5 rounded-lg">{value || "—"}</p>
    )}
  </div>
);
