import React from 'react';
import { motion } from 'framer-motion';

export const CircularHealthScore = ({ score = 82, size = 200 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.svg
        width={size}
        height={size}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth="4"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
        <text
          x={size / 2}
          y={size / 2 + 10}
          textAnchor="middle"
          fontSize="48"
          fontWeight="bold"
          fill="white"
        >
          {score}
        </text>
      </motion.svg>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 text-sm mt-4"
      >
        Overall Health Score
      </motion.p>
    </div>
  );
};
