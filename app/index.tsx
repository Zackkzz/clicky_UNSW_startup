import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

/** Screen background — match design. */
const LAVENDER = '#A7A7FF';
/** Logo circle + tagline text — match design. */
const CREAM = '#FFFFD1';

/**
 * Initial landing screen (matches product splash).
 * Tap anywhere to continue to the main app.
 */
export default function InitialLandingScreen() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue to next screen"
      style={styles.root}
      onPress={() => router.push('/onboarding-branded')}
    >
      <StatusBar style="dark" />
      <View style={styles.column}>
        <View style={styles.circle}>
          <Text style={styles.cMark}>c</Text>
        </View>
        <Text style={styles.line1}>COLOUR YOUR LIFE</Text>
        <Text style={styles.line2}>WITHIN SIMPLE CLICK</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: LAVENDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CREAM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cMark: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontStyle: 'italic',
    fontWeight: '400',
    fontSize: 46,
    color: LAVENDER,
    lineHeight: 52,
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: Platform.OS === 'android' ? -2 : 2,
  },
  line1: {
    marginTop: 20,
    color: CREAM,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    ...Platform.select({
      ios: { fontFamily: 'Helvetica Neue' },
      default: {},
    }),
  },
  line2: {
    marginTop: 8,
    color: CREAM,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    ...Platform.select({
      ios: { fontFamily: 'Helvetica Neue' },
      default: {},
    }),
  },
});
