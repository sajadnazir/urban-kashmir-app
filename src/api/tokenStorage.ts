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

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';

export const tokenStorage = {
  /** Persist both tokens (call after login / token refresh) */
  saveTokens: async (accessToken?: string | null, refreshToken?: string | null): Promise<void> => {
    const pairs: [string, string][] = [];
    
    if (accessToken) pairs.push([TOKEN_KEY, accessToken]);
    if (refreshToken) pairs.push([REFRESH_TOKEN_KEY, refreshToken]);
    
    if (pairs.length > 0) {
      await AsyncStorage.multiSet(pairs);
    }
  },

  /** Return the current access token, or null when logged out */
  getAccessToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  /** Return the current refresh token, or null when logged out */
  getRefreshToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /** Clear all tokens on logout */
  clearTokens: async (): Promise<void> => {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
};
