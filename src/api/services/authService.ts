import { apiService } from '../apiService';
import { tokenStorage } from '../tokenStorage';
import { ENDPOINTS } from '../endpoints';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  SendOtpPayload,
  SendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from '../../types/auth';

/**
 * Authentication Service
 *
 * Uses the generic `apiService` so every call automatically receives the
 * Bearer token header when the user is logged in.
 *
 * Token persistence is handled here — callers (e.g. Zustand stores) just
 * await the methods and read the returned data.
 */
export const authService = {
  /**
   * Login — saves tokens so all subsequent API calls are authenticated.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await apiService.post<AuthResponse, LoginCredentials>(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    await tokenStorage.saveTokens(data.token, data.refreshToken);
    return data;
  },

  /**
   * Register — saves tokens immediately so the user is logged in right away.
   */
  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const result = await apiService.post<AuthResponse, RegisterData>(
      ENDPOINTS.AUTH.REGISTER,
      registerData,
    );
    await tokenStorage.saveTokens(result.token, result.refreshToken);
    return result;
  },

  /**
   * Logout — clears stored tokens so subsequent calls become unauthenticated.
   */
  logout: async (): Promise<void> => {
    try {
      await apiService.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Always clear local tokens, even if the server call fails.
      await tokenStorage.clearTokens();
    }
  },

  /**
   * Manually refresh the access token.
   * The client interceptor calls this automatically on 401.
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const data = await apiService.post<AuthResponse, { refreshToken: string }>(
      ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken },
    );
    await tokenStorage.saveTokens(data.token, data.refreshToken);
    return data;
  },

  // ─── Phone / OTP Auth ───────────────────────────────────────────────────────

  /**
   * Send a one-time password to the given phone number.
   * @param phone  E.164 format, e.g. "+919876543210"
   */
  sendOtp: async (phone: string): Promise<SendOtpResponse> => {
    return apiService.post<SendOtpResponse, SendOtpPayload>(
      ENDPOINTS.AUTH.SEND_OTP,
      { phone_number: phone },
    );
  },

  /**
   * Verify the OTP received by the user and log them in.
   * Saves tokens on success.
   */
  verifyOtp: async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
    const data = await apiService.post<VerifyOtpResponse, VerifyOtpPayload>(
      ENDPOINTS.AUTH.VERIFY_OTP,
      { phone_number: phone, otp },
    );
    await tokenStorage.saveTokens(data.token, data.refreshToken);
    return data;
  },
};
