/**
 * API Endpoints
 * Centralized location for all API endpoints
 */

export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
  },

  // User endpoints
  USER: {
    PROFILE: '/auth/me',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },

  // Posts endpoints
  POSTS: {
    LIST: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
  },
} as const;
