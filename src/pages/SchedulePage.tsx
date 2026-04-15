import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Filter,
  MoreVertical,
  Search,
  X } from
'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { getAnnouncements, checkAndUpdateScheduled } from '../data/mockData';
import { Badge } from '../components/Badge';
import { motion } from 'framer-motion';
export function SchedulePage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  checkAndUpdateScheduled();
  const allScheduled = getAnnouncements().filter((a) => a.status === 'Pending');
  const scheduledAnnouncements = searchQuery ?
  allScheduled.filter(
    (a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.targetAudience.some((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) :
  allScheduled;
  return (
    <AdminLayout title="Scheduled Announcements">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg w-fit">
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                
                <List size={16} /> List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                
                <CalendarIcon size={16} /> Calendar
              </button>
            </div>
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18} />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheduled announcements..."
              className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white dark:placeholder-slate-400" />
            
            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              
                <X size={16} />
              </button>
            }
          </div>
        </div>
        {/* Content */}
        <div className="p-0">
          {view === 'list' ?
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Target</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {scheduledAnnouncements.map((item, index) =>
                <motion.tr
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                  key={item.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                  
                      <td className="p-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {new Date(item.date).toLocaleDateString('en-PH', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(item.date).toLocaleTimeString('en-PH', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                          {item.message}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge type="category" value={item.category} />
                      </td>
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                        {item.targetAudience.join(', ')}
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary-light rounded-md hover:bg-primary/10 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </motion.tr>
                )}
                  {scheduledAnnouncements.length === 0 &&
                <tr>
                      <td
                    colSpan={5}
                    className="p-8 text-center text-slate-500 dark:text-slate-400">
                    
                        {searchQuery ?
                    `No scheduled announcements matching "${searchQuery}"` :
                    'No scheduled announcements found.'}
                      </td>
                    </tr>
                }
                </tbody>
              </table>
            </div> :

          <div className="p-6 text-center text-slate-500 dark:text-slate-400 py-20">
              <CalendarIcon
              size={48}
              className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            
              <p className="font-medium text-slate-700 dark:text-slate-300">
                Calendar view is under construction
              </p>
              <p className="text-sm mt-1">Please use the list view for now.</p>
            </div>
          }
        </div>
      </div>
    </AdminLayout>);

}