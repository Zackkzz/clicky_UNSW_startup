import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import { createSupabaseAuthStorage } from '@/lib/supabase-auth-storage';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient {
  const storage = createSupabaseAuthStorage();
  const isServer = typeof window === 'undefined';

  return createClient(url!, anonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: Platform.OS === 'web' && !isServer,
      ...(storage ? { storage } : {}),
    },
    ...(isServer
      ? {
          realtime: {
            // Node 20 in CI has no native WebSocket; required if client is created during static export.
            transport: require('ws') as unknown as typeof WebSocket,
          },
        }
      : {}),
  });
}

/** Lazy init so `expo export --platform web` does not create a client at import time. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createSupabaseClient();
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}
