import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext } from
'react';
import { getRelativeTime } from '../data/mockData';
import { apiFetch } from '../lib/api';
import { getAuthUser } from '../lib/auth';
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refresh = useCallback(async () => {
    const user = getAuthUser();
    if (!user) {
      setNotifications([]);
      return;
    }
    const data = await apiFetch<{
      items: Array<{
        id: string;
        type: string;
        title: string;
        message: string;
        category: string;
        isRead: boolean;
        targetAudience: string;
        createdAt: string;
      }>;
    }>('/notifications?page=1&pageSize=100');

    setNotifications(
      data.items.map((n) => ({
        id: n.id,
        type: n.type.toLowerCase() === 'system' ? 'system' : n.type.toLowerCase() === 'emergency' ? 'emergency' : 'announcement',
        title: n.title,
        message: n.message,
        category: n.category,
        date: n.createdAt,
        read: n.isRead,
        targetAudience: (n.targetAudience || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      })),
    );
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);
  // Global unread count (for admin — sees everything)
  const unreadCount = notifications.filter((n) => !n.read).length;
  const addNotification = useCallback(
    (notif: Omit<Notification, 'id' | 'read' | 'date'>) => {
      // Notifications are created server-side. Keep this as a no-op for now.
      void notif;
    },
    []
  );
  const markAsRead = useCallback((id: string) => {
    (async () => {
      try {
        await apiFetch(`/notifications/${id}/read`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        });
        await refresh();
      } catch {
        // ignore
      }
    })();
  }, [refresh]);
  const markAllAsRead = useCallback(() => {
    // No bulk endpoint yet; mark locally for UX and rely on per-item reads as needed.
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const clearAll = useCallback(() => {
    setNotifications([]);
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