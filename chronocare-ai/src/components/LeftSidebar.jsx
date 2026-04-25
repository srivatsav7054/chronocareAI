import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, Upload, AlertCircle, FileText, Brain, Shield, User } from "lucide-react";

export const LeftSidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "My Profile", path: "/unified-profile", icon: User },
    { label: "Health Timeline", path: "/timeline", icon: Clock },
    { label: "Medical Story", path: "/medical-story", icon: FileText },
    { label: "Upload Report", path: "/upload", icon: Upload },
    { label: "Health Score", path: "/health-intelligence", icon: Brain },
    { label: "Access Control", path: "/access-control", icon: Shield },
    { label: "Emergency", path: "/emergency", icon: AlertCircle },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 p-4 shrink-0 min-h-[calc(100vh-64px)] overflow-y-auto">
      <div className="space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="block">
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-100 text-amber-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {IconComponent && <IconComponent className="w-[18px] h-[18px]" />}
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};