import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Pill, AlertCircle, Droplet, X } from 'lucide-react';
import { dummyUserData } from '../data/dummyData';

export const Emergency = () => {
  const [isActivated, setIsActivated] = useState(false);

  if (isActivated) {
    return (
      <AnimatePresence>
        <motion.div
          key="emergency-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl border-2 border-red-200"
          >
            <button onClick={() => setIsActivated(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-600">Emergency Information</h1>
              <p className="text-gray-400 text-sm mt-1">Critical health data for {dummyUserData.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet className="w-4 h-4 text-red-500" />
                  <h2 className="text-sm font-semibold text-gray-700">Blood Group</h2>
                </div>
                <p className="text-3xl font-bold text-red-600">{dummyUserData.bloodGroup}</p>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-semibold text-gray-700">Allergies</h2>
                </div>
                <div className="space-y-1">
                  {dummyUserData.allergies.map((a, i) => (
                    <span key={i} className="inline-block bg-amber-200/60 text-amber-800 px-2 py-1 rounded-md text-xs font-medium mr-1">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <h2 className="text-sm font-semibold text-gray-700">Chronic Conditions</h2>
                </div>
                <div className="space-y-1">
                  {dummyUserData.chronicConditions.map((c, i) => (
                    <p key={i} className="text-sm text-gray-600">• {c}</p>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="w-4 h-4 text-blue-500" />
                  <h2 className="text-sm font-semibold text-gray-700">Medications</h2>
                </div>
                <div className="space-y-1.5">
                  {dummyUserData.currentMedications.map((m, i) => (
                    <div key={i}>
                      <p className="font-medium text-sm text-gray-700">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.dosage} — {m.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsActivated(false)}
              className="mt-6 w-full py-3 border-2 border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition text-sm"
            >
              Close Emergency View
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Emergency Mode</h1>
        <p className="text-gray-400 text-sm">Instantly access critical health info in an emergency</p>
      </div>

      <div className="card py-12">
        <p className="text-gray-500 text-sm mb-8">
          Tap the button below to display your vital medical information — blood type, allergies, medications, and conditions.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActivated(true)}
          className="relative w-32 h-32 mx-auto block"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-red-100"
          />
          <div className="absolute inset-0 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-12 h-12 text-white" fill="currentColor" />
          </div>
        </motion.button>

        <p className="mt-6 text-sm font-semibold text-red-500">Activate Emergency</p>
      </div>
    </div>
  );
};
