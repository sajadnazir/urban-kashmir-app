import { create } from 'zustand';
import { authService } from '../api';
import { tokenStorage } from '../api/tokenStorage';
import type { User, LoginCredentials, RegisterData } from '../types';

/**
 * Authentication Store
 *
 * Orchestrates auth state via Zustand.
 * Token persistence is handled by `authService` + `tokenStorage`; this store
 * only keeps the in-memory representation for the UI layer.
 */

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithOtp: (phone: string, otp: string, name?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  /** Verify OTP and transition to authenticated state. */
  loginWithOtp: async (phone: string, otp: string, name?: string, email?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.verifyOtp(phone, otp, name, email);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'OTP verification failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch {
      // Tokens are already cleared by authService; reset UI state regardless.
      await tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user }),
  clearError: () => set({ error: null }),
}));
