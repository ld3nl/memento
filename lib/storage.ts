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

const STORAGE_KEYS = {
  FORM_DATA: "formData",
} as const;

// Type definitions
interface FormData {
  name?: string;
  date: string;
  saveData?: boolean;
}

/**
 * Generic storage functions using localforage with localStorage fallback
 */
const StorageManager = {
  /**
   * Set an item in storage
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await localforage.setItem(key, value);
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  /**
   * Get an item from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
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
  },

  /**
   * Remove an item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await localforage.removeItem(key);
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      localStorage.removeItem(key);
    }
  },

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      // Fallback to localStorage
      console.warn("localforage failed, falling back to localStorage:", error);
      localStorage.clear();
    }
  },

  /**
   * Get all keys from storage
   */
  async keys(): Promise<string[]> {
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
  },
};

/**
 * Form-specific storage functions
 */
export const FormStorage = {
  /**
   * Save form data
   */
  async saveFormData(data: FormData): Promise<void> {
    await StorageManager.setItem(STORAGE_KEYS.FORM_DATA, data);
  },

  /**
   * Load form data
   */
  async loadFormData(): Promise<FormData | null> {
    return await StorageManager.getItem<FormData>(STORAGE_KEYS.FORM_DATA);
  },

  /**
   * Clear form data
   */
  async clearFormData(): Promise<void> {
    await StorageManager.removeItem(STORAGE_KEYS.FORM_DATA);
  },
};
