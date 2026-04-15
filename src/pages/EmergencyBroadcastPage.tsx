import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Radio, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '../components/AdminLayout';
import { puroks, getAnnouncements, saveAnnouncements } from '../data/mockData';
import { useNotifications } from '../contexts/NotificationContext';
import { motion } from 'framer-motion';
export function EmergencyBroadcastPage() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const registeredUsers = JSON.parse(
    localStorage.getItem('padinig_users') || '[]'
  );
  const smsResidents = JSON.parse(
    localStorage.getItem('padinig_residents') || '[]'
  );
  const totalResidents = smsResidents.length + registeredUsers.length;
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState('URGENT: ');
  const [type, setType] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>(['All']);
  const handleAreaToggle = (area: string) => {
    if (area === 'All') {
      setSelectedAreas(['All']);
      return;
    }
    let newSelection = selectedAreas.filter((a) => a !== 'All');
    if (newSelection.includes(area)) {
      newSelection = newSelection.filter((a) => a !== area);
    } else {
      newSelection.push(area);
    }
    if (newSelection.length === 0) {
      setSelectedAreas(['All']);
    } else {
      setSelectedAreas(newSelection);
    }
  };
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    const newEmergency = {
      id: Math.random().toString(36).substring(2, 9),
      title: `Emergency Alert: ${type.toUpperCase()}`,
      message,
      category: 'Emergency',
      date: new Date().toISOString(),
      status: 'Sent',
      targetAudience: selectedAreas.includes('All') ?
      ['All Residents'] :
      selectedAreas,
      deliveryMethod: 'Both',
      recipientsCount: selectedAreas.includes('All') ?
      totalResidents :
      selectedAreas.length > 0 ?
      Math.ceil(totalResidents / puroks.length * selectedAreas.length) :
      0,
      isEmergency: true
    } as const;
    const currentAnnouncements = getAnnouncements();
    saveAnnouncements([newEmergency, ...currentAnnouncements]);
    addNotification({
      type: 'emergency',
      title: 'Emergency Broadcast Sent',
      message: `Emergency alert "${type.toUpperCase()}" sent to ${selectedAreas.includes('All') ? 'All Residents' : selectedAreas.join(', ')}`,
      category: 'Emergency',
      targetAudience: selectedAreas.includes('All') ?
      ['All Residents'] :
      selectedAreas
    });
    toast.error('EMERGENCY BROADCAST SENT TO ALL RESIDENTS', {
      style: {
        background: '#dc2626',
        color: 'white',
        border: 'none'
      },
      duration: 4000
    });
    setIsConfirming(false);
    setMessage('URGENT: ');
    setType('');
    setSelectedAreas(['All']);
    navigate('/dashboard');
  };
  return (
    <AdminLayout title="Emergency Broadcast">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border-2 border-emergency/20 dark:border-emergency/30 overflow-hidden">
          
          {/* Header */}
          <div className="bg-emergency text-white p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30"></div>
            <ShieldAlert size={48} className="mx-auto mb-3 animate-pulse" />
            <h2 className="text-2xl font-bold uppercase tracking-wider">
              Emergency Broadcast System
            </h2>
            <p className="text-emergency-light text-white/80 mt-1 text-sm">
              Use only for critical, life-threatening situations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleBroadcast} className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Emergency Type
              </label>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-emergency transition-colors bg-slate-50 dark:bg-slate-700 font-medium text-slate-800 dark:text-white">
                
                <option value="">Select Emergency Type...</option>
                <option value="typhoon">Typhoon / Severe Weather</option>
                <option value="flood">Flash Flood Warning</option>
                <option value="fire">Fire Alert</option>
                <option value="earthquake">Earthquake Aftermath</option>
                <option value="health">Public Health Emergency</option>
                <option value="security">Security Threat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Alert Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter clear, actionable instructions for residents..."
                className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-0 focus:border-emergency transition-colors resize-none text-lg bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400" />
              
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                This message will bypass normal delivery queues and be sent
                immediately via SMS and Web Push.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">
                Affected Areas
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="flex items-center p-3 border-2 border-emergency/30 bg-emergency/5 dark:bg-emergency/10 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAreas.includes('All')}
                    onChange={() => handleAreaToggle('All')}
                    className="w-5 h-5 text-emergency border-slate-300 dark:border-slate-500 rounded focus:ring-emergency" />
                  
                  <span className="ml-3 font-bold text-emergency">
                    ALL AREAS
                  </span>
                </label>
                {puroks.map((purok) =>
                <label
                  key={purok}
                  className="flex items-center p-3 border-2 border-slate-100 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  
                    <input
                    type="checkbox"
                    checked={selectedAreas.includes(purok)}
                    onChange={() => handleAreaToggle(purok)}
                    className="w-5 h-5 text-emergency border-slate-300 dark:border-slate-500 rounded focus:ring-emergency" />
                  
                    <span className="ml-3 font-medium text-slate-700 dark:text-slate-300">
                      {purok}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
              {isConfirming ?
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className="bg-red-50 dark:bg-red-900/20 border-2 border-emergency rounded-xl p-4 text-center">
                
                  <p className="font-bold text-emergency mb-4 text-lg">
                    Are you absolutely sure you want to broadcast this emergency
                    alert?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    className="px-6 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    
                      CANCEL
                    </button>
                    <button
                    type="submit"
                    className="px-8 py-3 bg-emergency text-white font-bold rounded-xl hover:bg-emergency-dark transition-colors flex items-center gap-2 shadow-lg shadow-emergency/30 animate-pulse">
                    
                      <Radio size={20} /> YES, BROADCAST NOW
                    </button>
                  </div>
                </motion.div> :

              <button
                type="submit"
                className="w-full py-4 bg-emergency text-white font-bold text-lg rounded-xl hover:bg-emergency-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emergency/20">
                
                  <AlertTriangle size={24} /> INITIATE EMERGENCY BROADCAST
                </button>
              }
            </div>
          </form>
        </motion.div>

        {/* Guidelines */}
        <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
            Emergency Protocol Guidelines
          </h3>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
            <li>
              Keep messages brief and state the exact action required (e.g.,
              "Evacuate to Brgy Hall immediately").
            </li>
            <li>Do not cause unnecessary panic; stick to facts.</li>
            <li>
              Emergency broadcasts consume SMS credits at a higher priority
              rate.
            </li>
            <li>
              All emergency broadcasts are logged permanently for auditing
              purposes.
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>);

}