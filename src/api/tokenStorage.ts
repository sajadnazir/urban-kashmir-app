/**
 * Token Storage
 *
 * Provides a unified interface for storing and retrieving auth tokens.
 * Currently uses in-memory storage.
 *
 * ─── HOW TO UPGRADE TO PERSISTENT STORAGE ────────────────────────────────────
 * 1. Install: `npm install @react-native-async-storage/async-storage`
 * 2. Replace the in-memory implementation below with AsyncStorage calls.
 *    All call-sites remain the same because the interface is identical.
 *
 * Example AsyncStorage swap:
 *   import AsyncStorage from '@react-native-async-storage/async-storage';
 *   const TOKEN_KEY = '@auth_token';
 *   const REFRESH_TOKEN_KEY = '@refresh_token';
 *
 *   async function saveTokens(token, refreshToken) {
 *     await AsyncStorage.multiSet([[TOKEN_KEY, token], [REFRESH_TOKEN_KEY, refreshToken]]);
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

let _accessToken: string | null = null;
let _refreshToken: string | null = null;

export const tokenStorage = {
  /** Persist both tokens (call after login / token refresh) */
  saveTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
  },

  /** Return the current access token, or null when logged out */
  getAccessToken: async (): Promise<string | null> => {
    return _accessToken;
  },

  /** Return the current refresh token, or null when logged out */
  getRefreshToken: async (): Promise<string | null> => {
    return _refreshToken;
  },

  /** Clear all tokens on logout */
  clearTokens: async (): Promise<void> => {
    _accessToken = null;
    _refreshToken = null;
  },
};
