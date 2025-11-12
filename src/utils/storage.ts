/**
 * Storage Utility
 * Wrapper around AsyncStorage for type-safe storage operations
 */

// Note: Install @react-native-async-storage/async-storage if needed
// For now, this is a placeholder implementation

export const storage = {
  async setItem(key: string, value: string): Promise<void> {
    // await AsyncStorage.setItem(key, value);
    console.log(`Storage: Set ${key}`);
  },

  async getItem(key: string): Promise<string | null> {
    // return await AsyncStorage.getItem(key);
    console.log(`Storage: Get ${key}`);
    return null;
  },

  async removeItem(key: string): Promise<void> {
    // await AsyncStorage.removeItem(key);
    console.log(`Storage: Remove ${key}`);
  },

  async clear(): Promise<void> {
    // await AsyncStorage.clear();
    console.log('Storage: Clear all');
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
} as const;
