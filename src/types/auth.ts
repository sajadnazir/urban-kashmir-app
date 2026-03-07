/**
 * Authentication Types
 */

import type { User } from './user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ─── Phone / OTP Auth ─────────────────────────────────────────────────────────

export interface SendOtpPayload {
  phone_number: string; // E.164 format: "+919876543210"
}

export interface SendOtpResponse {
  message: string;
  expiresInSeconds: number;
}

export interface VerifyOtpPayload {
  phone_number: string;
  otp: string;
}

export interface VerifyOtpResponse {
  user: User;
  token: string;
  refreshToken: string;
}
