/**
 * Storage utilities using localforage with localStorage fallback
 */

import localforage from "localforage";

// Configure localforage
localforage.config({
  name: "MementoMori",
  storeName: "formData",
  version: 1.0,
  description: "Storage for Memento Mori form data",
});

// Storage keys
export const STORAGE_KEYS = {
  FORM_DATA: "formData",
  USER_PREFERENCES: "userPreferences",
} as const;

// Type definitions
export interface FormData {
  name?: string;
  date: string;
  saveData?: boolean;
}

export interface UserPreferences {
  theme?: "light" | "dark";
  // Add other preferences as needed
}

/**
 * Generic storage functions using localforage with localStorage fallback
 */
export class StorageManager {
  /**
   * Set an item in storage
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await localforage.setItem(key, value);
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Get an item from storage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await localforage.getItem<T>(key);
      return value;
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (parseError) {
        console.error("Failed to parse localStorage item:", parseError);
        return null;
      }
    }
  }

  /**
   * Remove an item from storage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await localforage.removeItem(key);
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      localStorage.removeItem(key);
    }
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      localStorage.clear();
    }
  }

  /**
   * Get all keys from storage
   */
  static async keys(): Promise<string[]> {
    try {
      return await localforage.keys();
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keys.push(key);
      }
      return keys;
    }
  }
}

/**
 * Form-specific storage functions
 */
export class FormStorage {
  /**
   * Save form data
   */
  static async saveFormData(data: FormData): Promise<void> {
    await StorageManager.setItem(STORAGE_KEYS.FORM_DATA, data);
  }

  /**
   * Load form data
   */
  static async loadFormData(): Promise<FormData | null> {
    return await StorageManager.getItem<FormData>(STORAGE_KEYS.FORM_DATA);
  }

  /**
   * Clear form data
   */
  static async clearFormData(): Promise<void> {
    await StorageManager.removeItem(STORAGE_KEYS.FORM_DATA);
  }
}

/**
 * User preferences storage functions
 */
export class PreferencesStorage {
  /**
   * Save user preferences
   */
  static async savePreferences(preferences: UserPreferences): Promise<void> {
    await StorageManager.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  /**
   * Load user preferences
   */
  static async loadPreferences(): Promise<UserPreferences | null> {
    return await StorageManager.getItem<UserPreferences>(
      STORAGE_KEYS.USER_PREFERENCES,
    );
  }

  /**
   * Clear user preferences
   */
  static async clearPreferences(): Promise<void> {
    await StorageManager.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  }
}
