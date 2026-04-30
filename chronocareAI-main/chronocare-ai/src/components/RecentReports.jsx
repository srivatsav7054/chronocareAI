  import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock } from 'lucide-react';

export const RecentReports = ({ reports = [] }) => {
  const getStatusColor = (status) => {
    return status === 'Reviewed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400';
  };

  const getTypeIcon = (type) => {
    return <FileText className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6 rounded-xl"
    >
      <h3 className="text-white font-bold text-lg mb-4">Recent Reports</h3>
      <div className="space-y-3">
        {reports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 5 }}
            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 smooth-transition cursor-pointer"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 rounded-lg bg-indigo-500/20">
                {getTypeIcon(report.type)}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{report.title}</p>
                <p className="text-white/50 text-xs">{report.date}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(report.status)}`}>
              {report.status === 'Reviewed' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {report.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
