import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, Plus, Loader, X } from 'lucide-react';
import api from '../api/api';

export const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ date: '', title: '', description: '', type: 'other' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const { data } = await api.get('/api/timeline');
      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch timeline", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/timeline', addForm);
      await fetchTimeline();
      setShowAddForm(false);
      setAddForm({ date: '', title: '', description: '', type: 'other' });
    } catch (err) {
      alert("Failed to add event");
    } finally {
      setSaving(false);
    }
  };

  const getEventIcon = (type) => {
    const icons = { diagnosis: '🏥', surgery: '⚕️', treatment: '💊', vaccination: '💉', checkup: '✓', report: '📄' };
    return icons[type] || '•';
  };

  // Stats computation
  const diagnosesCount = events.filter(e => e.type === 'diagnosis').length;
  const treatmentsCount = events.filter(e => e.type === 'treatment').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Health Timeline</h1>
          <p className="text-gray-400 text-sm">Your complete medical history at a glance</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-honey text-sm px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Add Event Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card bg-amber-50 border-amber-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Add Medical Event</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date</label>
                  <input type="date" required value={addForm.date} onChange={e => setAddForm({...addForm, date: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select value={addForm.type} onChange={e => setAddForm({...addForm, type: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white">
                    <option value="checkup">Checkup</option>
                    <option value="diagnosis">Diagnosis</option>
                    <option value="treatment">Treatment</option>
                    <option value="surgery">Surgery</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="report">Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input type="text" required value={addForm.title} onChange={e => setAddForm({...addForm, title: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200" placeholder="e.g. Annual Physical Exam" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description (Optional)</label>
                <textarea value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200 h-20 resize-none" placeholder="Details about the event..." />
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn-honey px-6 py-2">
                  {saving ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="relative">
        {events.length > 0 && <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-amber-200" />}

        {events.length === 0 && !showAddForm ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-500">No events found. Upload a report or add an event to build your timeline.</p>
          </div>
        ) : (
          <div className="space-y-6 pl-12">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
                className="relative"
              >
                <div className="absolute -left-8 top-3 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {getEventIcon(event.type)}
                </div>

                <div
                  className="card cursor-pointer hover:border-amber-200"
                  onClick={() => setSelectedEvent(selectedEvent?._id === event._id ? null : event)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <motion.div animate={{ rotate: selectedEvent?._id === event._id ? 90 : 0 }} className="text-gray-400">
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {selectedEvent?._id === event._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
                      <div className="flex gap-3 mt-4">
                        {event.reportId && (
                          <button className="btn-outline text-xs py-2 px-4" onClick={(e) => { e.stopPropagation(); alert('Report view coming soon!'); }}>View Attached Report</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {events.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Events', value: events.length },
            { label: 'Latest Event', value: new Date(events[0].date).getFullYear() },
            { label: 'Diagnoses', value: diagnosesCount },
            { label: 'Treatments', value: treatmentsCount },
          ].map((stat, idx) => (
            <div key={idx} className="card text-center">
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-amber-500">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
