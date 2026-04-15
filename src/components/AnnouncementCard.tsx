import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Radio,
  ArrowRight,
  X,
  Send } from
'lucide-react';
import { getRelativeTime } from '../data/mockData';
import { Badge } from './Badge';
import { motion, AnimatePresence } from 'framer-motion';

type AnnouncementLike = {
  id: string;
  title: string;
  message: string;
  category: string;
  date: string;
  status: string;
  targetAudience: string[];
  deliveryMethod: string;
  recipientsCount?: number;
  isEmergency?: boolean;
};
interface AnnouncementCardProps {
  announcement: AnnouncementLike;
  compact?: boolean;
  hideStatus?: boolean;
}
export function AnnouncementCard({
  announcement,
  compact = false,
  hideStatus = false
}: AnnouncementCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const date = getRelativeTime(announcement.date);
  const fullDate = new Date(announcement.date).toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  // Determine tag based on category
  let tag = 'Info';
  if (
  announcement.isEmergency ||
  announcement.category === 'Emergency' ||
  announcement.category === 'Disaster')
  {
    tag = 'Urgent';
  } else if (announcement.category === 'Event') {
    tag = 'Event';
  }
  const deliveryLabel =
  announcement.deliveryMethod === 'Both' ?
  'SMS & Web Platform' :
  announcement.deliveryMethod === 'SMS' ?
  'SMS Only' :
  'Web Platform Only';
  return (
    <>
      <motion.div
        whileHover={{
          y: -4
        }}
        transition={{
          type: 'spring',
          stiffness: 300
        }}
        className={`bg-white dark:bg-slate-800 rounded-xl border ${announcement.isEmergency ? 'border-l-4 border-l-emergency border-emergency/20 dark:border-emergency/30 shadow-md hover:shadow-lg' : 'border-slate-100 dark:border-slate-700 shadow-soft hover:shadow-md'} overflow-hidden transition-all flex flex-col`}>
        
        {announcement.isEmergency &&
        <div className="bg-emergency/10 dark:bg-emergency/20 text-emergency text-xs font-bold px-4 py-2.5 sm:py-2 flex items-center uppercase tracking-wider border-b border-emergency/20 dark:border-emergency/30">
            <Radio size={14} className="mr-2 animate-pulse shrink-0" />
            Emergency Broadcast
          </div>
        }
        <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-3 gap-3">
            <div className="flex flex-col gap-2.5">
              {!compact &&
              <div className="flex flex-wrap gap-2">
                  <Badge type="tag" value={tag} />
                  <Badge type="category" value={announcement.category} />
                </div>
              }
              <h3
                className={`font-semibold ${announcement.isEmergency ? 'text-emergency text-lg sm:text-xl' : 'text-slate-900 dark:text-white text-base sm:text-lg'} leading-tight`}>
                
                {announcement.title}
              </h3>
            </div>
            {!compact && !hideStatus &&
            <Badge
              type="status"
              value={announcement.status}
              className="shrink-0" />

            }
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-5 line-clamp-4 leading-relaxed">
            {announcement.message}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-100/60 dark:border-slate-700/60">
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
              <div className="flex items-center">
                <Calendar
                  size={14}
                  className="mr-1.5 text-slate-400 dark:text-slate-500 shrink-0" />
                
                {date}
              </div>
              {!compact &&
              <div className="flex items-center">
                  <Users
                  size={14}
                  className="mr-1.5 text-slate-400 dark:text-slate-500 shrink-0" />
                
                  <span>{announcement.targetAudience.join(', ')}</span>
                </div>
              }
            </div>

            <button
              onClick={() => setShowDetails(true)}
              className="w-full min-h-[44px] py-3 px-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium rounded-xl transition-colors flex items-center justify-center group">
              
              View Details
              <ArrowRight
                size={16}
                className="ml-2 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
              
            </button>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetails &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setShowDetails(false)}>
          
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}>
            
              {/* Modal Header */}
              {announcement.isEmergency &&
            <div className="bg-emergency text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <Radio size={16} className="animate-pulse shrink-0" />
                    Emergency Broadcast
                  </div>
                </div>
            }

              <div className="p-4 sm:p-6">
                {/* Close Button */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge type="tag" value={tag} />
                    <Badge type="category" value={announcement.category} />
                    {!hideStatus &&
                  <Badge type="status" value={announcement.status} />
                  }
                  </div>
                  <button
                  onClick={() => setShowDetails(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 -mt-2 -mr-2 sm:mt-0 sm:mr-0">
                  
                    <X size={20} />
                  </button>
                </div>

                {/* Title */}
                <h2
                className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-5 leading-tight ${announcement.isEmergency ? 'text-emergency' : 'text-slate-900 dark:text-white'}`}>
                
                  {announcement.title}
                </h2>

                {/* Full Message */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 sm:p-5 mb-6 border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {announcement.message}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
                    <Calendar
                    size={18}
                    className="text-primary dark:text-primary-light mt-0.5 shrink-0" />
                  
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Date & Time
                      </p>
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                        {fullDate}
                      </p>
                    </div>
                  </div>

                  {!hideStatus &&
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
                      <Users
                    size={18}
                    className="text-secondary mt-0.5 shrink-0" />
                  
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Target Audience
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                          {announcement.targetAudience.join(', ')}
                        </p>
                      </div>
                    </div>
                }

                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
                    <deliveryIcon
                    size={18}
                    className="text-accent-dark mt-0.5 shrink-0" />
                  
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Delivery Method
                      </p>
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                        {deliveryLabel}
                      </p>
                    </div>
                  </div>

                  {!hideStatus && announcement.recipientsCount &&
                <div className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
                      <Send
                    size={18}
                    className="text-secondary mt-0.5 shrink-0" />
                  
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Recipients
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                          {announcement.recipientsCount.toLocaleString()}{' '}
                          residents
                        </p>
                      </div>
                    </div>
                }
                </div>

                {/* Close Button */}
                <button
                onClick={() => setShowDetails(false)}
                className="w-full mt-6 min-h-[44px] py-3 px-4 bg-primary hover:bg-primary-light text-white text-sm sm:text-base font-semibold rounded-xl transition-colors shadow-sm">
                
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}