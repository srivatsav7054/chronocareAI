import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export const RightPanel = () => {
  const { userProfile } = useAuth();
  const [score, setScore] = useState(userProfile?.healthScore || 0);
  const [upcoming, setUpcoming] = useState(0);
  const [lastCheck, setLastCheck] = useState("Never");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scoreRes, timelineRes] = await Promise.all([
          api.get("/api/health-score"),
          api.get("/api/timeline"),
        ]);
        
        if (scoreRes.data.healthScore) {
          setScore(scoreRes.data.healthScore.score);
        }
        
        const events = timelineRes.data.events || [];
        const today = new Date();
        
        // Count future appointments
        const future = events.filter(e => new Date(e.date) > today).length;
        setUpcoming(future);
        
        // Find last checkup
        const pastCheckups = events.filter(e => e.type === "checkup" && new Date(e.date) <= today);
        if (pastCheckups.length > 0) {
          setLastCheck(new Date(pastCheckups[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
        }

      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userProfile]);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-amber-600 mb-1">Health Score</h3>
        <p className="text-2xl font-bold text-gray-800">{score}</p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-orange-600 mb-1">Risk Level</h3>
        <p className="text-base font-semibold text-gray-700">
          {score > 80 ? "Low" : score > 50 ? "Moderate" : "High"}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-blue-600 mb-1">Timeline Summary</h3>
        <p className="text-gray-600 text-sm">
          Upcoming: {upcoming}<br />
          Last Checkup: {lastCheck}
        </p>
      </div>
    </div>
  );
};
