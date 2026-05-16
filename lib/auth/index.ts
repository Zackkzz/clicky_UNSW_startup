export { accountToEmail, validateLoginFields, validatePassword } from '@/lib/auth/credentials';
export { authErrorMessage } from '@/lib/auth/errors';
export {
  assertSupabaseConfigured,
  signInWithGoogle,
  signInWithOAuthProvider,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  type OAuthProvider,
} from '@/lib/auth/session';
