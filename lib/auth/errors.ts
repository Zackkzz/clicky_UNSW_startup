import type { AuthError } from '@supabase/supabase-js';

export function authErrorMessage(error: AuthError | Error | null | undefined): string {
  if (!error) return 'Something went wrong. Please try again.';

  if ('message' in error && error.message) {
    const msg = error.message.toLowerCase();

    if (msg.includes('invalid login credentials')) {
      return 'Account or password is incorrect.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Confirm your email before signing in.';
    }
    if (msg.includes('user already registered')) {
      return 'An account with this email already exists.';
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Network error. Check your connection and try again.';
    }

    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
