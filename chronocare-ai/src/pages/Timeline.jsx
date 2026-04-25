import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { dummyTimelineEvents } from '../data/dummyData';

export const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventIcon = (type) => {
    const icons = { diagnosis: '🏥', surgery: '⚕️', treatment: '💊', vaccination: '💉', checkup: '✓' };
    return icons[type] || '•';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Health Timeline</h1>
        <p className="text-gray-400 text-sm">Your complete medical history at a glance</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-amber-200" />

        <div className="space-y-6 pl-12">
          {dummyTimelineEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative"
            >
              <div className="absolute -left-8 top-3 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                {getEventIcon(event.type)}
              </div>

              <div
                className="card cursor-pointer hover:border-amber-200"
                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <motion.div animate={{ rotate: selectedEvent?.id === event.id ? 90 : 0 }} className="text-gray-400">
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </div>

                {selectedEvent?.id === event.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-500 text-sm leading-relaxed">{event.description}</p>
                    <div className="flex gap-3 mt-4">
                      <button className="btn-honey text-xs py-2 px-4">View Details</button>
                      <button className="btn-outline text-xs py-2 px-4">Download Report</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: dummyTimelineEvents.length },
          { label: 'Years Tracked', value: '9+' },
          { label: 'Diagnoses', value: 2 },
          { label: 'Treatments', value: 3 },
        ].map((stat, idx) => (
          <div key={idx} className="card text-center">
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-amber-500">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
