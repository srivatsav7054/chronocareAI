import React from "react";
import { Link, useLocation } from "react-router-dom";

export const LeftSidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Upload Report", path: "/upload" },
    { label: "Health Timeline", path: "/timeline" },
    { label: "Risk Analysis", path: "/risk-analysis" },
    { label: "Access Control", path: "/access-control" },
    { label: "Emergency Mode", path: "/emergency" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="space-y-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <div
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};