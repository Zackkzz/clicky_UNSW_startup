import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedStorage } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/** In-memory storage for static web export / SSR (no `window`). */
function createMemoryStorage(): SupportedStorage {
  const store = new Map<string, string>();
  return {
    getItem: async (key) => store.get(key) ?? null,
    setItem: async (key, value) => {
      store.set(key, value);
    },
    removeItem: async (key) => {
      store.delete(key);
    },
  };
}

/**
 * Supabase auth storage per platform.
 * - Native: AsyncStorage
 * - Web (browser): default localStorage (return undefined)
 * - Web (SSR / static export): in-memory noop store
 */
export function createSupabaseAuthStorage(): SupportedStorage | undefined {
  if (Platform.OS !== 'web') {
    return AsyncStorage;
  }

  if (typeof window === 'undefined') {
    return createMemoryStorage();
  }

  return undefined;
}
