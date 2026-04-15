import React, { useEffect, useState, useRef } from 'react';
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  User,
  CheckCircle2,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Megaphone,
  Check } from
'lucide-react';
import { Sidebar } from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}
export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getRelativeTimeForNotif
  } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      notifRef.current &&
      !notifRef.current.contains(event.target as Node))
      {
        setNotificationsOpen(false);
      }
      if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node))
      {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return AlertTriangle;
      case 'announcement':
        return Megaphone;
      case 'system':
        return Info;
      default:
        return CheckCircle2;
    }
  };
  const getNotifColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'text-emergency bg-emergency/10';
      case 'announcement':
        return 'text-primary bg-primary/10 dark:text-primary-light dark:bg-primary/20';
      case 'system':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/30';
      default:
        return 'text-secondary bg-secondary/10';
    }
  };
  return (
    <div className="min-h-screen bg-surface-muted dark:bg-slate-900 flex font-sans transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-30 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block tracking-tight">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200 transition-all duration-200"
                aria-label="Toggle theme">
                
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  className={`relative p-2 rounded-full transition-all duration-200 ${notificationsOpen ? 'bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200'}`}>
                  
                  <Bell size={20} />
                  {unreadCount > 0 &&
                  <span className="absolute top-1 right-1 w-5 h-5 bg-emergency text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                      {unreadCount}
                    </span>
                  }
                </button>

                <AnimatePresence>
                  {notificationsOpen &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95
                    }}
                    transition={{
                      duration: 0.15,
                      ease: 'easeOut'
                    }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                    
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-slate-800 dark:text-white">
                          Notifications
                        </h3>
                        {unreadCount > 0 &&
                      <button
                        onClick={markAllAsRead}
                        className="text-xs font-medium text-primary hover:text-primary-light dark:text-primary-light dark:hover:text-primary transition-colors flex items-center gap-1">
                        
                            <Check size={12} /> Mark all as read
                          </button>
                      }
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ?
                      <div className="p-8 text-center">
                            <Bell
                          size={32}
                          className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              No notifications yet
                            </p>
                          </div> :

                      notifications.slice(0, 10).map((notif) => {
                        const NotifIcon = getNotifIcon(notif.type);
                        return (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex gap-3 group ${!notif.read ? 'bg-primary/[0.03] dark:bg-primary/[0.05]' : ''}`}>
                            
                                <div
                              className={`p-2 rounded-full shrink-0 h-fit ${getNotifColor(notif.type)}`}>
                              
                                  <NotifIcon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold leading-snug">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    {getRelativeTimeForNotif(notif.date)}
                                  </p>
                                </div>
                                {!notif.read &&
                            <span className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-1.5"></span>
                            }
                              </div>);

                      })
                      }
                      </div>
                      {notifications.length > 0 &&
                    <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Showing {Math.min(10, notifications.length)} of{' '}
                            {notifications.length} notifications
                          </p>
                        </div>
                    }
                    </motion.div>
                  }
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                  className={`h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-bold text-sm shadow-md hover:shadow-lg transition-all border-2 ${profileOpen ? 'border-primary/30 ring-2 ring-primary/10' : 'border-white dark:border-slate-700'}`}>
                  
                  A
                </button>

                <AnimatePresence>
                  {profileOpen &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95
                    }}
                    transition={{
                      duration: 0.15,
                      ease: 'easeOut'
                    }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                    
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                        <p className="font-bold text-slate-800 dark:text-white">
                          Admin User
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          admin@purisima.gov.ph
                        </p>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-colors">
                          <User size={16} />
                          My Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-light hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-colors">
                          <Settings size={16} />
                          Account Settings
                        </button>
                      </div>
                      <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                        <button
                        onClick={() => navigate('/login')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-emergency hover:bg-emergency/10 rounded-xl transition-colors">
                        
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 sm:hidden tracking-tight">
              {title}
            </h2>
            {children}
          </div>
        </main>
      </div>
    </div>);

}