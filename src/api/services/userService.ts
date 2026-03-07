import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { User, UpdateProfileData } from '../../types/user';

/**
 * User Service
 *
 * Uses the generic `apiService` — the Bearer token is attached automatically
 * via the axios interceptor, so no manual token handling is needed here.
 */
export const userService = {
  /**
   * Fetch the authenticated user's profile.
   */
  getProfile: async (): Promise<User> => {
    return apiService.get<User>(ENDPOINTS.USER.PROFILE);
  },

  /**
   * Update the authenticated user's profile.
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    return apiService.put<User, UpdateProfileData>(ENDPOINTS.USER.UPDATE_PROFILE, data);
  },

  /**
   * Change the authenticated user's password.
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    return apiService.post<void, { currentPassword: string; newPassword: string }>(
      ENDPOINTS.USER.CHANGE_PASSWORD,
      { currentPassword, newPassword },
    );
  },
};
