/**
 * API Module — barrel exports
 *
 * Import from here, not from individual files:
 *
 *   import { apiService, authService, userService, tokenStorage } from '../api';
 */

export { default as apiClient } from './client';
export { ENDPOINTS } from './endpoints';
export { apiService } from './apiService';
export { tokenStorage } from './tokenStorage';
export * from './services/authService';
export * from './services/userService';
export * from './services/productService';
export * from './services/categoryService';
export * from './services/cartService';
export * from './services/vendorService';
export * from './services/wishlistService';
export { addressService } from './services/addressService';
export { notificationService } from './services/notificationService';
export type { ApiResponse, RequestOptions } from './apiService';
