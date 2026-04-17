import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Megaphone,
  Search,
  BellRing,
  Bell,
  Sun,
  Moon,
  X,
  Calendar,
  Smartphone,
  Globe,
  MessageSquare,
  Radio,
  Menu,
  LayoutGrid,
  AlertTriangle,
  Heart,
  CloudRain,
  CalendarDays,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Edit,
  User,
  Info,
  Settings } from
'lucide-react';
import type { ApiAnnouncement } from '../lib/announcements';
import { toUiAnnouncement, type UiAnnouncement } from '../lib/announcements';
import { apiFetch } from '../lib/api';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { BantAIChat } from '../components/BantAIChat';
import { Badge } from '../components/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { toast } from 'sonner';
import { getAuthUser, clearAuthSession, updateAuthUser } from '../lib/auth';
import { ConfirmDialog } from '../components/ConfirmDialog';
// Helper to get icon and color for a notification based on type/category
function getNotificationStyle(type: string, category: string) {
  if (type === 'emergency') {
    return {
      icon: AlertTriangle,
      color: 'text-emergency bg-emergency/10'
    };
  }
  switch (category) {
    case 'Emergency':
      return {
        icon: AlertTriangle,
        color: 'text-emergency bg-emergency/10'
      };
    case 'Health':
      return {
        icon: Heart,
        color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30'
      };
    case 'Disaster':
      return {
        icon: CloudRain,
        color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/30'
      };
    case 'Event':
      return {
        icon: CalendarDays,
        color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30'
      };
    case 'Government':
      return {
        icon: Building2,
        color: 'text-primary bg-primary/10 dark:bg-primary/20'
      };
    case 'General':
      return {
        icon: FileText,
        color: 'text-secondary bg-secondary/10'
      };
    case 'System':
      return {
        icon: Settings,
        color: 'text-slate-500 bg-slate-100 dark:bg-slate-700/50'
      };
    default:
      return {
        icon: Info,
        color: 'text-secondary bg-secondary/10'
      };
  }
}
export function PublicAnnouncementsPage() {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const {
    markAsRead,
    markAllAsRead,
    getRelativeTimeForNotif,
    getNotificationsForPurok,
    getUnreadCountForPurok
  } = useNotifications();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [publicAnnouncements, setPublicAnnouncements] = useState<UiAnnouncement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] =
  useState<UiAnnouncement | null>(null);
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Profile state
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    avatarUrl: '',
    fullName: '',
    contactNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      notifRef.current &&
      !notifRef.current.contains(event.target as Node))
      {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    // Load current user (if logged in)
    const user = getAuthUser();
    setCurrentUser(user);
    if (user) {
      setEditFormData({
        avatarUrl: (user as any).avatarUrl || '',
        fullName: user.name || '',
        contactNumber: user.contactNumber || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch<{ items: ApiAnnouncement[] }>(
          '/announcements/public?page=1&pageSize=100'
        );
        setPublicAnnouncements(data.items.map(toUiAnnouncement));
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        toast.error('Failed to load announcements');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 15000);
    return () => clearInterval(interval);
  }, []);
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (
    editFormData.password &&
    editFormData.password !== editFormData.confirmPassword)
    {
      toast.error('Passwords do not match');
      return;
    }
    (async () => {
      try {
        const updated = await apiFetch<any>('/auth/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            avatarUrl: editFormData.avatarUrl || null,
            name: editFormData.fullName,
            contactNumber: editFormData.contactNumber,
            purok: currentUser?.purok || undefined,
          }),
        });
        setCurrentUser(updated);
        updateAuthUser({
          avatarUrl: updated?.avatarUrl ?? null,
          name: updated?.name ?? editFormData.fullName,
          contactNumber: updated?.contactNumber ?? editFormData.contactNumber,
          purok: updated?.purok ?? currentUser?.purok ?? null,
        });
        toast.success('Profile updated successfully');
        setEditProfileModalOpen(false);
        setEditFormData((prev) => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      } catch (err: any) {
        toast.error(err?.message || 'Failed to update profile');
      }
    })();
  };
  const handleLogout = () => setLogoutConfirmOpen(true);
  // Get the user's purok for filtering
  const userPurok = currentUser?.purok || '';
  // Filter notifications by user's purok
  const notifications = getNotificationsForPurok(userPurok);
  const unreadCount = getUnreadCountForPurok(userPurok);
  // Filter announcements: only show those targeted to the user's purok or "All"
  const visibleAnnouncements = publicAnnouncements
    .filter((a) => a.status === 'Sent')
    .filter((a) => {
      if (!userPurok) return true;
      return a.targetAudience.some(
        (t) =>
          t === 'All' ||
          t === 'All Residents' ||
          t.toLowerCase() === userPurok.toLowerCase()
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const filtered = visibleAnnouncements.filter((a) => {
    const matchesCategory =
    activeCategory === 'All' || a.category === activeCategory;
    const matchesSearch =
    searchQuery === '' ||
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const categories = [
  {
    name: 'All',
    icon: LayoutGrid
  },
  {
    name: 'Emergency',
    icon: AlertTriangle
  },
  {
    name: 'Health',
    icon: Heart
  },
  {
    name: 'Disaster',
    icon: CloudRain
  },
  {
    name: 'Event',
    icon: CalendarDays
  },
  {
    name: 'Government',
    icon: Building2
  },
  {
    name: 'General',
    icon: FileText
  }];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors duration-300 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen &&
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        onClick={() => setSidebarOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-primary dark:bg-slate-950 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none border-r border-transparent dark:border-slate-800
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
        `}>
        
        {/* Sidebar Header */}
        <div
          className={`flex items-center p-4 border-b border-white/10 dark:border-slate-800 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          
          <div
            className={`flex items-center gap-3 ${sidebarCollapsed ? 'hidden' : 'flex'}`}>
            
            <div className="bg-accent p-2 rounded-lg shrink-0">
              <Megaphone size={20} className="text-primary-dark" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-sm leading-tight whitespace-nowrap text-accent">
                Barangay Purisima
              </h1>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider whitespace-nowrap">
                Resident Portal
              </p>
            </div>
          </div>

          {sidebarCollapsed &&
          <div className="bg-accent p-2 rounded-lg shrink-0">
              <Megaphone size={20} className="text-primary-dark" />
            </div>
          }

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
            
            {sidebarCollapsed ?
            <ChevronRight size={18} /> :

            <ChevronLeft size={18} />
            }
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors">
            
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Categories */}
        <div className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar space-y-1">
          {!sidebarCollapsed &&
          <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Categories
            </p>
          }

          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group
                  ${isActive ? 'bg-white/15 text-white font-semibold shadow-inner' : 'text-slate-300 hover:bg-white/5 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
                `}
                title={sidebarCollapsed ? cat.name : undefined}>
                
                {isActive && !sidebarCollapsed &&
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />
                }
                <cat.icon
                  size={20}
                  className={`shrink-0 transition-colors ${isActive ? cat.name === 'Emergency' ? 'text-emergency-light' : 'text-accent' : 'text-slate-400 group-hover:text-slate-300'}`} />
                
                {!sidebarCollapsed &&
                <span className="tracking-wide whitespace-nowrap">
                    {cat.name}
                  </span>
                }
              </button>);

          })}
        </div>

        {/* Sidebar Footer (Profile) */}
        <div className="p-3 border-t border-white/10 dark:border-slate-800 bg-black/10 dark:bg-slate-900/50 space-y-2">
          <div
            className={`bg-white/5 rounded-xl p-3 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            
            {sidebarCollapsed ?
            <button
              onClick={() => setEditProfileModalOpen(true)}
              className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 ring-accent transition-all"
              title="Edit Profile">
              
                <img
                src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(currentUser?.username || 'user')}`}
                alt="Avatar"
                className="w-full h-full" />
              
              </button> :

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img
                    src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(currentUser?.username || 'user')}`}
                    alt="Avatar"
                    className="w-full h-full" />
                  
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">
                      {currentUser?.name || 'Resident User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {currentUser?.purok ? `${currentUser.purok} • ` : ''}
                      {currentUser?.contactNumber || 'No contact'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                  onClick={() => setEditProfileModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors">
                  
                    <Edit size={12} /> Edit
                  </button>
                  <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-emergency/20 hover:bg-emergency/30 text-emergency-light rounded-lg text-xs font-medium transition-colors">
                  
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              </div>
            }
          </div>

          {sidebarCollapsed &&
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 rounded-xl text-emergency-light hover:bg-emergency/20 transition-all duration-200 mt-2"
            title="Logout">
            
              <LogOut size={20} />
            </button>
          }
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        
        {/* Navbar - visible on all screen sizes */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 sticky top-0 z-30 shadow-sm transition-colors duration-300">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Hamburger (mobile) + Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 dark:text-slate-300">
                
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="bg-accent p-1.5 rounded-lg">
                  <Megaphone
                    size={20}
                    className="text-primary-dark" />
                  
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-accent text-base leading-tight tracking-tight">
                    Barangay Purisima
                  </h1>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
                    Resident Portal
                  </p>
                </div>
                <h1 className="sm:hidden font-bold text-accent text-base leading-tight">
                  Barangay Purisima
                </h1>
              </div>
            </div>

            {/* Right: Notifications */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${notificationsOpen ? 'bg-primary/10 text-primary dark:bg-primary-light/20 dark:text-primary-light' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200'}`}
                  aria-label="Notifications">
                  
                  <Bell size={20} />
                  {unreadCount > 0 &&
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-emergency text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
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
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                    
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                          Notifications
                        </h3>
                        <span className="text-xs font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ?
                      <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-sm">
                            No notifications yet
                          </div> :

                      notifications.map((notif) => {
                        const style = getNotificationStyle(
                          notif.type,
                          notif.category
                        );
                        const NotifIcon = style.icon;
                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              if (!notif.read) markAsRead(notif.id);
                            }}
                            className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex gap-3 group ${!notif.read ? 'bg-primary/[0.02] dark:bg-primary/[0.05]' : ''}`}>
                            
                                <div
                              className={`p-2 rounded-full shrink-0 h-fit ${style.color}`}>
                              
                                  <NotifIcon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-snug">
                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    {getRelativeTimeForNotif(notif.date)}
                                  </p>
                                </div>
                                {!notif.read &&
                            <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2"></span>
                            }
                              </div>);

                      })
                      }
                      </div>
                      {notifications.length > 0 &&
                    <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                          <button
                        onClick={() => markAllAsRead()}
                        className="text-sm font-semibold text-primary dark:text-primary-light hover:underline transition-colors">
                        
                            Mark all as read
                          </button>
                        </div>
                    }
                    </motion.div>
                  }
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => toggleTheme()}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          {/* Page Title (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 mb-8 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="bg-accent p-3.5 rounded-xl">
              <Megaphone
                size={32}
                className="text-primary-dark" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Announcements Feed
              </h1>
              <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 mt-1">
                Stay updated with the latest news from Barangay Purisima
              </p>
            </div>
          </div>

          {/* Emergency Banner (if any active) */}
          {publicAnnouncements.some((a) => a.isEmergency) &&
          <motion.div
            initial={{
              opacity: 0,
              y: -20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="bg-emergency text-white rounded-2xl p-5 sm:p-6 lg:p-8 mb-8 shadow-lg shadow-emergency/20 border border-emergency-light relative overflow-hidden">
            
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative z-10">
                <div className="bg-white/20 p-3 sm:p-4 rounded-full shrink-0 animate-pulse w-fit">
                  <BellRing size={24} className="sm:w-8 sm:h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1.5 uppercase tracking-wide">
                    Active Emergency Alert
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 sm:mb-0 line-clamp-2 sm:line-clamp-none">
                    {publicAnnouncements.find((a) => a.isEmergency)?.title}
                  </p>
                </div>
                <button
                onClick={() =>
                setSelectedAnnouncement(
                  publicAnnouncements.find((a) => a.isEmergency) || null
                )
                }
                className="w-full sm:w-auto text-sm font-bold bg-white text-emergency px-6 py-3 min-h-[44px] rounded-xl hover:bg-slate-50 transition-colors shrink-0 shadow-sm flex items-center justify-center">
                
                  READ FULL DETAILS
                </button>
              </div>
            </motion.div>
          }

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 shrink-0"
                size={20} />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search announcements..."
                className="w-full pl-12 pr-12 py-3 sm:py-4 min-h-[44px] sm:min-h-[52px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base transition-all dark:text-white dark:placeholder-slate-400" />
              
              {searchQuery &&
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
                
                  <X size={18} />
                </button>
              }
            </div>
          </div>

          {/* Feed Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {activeCategory === 'All' ?
              'All Announcements' :
              `${activeCategory} Announcements`}
              <Badge
                type="tag"
                value={filtered.length.toString()}
                className="ml-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" />
              
            </h2>
          </div>

          {/* Feed */}
          {isLoading ?
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {[1, 2, 3].map((i) =>
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 sm:p-5 lg:p-6 animate-pulse">
              
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
                  <div className="space-y-2 mb-5">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-4">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
            )}
            </div> :

          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              {filtered.map((announcement, index) =>
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: index * 0.05
              }}
              key={announcement.id}>
              
                  <AnnouncementCard announcement={announcement} hideStatus />
                </motion.div>
            )}

              {filtered.length === 0 &&
            <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              className="text-center py-12 sm:py-16 lg:py-20 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
                    <Search
                  size={32}
                  className="text-slate-300 dark:text-slate-500 sm:w-10 sm:h-10" />
                
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {searchQuery ?
                `No results for "${searchQuery}"` :
                'No announcements found'}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    {searchQuery ?
                'Try adjusting your search terms or selecting a different category.' :
                'Try selecting a different category from the sidebar.'}
                  </p>
                  {searchQuery &&
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors">
                
                      Clear Search
                    </button>
              }
                </motion.div>
            }
            </div>
          }
        </main>
      </div>

      {/* BantAI Chat Bubble */}
      <BantAIChat user={currentUser} />

      {/* Announcement Detail Modal */}
      <AnimatePresence>
        {selectedAnnouncement &&
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
          onClick={() => setSelectedAnnouncement(null)}>
          
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
              {selectedAnnouncement.isEmergency &&
            <div className="bg-emergency text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center rounded-t-2xl">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <Radio size={16} className="animate-pulse shrink-0" />
                    Emergency Broadcast
                  </div>
                </div>
            }

              <div className="p-4 sm:p-6">
                {/* Close & Badges */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                    type="tag"
                    value={
                    selectedAnnouncement.isEmergency ||
                    selectedAnnouncement.category === 'Emergency' ||
                    selectedAnnouncement.category === 'Disaster' ?
                    'Urgent' :
                    selectedAnnouncement.category === 'Event' ?
                    'Event' :
                    'Info'
                    } />
                  
                    <Badge
                    type="category"
                    value={selectedAnnouncement.category} />
                  
                  </div>
                  <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0 -mt-2 -mr-2 sm:mt-0 sm:mr-0">
                  
                    <X size={20} />
                  </button>
                </div>

                {/* Title */}
                <h2
                className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-5 leading-tight ${selectedAnnouncement.isEmergency ? 'text-emergency' : 'text-slate-900 dark:text-white'}`}>
                
                  {selectedAnnouncement.title}
                </h2>

                {/* Full Message */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 sm:p-5 mb-6 border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {selectedAnnouncement.message}
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
                        {new Date(selectedAnnouncement.date).toLocaleDateString(
                        'en-PH',
                        {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
                    {selectedAnnouncement.deliveryMethod === 'SMS' ?
                  <Smartphone
                    size={18}
                    className="text-accent-dark mt-0.5 shrink-0" /> :

                  selectedAnnouncement.deliveryMethod === 'Web' ?
                  <Globe
                    size={18}
                    className="text-accent-dark mt-0.5 shrink-0" /> :


                  <MessageSquare
                    size={18}
                    className="text-accent-dark mt-0.5 shrink-0" />

                  }
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Delivery Method
                      </p>
                      <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
                        {selectedAnnouncement.deliveryMethod === 'Both' ?
                      'SMS & Web Platform' :
                      selectedAnnouncement.deliveryMethod === 'SMS' ?
                      'SMS Only' :
                      'Web Platform Only'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-full mt-6 min-h-[44px] py-3 px-4 bg-primary hover:bg-primary-light text-white text-sm sm:text-base font-semibold rounded-xl transition-colors shadow-sm">
                
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editProfileModalOpen &&
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
          onClick={() => setEditProfileModalOpen(false)}>
          
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
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                  <User
                  size={20}
                  className="text-primary dark:text-primary-light shrink-0" />
                
                  Edit Profile
                </h3>
                <button
                onClick={() => setEditProfileModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors -mr-2">
                
                  <X size={20} />
                </button>
              </div>

              <form
              onSubmit={handleSaveProfile}
              className="p-5 sm:p-6 space-y-4 sm:space-y-5">

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 shrink-0">
                    <img
                      src={
                        editFormData.avatarUrl ||
                        currentUser?.avatarUrl ||
                        `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(currentUser?.username || 'user')}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error('Please choose an image under 2MB.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          const url = String(reader.result || '');
                          setEditFormData((prev) => ({ ...prev, avatarUrl: url }));
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="block w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary dark:file:bg-primary/20 dark:file:text-primary-light hover:file:bg-primary/15 dark:hover:file:bg-primary/25 file:cursor-pointer cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      PNG/JPG recommended. Max 2MB.
                    </p>
                  </div>
                </div>
              
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    fullName: e.target.value
                  })
                  }
                  className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white text-sm sm:text-base" />
                
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Contact Number
                  </label>
                  <input
                  type="tel"
                  required
                  maxLength={11}
                  value={editFormData.contactNumber}
                  onChange={(e) => {
                    const val = e.target.value.
                    replace(/[^\d]/g, '').
                    slice(0, 11);
                    setEditFormData({
                      ...editFormData,
                      contactNumber: val
                    });
                  }}
                  className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white text-sm sm:text-base" />
                
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {editFormData.contactNumber.length}/11 digits
                  </p>
                </div>

                <div className="pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 sm:mb-4">
                    Change Password (Optional)
                  </p>

                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        New Password
                      </label>
                      <input
                      type="password"
                      value={editFormData.password}
                      onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        password: e.target.value
                      })
                      }
                      placeholder="Leave blank to keep current"
                      className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 text-sm sm:text-base" />
                    
                    </div>

                    {editFormData.password &&
                  <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                      type="password"
                      required={!!editFormData.password}
                      value={editFormData.confirmPassword}
                      onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        confirmPassword: e.target.value
                      })
                      }
                      className="w-full px-4 py-3 min-h-[44px] border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white dark:bg-slate-700 dark:text-white text-sm sm:text-base" />
                    
                      </div>
                  }
                  </div>
                </div>

                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                  type="button"
                  onClick={() => setEditProfileModalOpen(false)}
                  className="w-full sm:flex-1 min-h-[44px] py-3 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm sm:text-base font-semibold rounded-xl transition-colors">
                  
                    Cancel
                  </button>
                  <button
                  type="submit"
                  className="w-full sm:flex-1 min-h-[44px] py-3 px-4 bg-primary hover:bg-primary-light text-white text-sm sm:text-base font-semibold rounded-xl transition-colors shadow-sm">
                  
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Log out?"
        description="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        danger
        onCancel={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          setLogoutConfirmOpen(false);
          clearAuthSession();
          toast.success('Logged out successfully');
          navigate('/login');
        }}
      />
    </div>);

}