import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { Notification, FcmTokenPayload } from '../../types/notification';

export const notificationService = {
  /**
   * Fetch all notifications for the authenticated user.
   */
  getNotifications: async (): Promise<Notification[]> => {
    return apiService.get<Notification[]>(ENDPOINTS.NOTIFICATIONS.LIST);
  },

  /**
   * Mark a single notification as read.
   */
  markAsRead: async (id: number): Promise<void> => {
    return apiService.post<void, {}>(ENDPOINTS.NOTIFICATIONS.READ(id), {});
  },

  /**
   * Mark all notifications as read.
   */
  markAllAsRead: async (): Promise<void> => {
    return apiService.post<void, {}>(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {});
  },

  /**
   * Register an FCM token for push notifications.
   */
  registerFcmToken: async (payload: FcmTokenPayload): Promise<void> => {
    return apiService.post<void, FcmTokenPayload>(ENDPOINTS.NOTIFICATIONS.FCM_TOKEN, payload);
  },
};
