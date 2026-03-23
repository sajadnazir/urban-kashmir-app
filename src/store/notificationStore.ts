import { create } from 'zustand';
import { notificationService } from '../api/services/notificationService';
import { Notification } from '../types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  hasUnread: () => boolean;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await notificationService.getNotifications();
      const unreadCount = notifications.filter(n => !n.read_at).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch notifications', isLoading: false });
    }
  },

  markAsRead: async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      const { notifications } = get();
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      );
      const unreadCount = updated.filter(n => !n.read_at).length;
      set({ notifications: updated, unreadCount });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      const { notifications } = get();
      const updated = notifications.map(n => ({ ...n, read_at: new Date().toISOString() }));
      set({ notifications: updated, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  hasUnread: () => {
    return get().unreadCount > 0;
  },
}));
