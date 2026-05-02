import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import beeLogo from "../assets/bee-logo.svg";

export const TopNav = () => {
  const { logout, userProfile, role, toggleRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
      <Link to="/dashboard" className="flex items-center gap-2.5">
        <img src={beeLogo} alt="HealthHive" className="w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">
          Health<span className="text-amber-500">Hive</span>
        </span>
      </Link>

      <div className="flex gap-2 items-center">
        {/* Toggle Role Button */}
        <button
          onClick={toggleRole}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            role === "doctor" 
              ? "bg-indigo-100 text-indigo-700 border-indigo-200" 
              : "bg-emerald-100 text-emerald-700 border-emerald-200"
          }`}
        >
          {role === "doctor" ? "👨‍⚕️ DOCTOR VIEW" : "🧑‍🦱 PATIENT VIEW"}
        </button>
        {/* Show user name if available */}
        {userProfile?.name && (
          <span className="hidden md:block text-sm text-gray-500 mr-1">
            Hi, <span className="font-medium text-gray-700">{userProfile.name.split(" ")[0]}</span>
          </span>
        )}

        <Link
          to="/unified-profile"
          className="flex items-center gap-2 text-gray-500 hover:text-amber-500 hover:bg-amber-50 transition px-3 py-2 rounded-lg text-sm font-medium"
        >
          {userProfile?.profilePicture ? (
            <img
              src={userProfile.profilePicture}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Profile</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition px-3 py-2 rounded-lg text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};
