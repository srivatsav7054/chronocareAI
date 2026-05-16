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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            className="relative w-full max-w-3xl bg-red-600 rounded-2xl p-8 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={() => setIsActivated(false)}
              className="absolute top-6 right-6 text-white hover:opacity-80"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex justify-center mb-4"
              >
                <AlertTriangle
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                />
              </motion.div>

              <h1 className="text-4xl font-black text-white mb-2">
                EMERGENCY MODE
              </h1>
              <p className="text-red-100 text-lg">
                Critical Health Information for {dummyUserData.name}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Blood Group */}
              <div className="bg-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Droplet className="w-6 h-6 text-white" />
                  <h2 className="text-white font-bold text-lg">Blood Group</h2>
                </div>
                <p className="text-4xl font-black text-white">
                  {dummyUserData.bloodGroup}
                </p>
              </div>

              {/* Allergies */}
              <div className="bg-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-white font-bold text-lg">Allergies</h2>
                </div>
                <div className="space-y-2">
                  {dummyUserData.allergies.map((allergy, idx) => (
                    <div
                      key={idx}
                      className="bg-red-500/70 text-white px-3 py-2 rounded-lg font-semibold"
                    >
                      ⚠ {allergy}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="bg-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-orange-300" />
                  <h2 className="text-white font-bold text-lg">
                    Chronic Conditions
                  </h2>
                </div>
                <div className="space-y-2">
                  {dummyUserData.chronicConditions.map((condition, idx) => (
                    <div
                      key={idx}
                      className="bg-orange-500/70 text-white px-3 py-2 rounded-lg font-semibold"
                    >
                      • {condition}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div className="bg-white/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Pill className="w-6 h-6 text-blue-200" />
                  <h2 className="text-white font-bold text-lg">
                    Current Medications
                  </h2>
                </div>
                <div className="space-y-2">
                  {dummyUserData.currentMedications.map((med, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-500/70 text-white px-3 py-2 rounded-lg"
                    >
                      <p className="font-bold">{med.name}</p>
                      <p className="text-sm">
                        {med.dosage} — {med.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsActivated(false)}
              className="mt-8 w-full py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Exit Emergency Mode
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="p-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Emergency Mode
          </h1>
          <p className="text-gray-500">
            Quick access to critical health information in case of emergency
          </p>
        </div>

        {/* Emergency Button Section */}
        <div className="max-w-xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
            <p className="text-gray-600 mb-8">
              Click the button below to activate emergency access mode.
              This displays vital medical information instantly.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsActivated(true)}
              className="relative w-40 h-40 mx-auto"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-200"
              />

              <div className="absolute inset-0 rounded-full bg-red-600 flex items-center justify-center shadow-xl">
                <AlertTriangle
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                />
              </div>
            </motion.button>

            <p className="mt-6 text-xl font-bold text-red-600">
              ACTIVATE EMERGENCY
            </p>
          </div>
        </div>
    </div>
  );
};
