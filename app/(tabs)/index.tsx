import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { bundledArcRepository } from '@/lib/arc/bundled-repository';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function DiscoverScreen() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['arc', 'dataset'],
    queryFn: () => bundledArcRepository.loadAll(),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>
        Bundled ARC dummy data + TanStack Query. Swap the repository when the real ARC feed is ready.
      </Text>

      <View style={styles.card} lightColor="#f5f5f5" darkColor="#1f1f1f">
        <Text style={styles.cardTitle}>Supabase</Text>
        <Text style={styles.cardBody}>
          {isSupabaseConfigured()
            ? 'Client configured (EXPO_PUBLIC_* env vars detected).'
            : 'Not configured yet — copy .env.example to .env and add your project URL + anon key.'}
        </Text>
      </View>

      {isPending ? <ActivityIndicator style={styles.loader} /> : null}
      {isError ? (
        <Text style={styles.error}>Could not load ARC dummy data: {String((error as Error)?.message)}</Text>
      ) : null}

      {data ? (
        <>
          <Text style={styles.sectionHeading}>Societies</Text>
          {data.societies.map((society) => (
            <View key={society.id} style={styles.item} lightColor="#f5f5f5" darkColor="#1f1f1f">
              <Text style={styles.itemTitle}>{society.name}</Text>
              <Text style={styles.itemMeta}>{society.tags.join(' · ')}</Text>
              <Text style={styles.itemBody}>{society.description}</Text>
            </View>
          ))}

          <Text style={styles.sectionHeading}>Activities</Text>
          {data.activities.map((activity) => (
            <View key={activity.id} style={styles.item} lightColor="#f5f5f5" darkColor="#1f1f1f">
              <Text style={styles.itemTitle}>{activity.title}</Text>
              <Text style={styles.itemMeta}>
                {new Date(activity.startsAt).toLocaleString()} · {activity.location}
              </Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.85,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeading: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  item: {
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemMeta: {
    fontSize: 13,
    opacity: 0.75,
  },
  itemBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  loader: {
    marginTop: 12,
  },
  error: {
    color: '#c62828',
    fontSize: 14,
  },
});
