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

  // Products endpoints
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/search',
    DETAIL: (id: string | number) => `/products/${id}`,
  },

  // Categories endpoints
  CATEGORIES: {
    LIST: '/categories',
  },

  // Cart endpoints
  CART: {
    LIST: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: number) => `/cart/items/${id}`,
    REMOVE_ITEM: (id: number) => `/cart/items/${id}`,
    CLEAR: '/cart',
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
