import React from "react";

export const RightPanel = () => {
  return (
    <div className="space-y-6">
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-700 mb-2">
          Health Intelligence Score
        </h3>
        <p className="text-3xl font-bold text-blue-600">85</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-bold text-yellow-700 mb-2">
          Risk Level
        </h3>
        <p className="text-lg font-semibold text-yellow-600">
          Moderate
        </p>
      </div>

      <div className="bg-gray-100 border border-gray-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-700 mb-2">
          Quick Stats
        </h3>
        <p className="text-gray-600 text-sm">
          Appointments: 5 <br />
          Last Visit: 01/01/2024
        </p>
      </div>

    </div>
  );
};
