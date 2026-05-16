import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { assertSupabaseConfigured, signInWithGoogle } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

const ACCENT_PURPLE = '#9980FF';
const LAVENDER_PANEL = '#B5B5FF';
const WHITE = '#FFFFFF';

export default function AlternativeLoginScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGoogleSignIn = useCallback(async () => {
    setError(null);
    try {
      assertSupabaseConfigured();
      setIsLoading(true);
      const session = await signInWithGoogle();
      if (session) {
        router.replace('/(tabs)');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Alternative logins</Text>
      <Text style={styles.subtitle}>Sign in with your Google account.</Text>

      {!isSupabaseConfigured() ? (
        <Text style={styles.error}>Supabase is not configured. Add keys to `.env` and restart Metro.</Text>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={({ pressed }) => [styles.oauthButton, pressed && styles.oauthButtonPressed]}
        onPress={() => void onGoogleSignIn()}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="Continue with Google">
        {isLoading ? (
          <ActivityIndicator color={WHITE} />
        ) : (
          <Text style={styles.oauthLabel}>Continue with Google</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.backLink} hitSlop={12}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
    paddingHorizontal: 32,
  },
  title: {
    color: ACCENT_PURPLE,
    fontWeight: '800',
    fontSize: 22,
    marginBottom: 8,
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue-Bold' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  subtitle: {
    color: ACCENT_PURPLE,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
    opacity: 0.9,
  },
  error: {
    color: '#B42318',
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  oauthButton: {
    width: '100%',
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: ACCENT_PURPLE,
    backgroundColor: LAVENDER_PANEL,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  oauthButtonPressed: {
    opacity: 0.85,
  },
  oauthLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: WHITE,
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue-Bold' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  backLink: {
    marginTop: 32,
    alignSelf: 'center',
  },
  backText: {
    color: ACCENT_PURPLE,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
