import { Caveat_700Bold, useFonts as useCaveatFonts } from '@expo-google-fonts/caveat';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AppProviders } from '@/providers/AppProviders';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [caveatLoaded, caveatError] = useCaveatFonts({ Caveat_700Bold });
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
    if (caveatError) throw caveatError;
  }, [error, caveatError]);

  useEffect(() => {
    if (loaded && caveatLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, caveatLoaded]);

  if (!loaded || !caveatLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AppProviders>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: '#A7A7FF' },
            }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding-branded"
              options={{
                headerShown: false,
                /** Entered from initial splash: cross-fade. */
                animation: 'fade',
                animationDuration: 680,
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#B4A7FF' },
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                /** Standard push: new screen moves in right → left. */
                animation: Platform.select({
                  ios: 'default',
                  android: 'slide_from_right',
                  default: 'default',
                }),
                animationTypeForReplace: 'push',
                contentStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="alternative-login"
              options={{
                headerShown: false,
                presentation: 'modal',
                contentStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </AppProviders>
    </SafeAreaProvider>
  );
}
