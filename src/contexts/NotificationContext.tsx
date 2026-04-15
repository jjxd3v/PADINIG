import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext } from
'react';
import { getRelativeTime } from '../data/mockData';
export interface Notification {
  id: string;
  type: 'announcement' | 'emergency' | 'system';
  title: string;
  message: string;
  category: string;
  date: string;
  read: boolean;
  targetAudience?: string[];
}
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, 'id' | 'read' | 'date'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getRelativeTimeForNotif: (date: string) => string;
  getNotificationsForPurok: (purok: string) => Notification[];
  getUnreadCountForPurok: (purok: string) => number;
}
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
const STORAGE_KEY = 'padinig_notifications';
// Helper to check if a notification is visible to a given purok
function isNotificationForPurok(notif: Notification, purok: string): boolean {
  // System notifications are visible to everyone
  if (notif.type === 'system') return true;
  // If no targetAudience set, visible to everyone (backward compat)
  if (!notif.targetAudience || notif.targetAudience.length === 0) return true;
  // Check if targeted to all or the specific purok
  return notif.targetAudience.some(
    (t) =>
    t === 'All' ||
    t === 'All Residents' ||
    t.toLowerCase() === purok.toLowerCase()
  );
}
export function NotificationProvider({
  children


}: {children: React.ReactNode;}) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);
  // Listen for storage changes from other tabs/components
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setNotifications(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  // Global unread count (for admin — sees everything)
  const unreadCount = notifications.filter((n) => !n.read).length;
  const addNotification = useCallback(
    (notif: Omit<Notification, 'id' | 'read' | 'date'>) => {
      const newNotif: Notification = {
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        date: new Date().toISOString(),
        read: false
      };
      setNotifications((prev) => {
        const updated = [newNotif, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
      n.id === id ?
      {
        ...n,
        read: true
      } :
      n
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({
        ...n,
        read: true
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);
  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }, []);
  const getRelativeTimeForNotif = useCallback((date: string) => {
    return getRelativeTime(date);
  }, []);
  // Get notifications filtered for a specific purok (for residents)
  const getNotificationsForPurok = useCallback(
    (purok: string) => {
      if (!purok) return notifications;
      return notifications.filter((n) => isNotificationForPurok(n, purok));
    },
    [notifications]
  );
  // Get unread count for a specific purok (for residents)
  const getUnreadCountForPurok = useCallback(
    (purok: string) => {
      if (!purok) return unreadCount;
      return notifications.filter(
        (n) => !n.read && isNotificationForPurok(n, purok)
      ).length;
    },
    [notifications, unreadCount]
  );
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        getRelativeTimeForNotif,
        getNotificationsForPurok,
        getUnreadCountForPurok
      }}>
      
      {children}
    </NotificationContext.Provider>);

}
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}