/**
 * Storage utility - wrapper around localStorage for type-safe storage operations
 * Replaces React Native's AsyncStorage with web localStorage
 */

// Storage keys
export const StorageKeys = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  USER_ID: 'user_id',
  USER_DATA: 'user_data',
  PREFERENCES_DATA: 'preferences_data',
  STREAK_DATA: 'streak_data',
  LAST_SYNC: 'last_sync',
} as const;

/**
 * Get item from localStorage
 */
export const getItem = async <T = string>(key: string): Promise<T | null> => {
  try {
    if (typeof window === 'undefined') return null;

    const item = localStorage.getItem(key);
    if (item === null) return null;

    // Try to parse JSON, fallback to string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error getting item "${key}" from storage:`, error);
    return null;
  }
};

/**
 * Set item in localStorage
 */
export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    if (typeof window === 'undefined') return;

    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error setting item "${key}" in storage:`, error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item "${key}" from storage:`, error);
  }
};

/**
 * Clear all items from localStorage
 */
export const clear = async (): Promise<void> => {
  try {
    if (typeof window === 'undefined') return;

    localStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Get multiple items from localStorage
 */
export const multiGet = async (
  keys: string[]
): Promise<Array<[string, string | null]>> => {
  try {
    if (typeof window === 'undefined') return keys.map((key) => [key, null]);

    return keys.map((key) => [key, localStorage.getItem(key)]);
  } catch (error) {
    console.error('Error getting multiple items from storage:', error);
    return keys.map((key) => [key, null]);
  }
};

/**
 * Check if a key exists in localStorage
 */
export const hasKey = async (key: string): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') return false;

    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking key "${key}" in storage:`, error);
    return false;
  }
};
