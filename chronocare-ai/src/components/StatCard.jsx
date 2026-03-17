import React from 'react';
import { motion } from 'framer-motion';

export const StatCard = ({ icon: Icon, label, value, color = 'from-indigo-500 to-purple-600' }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card p-6 rounded-xl bg-gradient-to-br ${color} opacity-20 hover:opacity-30 smooth-transition cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/70 text-sm font-medium mb-2">{label}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`p-3 rounded-lg bg-gradient-to-br ${color} opacity-30`}
        >
          <Icon className="text-white w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
};
