import React, { useEffect, useState, Children } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  CalendarDays,
  Users,
  AlertTriangle,
  ArrowRight,
  Plus,
  Wifi,
  MessageSquare,
  CreditCard,
  Clock,
  History,
  Search,
  X } from
'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { StatCard } from '../components/StatCard';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { getAnnouncements, checkAndUpdateScheduled } from '../data/mockData';
import { motion } from 'framer-motion';
export function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  checkAndUpdateScheduled();
  const announcements = getAnnouncements();
  const registeredUsers = JSON.parse(
    localStorage.getItem('padinig_users') || '[]'
  );
  const smsResidents = JSON.parse(
    localStorage.getItem('padinig_residents') || '[]'
  );
  const totalResidents = smsResidents.length + registeredUsers.length;
  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const filteredAnnouncements = searchQuery ?
  sortedAnnouncements.filter(
    (a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.targetAudience.some((t) =>
    t.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) :
  sortedAnnouncements.slice(0, 4);
  const scheduledCount = announcements.filter(
    (a) => a.status === 'Pending'
  ).length;
  const emergencyCount = announcements.filter((a) => a.isEmergency).length;
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  const currentDate = new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  if (isLoading) {
    return (
      <AdminLayout title="Dashboard Overview">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </AdminLayout>);

  }
  return (
    <AdminLayout title="Dashboard Overview">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8">
        
        {/* Welcome Banner */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Welcome back, Admin!
              </h1>
              <p className="text-primary-light text-slate-200 font-medium flex items-center gap-2">
                <Clock size={16} />
                {currentDate}
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="bg-white dark:bg-slate-700 text-primary dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2 w-fit group">
              
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform duration-300" />
              
              Quick Announcement
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <motion.div variants={itemVariants} className="h-full">
            <StatCard
              title="Total Announcements"
              value={announcements.length}
              icon={Megaphone}
              colorClass="text-primary bg-primary/10"
              borderColorClass="border-t-primary"
              trend={{
                value: '12%',
                isPositive: true
              }} />
            
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <StatCard
              title="Scheduled"
              value={scheduledCount}
              icon={CalendarDays}
              colorClass="text-accent bg-accent/10"
              borderColorClass="border-t-accent" />
            
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <StatCard
              title="Registered Residents"
              value={totalResidents}
              icon={Users}
              colorClass="text-secondary bg-secondary/10"
              borderColorClass="border-t-secondary" />
            
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <StatCard
              title="Emergency Alerts"
              value={emergencyCount}
              icon={AlertTriangle}
              colorClass="text-emergency bg-emergency/10"
              borderColorClass="border-t-emergency" />
            
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div variants={itemVariants}>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20} />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements by title, message, category..."
              className="w-full pl-12 pr-12 py-3 sm:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base transition-all dark:text-white dark:placeholder-slate-400" />
            
            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
              
                <X size={18} />
              </button>
            }
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Announcements */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-5">
            
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                <History
                  size={20}
                  className="text-primary dark:text-primary-light" />
                
                {searchQuery ? `Search Results` : 'Recent Announcements'}
                {searchQuery &&
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
                    ({filteredAnnouncements.length} found)
                  </span>
                }
              </h3>
              <button
                onClick={() => navigate('/history')}
                className="text-sm font-bold text-primary dark:text-primary-light hover:text-primary-light flex items-center group transition-colors bg-primary/5 dark:bg-primary/10 px-3 py-1.5 rounded-lg">
                
                View all{' '}
                <ArrowRight
                  size={16}
                  className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                
              </button>
            </div>

            {filteredAnnouncements.length > 0 ?
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredAnnouncements.map((announcement) =>
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                compact />

              )}
              </div> :

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search
                  size={28}
                  className="text-slate-300 dark:text-slate-500" />
                
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                  No results for "{searchQuery}"
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search terms or browse all announcements in
                  History.
                </p>
                <button
                onClick={() => setSearchQuery('')}
                className="mt-5 px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors">
                
                  Clear Search
                </button>
              </div>
            }
          </motion.div>

          {/* Right Column: Quick Actions & System Status */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                  Quick Actions
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    x: 4
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  onClick={() => navigate('/create')}
                  className="w-full flex items-center p-4 rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 hover:bg-primary hover:border-primary transition-all group shadow-sm">
                  
                  <div className="bg-white dark:bg-slate-700 p-3 rounded-xl text-primary dark:text-primary-light shadow-sm group-hover:scale-110 transition-transform">
                    <Plus size={22} strokeWidth={2.5} />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="font-bold text-primary dark:text-white group-hover:text-white transition-colors text-base">
                      New Announcement
                    </p>
                    <p className="text-xs font-medium text-primary/70 dark:text-white/70 group-hover:text-white/80 transition-colors mt-0.5">
                      Create and send a message
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    x: 4
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  onClick={() => navigate('/emergency')}
                  className="w-full flex items-center p-4 rounded-xl border border-emergency/30 bg-emergency/10 dark:bg-emergency/15 hover:bg-emergency hover:border-emergency transition-all group shadow-sm relative overflow-hidden">
                  
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="bg-white dark:bg-slate-700 p-3 rounded-xl text-emergency shadow-sm group-hover:scale-110 transition-transform relative z-10">
                    <AlertTriangle
                      size={22}
                      strokeWidth={2.5}
                      className="animate-pulse" />
                    
                  </div>
                  <div className="ml-4 text-left relative z-10">
                    <p className="font-bold text-emergency group-hover:text-white transition-colors text-base">
                      Emergency Broadcast
                    </p>
                    <p className="text-xs font-medium text-emergency/80 group-hover:text-white/80 transition-colors mt-0.5">
                      Send urgent alerts immediately
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    x: 4
                  }}
                  whileTap={{
                    scale: 0.98
                  }}
                  onClick={() => navigate('/residents')}
                  className="w-full flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 hover:border-secondary hover:bg-secondary/5 dark:hover:bg-secondary/10 transition-all group shadow-sm">
                  
                  <div className="bg-slate-100 dark:bg-slate-600 p-3 rounded-xl text-slate-600 dark:text-slate-300 group-hover:bg-secondary/20 group-hover:text-secondary transition-colors group-hover:scale-110">
                    <Users size={22} strokeWidth={2.5} />
                  </div>
                  <div className="ml-4 text-left">
                    <p className="font-bold text-slate-800 dark:text-white group-hover:text-secondary transition-colors text-base">
                      Manage Residents
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-secondary/70 transition-colors mt-0.5">
                      View and update resident list
                    </p>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-300">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Wifi size={16} className="text-secondary" />
                  System Status
                </h4>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-primary dark:text-primary-light">
                      <MessageSquare size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      SMS Gateway
                    </span>
                  </div>
                  <span className="flex items-center text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 shadow-inner">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                    Online
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-primary dark:text-primary-light">
                      <Wifi size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Web Platform
                    </span>
                  </div>
                  <span className="flex items-center text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 shadow-inner">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                    </span>
                    Online
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 hover:border-slate-200 dark:hover:border-slate-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-accent">
                      <CreditCard size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      SMS Credits
                    </span>
                  </div>
                  <span className="text-base font-black text-slate-800 dark:text-white tracking-tight bg-white dark:bg-slate-600 px-3 py-1 rounded-lg shadow-sm border border-slate-200 dark:border-slate-500">
                    12,450
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>);

}