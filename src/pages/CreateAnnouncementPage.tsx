import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Clock, Smartphone, Globe, Info } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '../components/AdminLayout';
import {
  puroks,
  Category,
  DeliveryMethod } from
'../data/mockData';
import { motion } from 'framer-motion';
import { apiFetch } from '../lib/api';
export function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<Category>('General');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Both');
  const [selectedPuroks, setSelectedPuroks] = useState<string[]>(['All']);
  const handlePurokToggle = (purok: string) => {
    if (purok === 'All') {
      setSelectedPuroks(['All']);
      return;
    }
    let newSelection = selectedPuroks.filter((p) => p !== 'All');
    if (newSelection.includes(purok)) {
      newSelection = newSelection.filter((p) => p !== purok);
    } else {
      newSelection.push(purok);
    }
    if (newSelection.length === 0) {
      setSelectedPuroks(['All']);
    } else {
      setSelectedPuroks(newSelection);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scheduledIso =
        isScheduled && scheduleDate
          ? new Date(`${scheduleDate}T${scheduleTime || '00:00'}`).toISOString()
          : undefined;

      const audience = selectedPuroks.includes('All') ? 'ALL' : selectedPuroks.join(', ');

      await apiFetch('/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          category,
          status: isScheduled ? 'PENDING' : 'PUBLISHED',
          deliveryMethod: deliveryMethod === 'SMS' ? 'SMS' : 'WEB',
          scheduledDate: isScheduled ? scheduledIso : undefined,
          publishedDate: isScheduled ? undefined : new Date().toISOString(),
          targetAudience: audience,
        }),
      });

      toast.success(isScheduled ? 'Announcement scheduled!' : 'Announcement published!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create announcement');
    }
  };
  return (
    <AdminLayout title="Create Announcement">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 p-6">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Libreng Bakuna sa Barangay Hall"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400" />
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white">
                    
                    <option value="General">General Information</option>
                    <option value="Health">Health & Medical</option>
                    <option value="Event">Community Event</option>
                    <option value="Government">Government Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Method
                  </label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white">
                    
                    <option value="Both">SMS & Web Platform</option>
                    <option value="SMS">SMS Only</option>
                    <option value="Web">Web Platform Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Type your announcement message here..."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400" />
                
                <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>Keep it clear and concise for SMS delivery.</span>
                  <span
                    className={
                    message.length > 160 ? 'text-accent-dark font-medium' : ''
                    }>
                    
                    {message.length} / 160 chars (1 SMS)
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">
                Target Audience
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePurokToggle('All')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedPuroks.includes('All') ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                  
                  All Residents
                </button>
                {puroks.map((purok) =>
                <button
                  key={purok}
                  type="button"
                  onClick={() => handlePurokToggle(purok)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedPuroks.includes(purok) ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                  
                    {purok}
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Schedule Delivery
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isScheduled}
                    onChange={() => setIsScheduled(!isScheduled)} />
                  
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    Send later
                  </span>
                </label>
              </div>

              {isScheduled &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: 'auto'
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Date
                    </label>
                    <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required={isScheduled}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-white" />
                  
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Time
                    </label>
                    <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required={isScheduled}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-white" />
                  
                  </div>
                </motion.div>
              }
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-colors shadow-sm">
                
                {isScheduled ?
                <>
                    <Clock size={18} /> Schedule Announcement
                  </> :

                <>
                    <Send size={18} /> Send Now
                  </>
                }
              </button>
            </div>
          </form>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          className="space-y-6">
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Smartphone
                size={16}
                className="text-slate-400 dark:text-slate-500" />
              {' '}
              SMS Preview
            </h3>
            {deliveryMethod === 'Web' ?
            <div className="bg-slate-100 dark:bg-slate-700 rounded-[2rem] p-4 border-8 border-slate-800 dark:border-slate-600 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 dark:bg-slate-600 rounded-b-xl mx-12"></div>
                <div className="mt-6 min-h-[220px] flex items-center justify-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center px-4">
                    SMS delivery not selected. Switch to "SMS" or "Both" to
                    preview.
                  </p>
                </div>
              </div> :

            <div className="bg-slate-100 dark:bg-slate-700 rounded-[2rem] p-4 border-8 border-slate-800 dark:border-slate-600 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 dark:bg-slate-600 rounded-b-xl mx-12"></div>
                <div className="mt-6 space-y-3 min-h-[220px]">
                  <div className="bg-slate-200/50 dark:bg-slate-600/50 text-xs text-center py-1 rounded text-slate-500 dark:text-slate-400">
                    Today{' '}
                    {new Date().toLocaleTimeString('en-PH', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-800 dark:text-slate-200 break-words space-y-1.5">
                    {title ?
                  <strong className="block text-slate-900 dark:text-white">
                        [{category.toUpperCase()}] {title}
                      </strong> :

                  <span className="text-slate-400 dark:text-slate-500 italic text-xs">
                        Title will appear here...
                      </span>
                  }
                    {message ?
                  <p className="text-xs leading-relaxed">{message}</p> :

                  <span className="text-slate-400 dark:text-slate-500 italic text-xs">
                        Your message will appear here...
                      </span>
                  }
                    {(title || message) &&
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700">
                        — Brgy. Purisima |{' '}
                        {deliveryMethod === 'Both' ?
                    'SMS & Web' :
                    deliveryMethod}
                      </p>
                  }
                  </div>
                </div>
              </div>
            }

            {/* Delivery Details */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Recipients
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {selectedPuroks.includes('All') ?
                  `All Residents (${totalResidents.toLocaleString()})` :
                  `${selectedPuroks.join(', ')} (${selectedPuroks.length > 0 ? Math.ceil(totalResidents / puroks.length * selectedPuroks.length).toLocaleString() : '0'})`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Delivery
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                  {deliveryMethod === 'SMS' &&
                  <>
                      <Smartphone size={12} /> SMS Only
                    </>
                  }
                  {deliveryMethod === 'Web' &&
                  <>
                      <Globe size={12} /> Web Only
                    </>
                  }
                  {deliveryMethod === 'Both' &&
                  <>
                      <Smartphone size={12} />
                      <Globe size={12} /> SMS & Web
                    </>
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  SMS Parts
                </span>
                <span
                  className={`font-semibold ${message.length > 160 ? 'text-accent-dark' : 'text-slate-800 dark:text-slate-200'}`}>
                  
                  {message.length > 0 ? Math.ceil(message.length / 160) : 0} (
                  {message.length} chars)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Status
                </span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${isScheduled ? 'bg-accent/10 text-accent-dark' : 'bg-secondary/10 text-secondary'}`}>
                  
                  {isScheduled ? 'Scheduled' : 'Send Immediately'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Globe
                  size={16}
                  className="text-slate-400 dark:text-slate-500" />
                {' '}
                Web Preview
              </h3>
              {deliveryMethod === 'SMS' ?
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm min-h-[120px] flex items-center justify-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center px-4">
                    Web delivery not selected. Switch to "Web" or "Both" to
                    preview.
                  </p>
                </div> :

              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-primary/10 text-primary dark:text-primary-light text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {category}
                    </span>
                    <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isScheduled ? 'bg-accent/10 text-accent-dark' : 'bg-secondary/10 text-secondary'}`}>
                    
                      {isScheduled ? 'Pending' : 'Sent'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Just now
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1">
                    {title || 'Announcement Title'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-3">
                    {message || 'Message content preview...'}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
                    <span>
                      To:{' '}
                      {selectedPuroks.includes('All') ?
                    'All Residents' :
                    selectedPuroks.join(', ')}
                    </span>
                    <span>•</span>
                    <span>
                      Via:{' '}
                      {deliveryMethod === 'Both' ? 'SMS & Web' : deliveryMethod}
                    </span>
                  </div>
                </div>
              }
            </div>

            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-2 border border-transparent dark:border-blue-800/30">
              <Info
                size={16}
                className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
              
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Messages longer than 160 characters will be split into multiple
                SMS parts, which may consume more credits.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>);

}