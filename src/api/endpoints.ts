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
  
  // Vendors (Stores) endpoints
  VENDORS: {
    LIST: '/vendors',
    DETAIL: (slug: string) => `/vendors/${slug}`,
  },

  // Wishlist endpoints
  WISHLIST: {
    LIST: '/wishlist',
    ADD_ITEM: '/wishlist',
    REMOVE_ITEM: (id: string | number) => `/wishlist/${id}`,
    MOVE_TO_CART: (id: string | number) => `/wishlist/${id}/move-to-cart`,
  },

  // Address endpoints
  ADDRESSES: {
    LIST: '/addresses',
    CREATE: '/addresses',
    UPDATE: (id: string | number) => `/addresses/${id}`,
    DELETE: (id: string | number) => `/addresses/${id}`,
    SET_DEFAULT: (id: string | number) => `/addresses/${id}/set-default`,
  },

  // Order endpoints
  ORDERS: {
    PLACE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string | number) => `/orders/${id}`,
    CANCEL: (id: string | number) => `/orders/${id}/cancel`,
    RETURN: (id: string | number) => `/orders/${id}/return`,
    INVOICE: (id: string | number) => `/orders/${id}/invoice`,
  },

  // Payment methods
  PAYMENTS: {
    METHODS: '/payments/methods',
  },

  // Notification endpoints
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: string | number) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    FCM_TOKEN: '/notifications/fcm-token',
  },

  // Track endpoint
  TRACKING: (number: string) => `/track/${number}`,
} as const;
