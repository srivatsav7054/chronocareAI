import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Clock, Upload, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/timeline', label: 'Health Timeline', icon: Clock },
    { path: '/upload', label: 'Upload Report', icon: Upload },
    { path: '/emergency', label: 'Emergency', icon: AlertCircle },
  ];

  return (
    <motion.nav
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm"
    >
      {/* Logo / Brand */}
      <Link to="/dashboard" className="flex items-center gap-3 mb-10">
        <div className="text-3xl">🐝</div>
        <span className="text-2xl font-bold text-honey-600">
          HealthHive
        </span>
      </Link>

      {/* Navigation Items */}
      <div className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-honey-100 text-honey-700 font-semibold'
                    : 'text-gray-600 hover:bg-honey-50 hover:text-honey-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 w-full"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </motion.button>
    </motion.nav>
  );
};
