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
export type { ApiResponse, RequestOptions } from './apiService';
