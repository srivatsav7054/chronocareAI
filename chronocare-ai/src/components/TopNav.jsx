import React from "react";
import { Link } from "react-router-dom";

export const TopNav = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-blue-600">
          HealthHive
        </div>
      </div>

      <div className="flex gap-6 text-gray-600 font-medium">
        <Link to="/dashboard" className="hover:text-blue-600 transition">
          Dashboard
        </Link>
        <Link to="/timeline" className="hover:text-blue-600 transition">
          Timeline
        </Link>
        <Link to="/upload" className="hover:text-blue-600 transition">
          Reports
        </Link>
        <Link to="/access-control" className="hover:text-blue-600 transition">
          Access Control
        </Link>
        <Link to="/emergency" className="hover:text-red-600 transition">
          Emergency Mode
        </Link>
      </div>
    </div>
  );
};
