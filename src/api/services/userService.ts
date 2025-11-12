import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { User, UpdateProfileData } from '../../types/user';

/**
 * User Service
 * Standalone functions for user-related API calls
 */

export const userService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await apiClient.put<User>(
      ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.post(ENDPOINTS.USER.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  },
};
