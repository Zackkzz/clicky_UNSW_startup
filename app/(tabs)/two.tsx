import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function ForumScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forum</Text>
      <Text style={styles.body}>
        Peer Q&A will live here (Supabase Postgres + Row Level Security). This tab is a placeholder while the schema
        and flows are implemented.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
});
