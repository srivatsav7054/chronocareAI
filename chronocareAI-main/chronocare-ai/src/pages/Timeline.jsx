import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import { dummyTimelineEvents } from '../data/dummyData';

export const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getEventIcon = (type) => {
    const icons = {
      diagnosis: '🏥',
      surgery: '⚕️',
      treatment: '💊',
      vaccination: '💉',
      checkup: '✓',
    };
    return icons[type] || '•';
  };

  return (
    <div className="p-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Lifelong Health Timeline
            </h1>
          </div>
          <p className="text-gray-500 ml-11">
            Your complete medical history at a glance
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className="max-w-4xl relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-200" />

          <div className="space-y-10 pl-12">
            {dummyTimelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-8 top-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm shadow-md">
                  {getEventIcon(event.type)}
                </div>

                {/* Event Card */}
                <motion.div
                  layout
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
                  onClick={() =>
                    setSelectedEvent(
                      selectedEvent?.id === event.id ? null : event
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <motion.div
                      animate={{
                        rotate:
                          selectedEvent?.id === event.id ? 90 : 0,
                      }}
                      className="text-blue-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </div>

                  {/* Expandable Description */}
                  <motion.div
                    initial={false}
                    animate={{
                      height:
                        selectedEvent?.id === event.id ? 'auto' : 0,
                      opacity:
                        selectedEvent?.id === event.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {selectedEvent?.id === event.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {event.description}
                        </p>

                        <div className="flex gap-3 mt-4">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                            View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                            Download Report
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: 'Total Events', value: dummyTimelineEvents.length },
            { label: 'Years Tracked', value: '9+' },
            { label: 'Diagnoses', value: 2 },
            { label: 'Treatments', value: 3 },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
            >
              <p className="text-gray-500 text-sm mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
    </div>
  );
};
