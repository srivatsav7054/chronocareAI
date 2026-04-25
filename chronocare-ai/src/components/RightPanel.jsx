import React from "react";

export const RightPanel = () => {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-amber-600 mb-1">Health Score</h3>
        <p className="text-2xl font-bold text-gray-800">85</p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-orange-600 mb-1">Risk Level</h3>
        <p className="text-base font-semibold text-gray-700">Moderate</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-blue-600 mb-1">Upcoming</h3>
        <p className="text-gray-600 text-sm">
          Appointments: 5<br />
          Last Check: Jan 1, 2024
        </p>
      </div>
    </div>
  );
};
