import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { getAuthRedirectUri } from '@/lib/auth/redirect-uri';
import { accountToEmail, validateLoginFields } from '@/lib/auth/credentials';
import { authErrorMessage } from '@/lib/auth/errors';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export type OAuthProvider = 'google';

function requireSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env.',
    );
  }
  return supabase;
}

export async function signInWithPassword(account: string, password: string) {
  validateLoginFields(account, password);
  const email = accountToEmail(account);
  const supabase = requireSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(authErrorMessage(error));
  }
  return data.session;
}

export async function signUpWithPassword(account: string, password: string) {
  validateLoginFields(account, password);
  const email = accountToEmail(account);
  const supabase = requireSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: email.split('@')[0],
      },
    },
  });
  if (error) {
    throw new Error(authErrorMessage(error));
  }
  if (!data.session) {
    throw new Error('Account created. Check your email to confirm your address, then log in.');
  }
  return data.session;
}

export async function signInWithGoogle() {
  return signInWithOAuthProvider('google');
}

export async function signInWithOAuthProvider(provider: OAuthProvider) {
  const supabase = requireSupabase();
  const redirectTo = getAuthRedirectUri();

  if (Platform.OS === 'web') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      throw new Error(authErrorMessage(error));
    }
    if (!data.url) {
      throw new Error('Could not start sign-in. Check OAuth settings in Supabase.');
    }
    window.location.assign(data.url);
    return null;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw new Error(authErrorMessage(error));
  }
  if (!data.url) {
    throw new Error('Could not start sign-in. Check OAuth settings in Supabase.');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success') {
    throw new Error('Sign-in was cancelled.');
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(result.url);
  if (exchangeError) {
    throw new Error(authErrorMessage(exchangeError));
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(authErrorMessage(sessionError));
  }
  return sessionData.session;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(authErrorMessage(error));
  }
}

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env.',
    );
  }
}
