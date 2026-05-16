import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  assertSupabaseConfigured,
  signInWithPassword,
  signUpWithPassword,
  validateLoginFields,
} from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Stop,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Design tokens from mock */
const LAVENDER_PANEL = '#B5B5FF';
const WHITE = '#FFFFFF';
const ACCENT_PURPLE = '#9980FF';
const YELLOW = '#FFFFD1';
/** Thin frame around CLICKY */
const MONSTER_BODY = '#9869E8';
const MONSTER_STROKE = '#4A3D85';
const HORN_ORANGE = '#FF9F45';
const HORN_YELLOW = '#FFD54A';

/** Peeking monster — horns, triangle body with grid, one eye, mouth */
function MonsterPeek() {
  const w = 240;
  const h = 128;
  return (
    <View style={styles.monsterOuter} accessibilityLabel="Brand mascot illustration">
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Defs>
          <LinearGradient id="hornGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={HORN_ORANGE} />
            <Stop offset="0.5" stopColor={HORN_ORANGE} />
            <Stop offset="0.5" stopColor={HORN_YELLOW} />
            <Stop offset="1" stopColor={HORN_YELLOW} />
          </LinearGradient>
        </Defs>
        {/* Left horn */}
        <Path
          d="M 72 52 Q 54 38 42 22 Q 50 44 62 62 Z"
          fill="url(#hornGrad)"
          stroke={MONSTER_STROKE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Right horn */}
        <Path
          d="M 168 52 Q 186 38 198 22 Q 190 44 178 62 Z"
          fill="url(#hornGrad)"
          stroke={MONSTER_STROKE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Main body */}
        <Polygon
          points={`40,128 120,36 200,128`}
          fill={MONSTER_BODY}
          stroke={MONSTER_STROKE}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* Subtle grid on body */}
        {[0.22, 0.38, 0.54, 0.7].map((t, i) => {
          const x1 = 40 + (120 - 40) * t;
          const y1 = 128 - (128 - 36) * t;
          const x2 = 200 - (200 - 120) * t;
          return (
            <Line
              key={`g-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={128}
              stroke={MONSTER_STROKE}
              strokeOpacity={0.28}
              strokeWidth={1.2}
            />
          );
        })}
        {[72, 98, 124, 150, 176].map((cx, i) => (
          <Line
            key={`gv-${i}`}
            x1={cx}
            y1={86}
            x2={(cx + 120) / 2 - 12}
            y2={118}
            stroke={MONSTER_STROKE}
            strokeOpacity={0.22}
            strokeWidth={1}
          />
        ))}
        {/* Eye */}
        <Circle cx={120} cy={78} r={22} fill={WHITE} stroke={MONSTER_STROKE} strokeWidth={2} />
        <Circle cx={124} cy={78} r={9} fill={MONSTER_STROKE} />
        {/* Open mouth */}
        <Path
          d="M 96 106 Q 120 132 144 106 Q 138 118 120 122 Q 102 118 96 106 Z"
          fill="#3D2566"
          stroke={MONSTER_STROKE}
          strokeWidth={1.5}
        />
        <Path d="M 108 114 Q 120 126 132 114" fill="none" stroke="#FFB4C8" strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [busyAction, setBusyAction] = useState<'login' | 'signup' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isLoading = busyAction !== null;

  const onLogin = useCallback(async () => {
    setError(null);
    setInfo(null);
    try {
      validateLoginFields(account, password);
      assertSupabaseConfigured();
      setBusyAction('login');
      await signInWithPassword(account, password);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed.');
    } finally {
      setBusyAction(null);
    }
  }, [account, password]);

  const onCreateAccount = useCallback(async () => {
    setError(null);
    setInfo(null);
    try {
      validateLoginFields(account, password);
      assertSupabaseConfigured();
      setBusyAction('signup');
      await signUpWithPassword(account, password);
      router.replace('/(tabs)');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not create account.';
      if (message.includes('Check your email')) {
        setInfo(message);
      } else {
        setError(message);
      }
    } finally {
      setBusyAction(null);
    }
  }, [account, password]);

  const onAlternativeLogin = useCallback(() => {
    router.push('/alternative-login');
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        {/* Top lavender panel */}
        <View style={[styles.topHalf, { paddingTop: Math.max(insets.top, 12) }]}>
          <View style={styles.topInner}>
            <View style={styles.logoFrame}>
              <Text style={styles.logoText} accessibilityRole="header">
                CLICKY
              </Text>
            </View>
            <Text style={styles.tagline}>COLOUR YOUR LIFE WITHIN SIMPLE CLICK</Text>
          </View>

          <MonsterPeek />
        </View>

        {/* Bottom white panel */}
        <ScrollView
          style={styles.bottomHalf}
          contentContainerStyle={[
            styles.bottomContent,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.signOnTitle}>Sign on with your UNSW account:</Text>

          {!isSupabaseConfigured() ? (
            <Text style={styles.errorText}>
              Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to
              `.env`, then restart Metro.
            </Text>
          ) : null}

          {info ? <Text style={styles.infoText}>{info}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.pillInput}
            placeholder="account number"
            placeholderTextColor={WHITE}
            value={account}
            onChangeText={setAccount}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <TextInput
            style={[styles.pillInput, styles.pillGap]}
            placeholder="passwords"
            placeholderTextColor={WHITE}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={() => void onLogin()}
            editable={!isLoading}
          />

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={() => void onLogin()}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Log in">
            {busyAction === 'login' ? (
              <ActivityIndicator color={WHITE} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.createAccountButton,
              pressed && styles.loginButtonPressed,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={() => void onCreateAccount()}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Create account">
            {busyAction === 'signup' ? (
              <ActivityIndicator color={ACCENT_PURPLE} />
            ) : (
              <Text style={styles.createAccountButtonText}>Create account</Text>
            )}
          </Pressable>

          <Pressable onPress={onAlternativeLogin} hitSlop={12} accessibilityRole="link">
            <Text style={styles.alternativeLink}>Alternative logins</Text>
          </Pressable>

          <Pressable accessibilityRole="button" style={styles.termsWrap}>
            <Text style={styles.terms}>I agree with the Terms and Privacy Policy.</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },
  flex: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    backgroundColor: LAVENDER_PANEL,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    overflow: 'visible',
  },
  topInner: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    zIndex: 1,
  },
  logoFrame: {
    paddingHorizontal: 0,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  logoText: {
    fontFamily: 'Caveat_700Bold',
    fontSize: 54,
    lineHeight: 58,
    color: YELLOW,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 18,
    color: YELLOW,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.4,
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    maxWidth: 320,
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue-Bold' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  monsterOuter: {
    position: 'absolute',
    bottom: -42,
    alignSelf: 'center',
    zIndex: 2,
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: WHITE,
  },
  bottomContent: {
    paddingHorizontal: 32,
    paddingTop: 56,
    alignItems: 'center',
    flexGrow: 1,
  },
  errorText: {
    marginTop: 12,
    width: '100%',
    color: '#B42318',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  infoText: {
    marginTop: 12,
    width: '100%',
    color: ACCENT_PURPLE,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  signOnTitle: {
    color: ACCENT_PURPLE,
    fontWeight: '800',
    fontSize: 16,
    width: '100%',
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue-Bold' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  pillInput: {
    marginTop: 22,
    width: '100%',
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: ACCENT_PURPLE,
    backgroundColor: LAVENDER_PANEL,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    paddingHorizontal: 22,
    fontSize: 16,
    fontWeight: '800',
    color: WHITE,
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue-Bold' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  pillGap: {
    marginTop: 14,
  },
  loginButton: {
    marginTop: 22,
    alignSelf: 'center',
    width: '48%',
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: ACCENT_PURPLE,
    backgroundColor: LAVENDER_PANEL,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonPressed: {
    opacity: 0.85,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  createAccountButton: {
    marginTop: 12,
    alignSelf: 'center',
    width: '48%',
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: ACCENT_PURPLE,
    backgroundColor: WHITE,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: ACCENT_PURPLE,
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue-Bold' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: WHITE,
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue-Bold' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  alternativeLink: {
    marginTop: 28,
    color: ACCENT_PURPLE,
    fontWeight: '600',
    fontSize: 15,
    textDecorationLine: 'underline',
    textAlign: 'center',
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
  termsWrap: {
    marginTop: 'auto',
    paddingTop: 32,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  terms: {
    color: ACCENT_PURPLE,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    ...Platform.select({
      ios: { fontFamily: 'HelveticaNeue' },
      android: { fontFamily: 'sans-serif' },
      default: {},
    }),
  },
});
