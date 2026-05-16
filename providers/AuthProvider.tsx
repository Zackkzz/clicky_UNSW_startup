import { useRouter, useSegments } from 'expo-router';
import { useEffect, type ReactNode } from 'react';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';

type Props = {
  children: ReactNode;
};

/**
 * Boots Supabase session, syncs Zustand, and guards (tabs) behind auth.
 */
export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const segments = useSegments();
  const isReady = useAuthStore((s) => s.isReady);
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const setReady = useAuthStore((s) => s.setReady);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      if (!mounted) return;
      setSession(current);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setReady, setSession]);

  useEffect(() => {
    if (!isReady || !isSupabaseConfigured()) return;

    const root = segments[0];
    const inTabs = root === '(tabs)';

    if (!session && inTabs) {
      router.replace('/login');
      return;
    }

    // Index route has no first segment; also skip ahead if already signed in on auth screens.
    if (session && (!root || root === 'login' || root === 'alternative-login')) {
      router.replace('/(tabs)');
    }
  }, [isReady, session, segments, router]);

  return <>{children}</>;
}
