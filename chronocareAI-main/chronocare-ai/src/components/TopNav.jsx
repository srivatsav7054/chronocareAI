import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, User, ChevronDown, Pill, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const TopNav = () => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const notificationsRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: "medication",
      title: "Medication Reminder",
      message: "Time to take your Lisinopril (10mg) - Once daily",
      time: "2 hours ago",
      icon: Pill,
      urgent: true,
    },
    {
      id: 2,
      type: "appointment",
      title: "Upcoming Appointment",
      message: "Cardiology checkup scheduled for tomorrow at 2:00 PM",
      time: "1 day ago",
      icon: Calendar,
      urgent: false,
    },
    {
      id: 3,
      type: "alert",
      title: "Health Alert",
      message: "Your blood pressure reading is slightly elevated",
      time: "3 days ago",
      icon: AlertCircle,
      urgent: true,
    },
    {
      id: 4,
      type: "medication",
      title: "Medication Reminder",
      message: "Time to take your Metformin (500mg) - Twice daily",
      time: "4 hours ago",
      icon: Pill,
      urgent: false,
    },
  ];

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    navigate('/login');
  };

  const getNotificationIcon = (type) => {
    const icons = {
      medication: Pill,
      appointment: Calendar,
      alert: AlertCircle,
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      medication: "text-blue-600",
      appointment: "text-green-600",
      alert: "text-red-600",
    };
    return colors[type] || "text-gray-600";
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-blue-600">
          HealthHive
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAccountMenu(false); // Close account menu when opening notifications
            }}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <p className="text-sm text-gray-500">Stay updated on your health</p>
              </div>

              <div className="space-y-1">
                {notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                        notification.urgent ? 'border-l-red-500' : 'border-l-blue-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className={`w-5 h-5 mt-0.5 ${getNotificationColor(notification.type)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800 text-sm truncate">
                              {notification.title}
                            </h4>
                            {notification.urgent && (
                              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-gray-400 text-xs mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* No "View All" link - removed as requested */}
            </div>
          )}
        </div>

        {/* Emergency Button */}
        <Link to="/emergency">
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Emergency</span>
          </button>
        </Link>

        {/* Account Menu */}
        <div className="relative" ref={accountMenuRef}>
          <button
            onClick={() => {
              setShowAccountMenu(!showAccountMenu);
              setShowNotifications(false); // Close notifications when opening account menu
            }}
            className="flex items-center gap-2 p-2 text-gray-600 hover:text-blue-600 transition"
          >
            <User className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </button>

          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setShowAccountMenu(false)}
              >
                Profile Settings
              </Link>
              <Link
                to="/access-control"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setShowAccountMenu(false)}
              >
                Access Control
              </Link>
              <hr className="my-1" />
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
