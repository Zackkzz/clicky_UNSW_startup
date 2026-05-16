import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

/** OAuth redirect URL for Supabase (native deep link or web origin). */
export function getAuthRedirectUri(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/`;
  }

  return Linking.createURL('/', { scheme: 'clickyunswstartup' });
}
