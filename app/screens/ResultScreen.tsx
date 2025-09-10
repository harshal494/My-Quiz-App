// app/screens/result.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ResultScreen() {
  const router = useRouter();
  const { score, total } = useLocalSearchParams<{ score?: string; total?: string }>();

  const scoreNum = Number(score ?? 0);
  const totalNum = Number(total ?? 0);
  const accuracy = totalNum > 0 ? ((scoreNum / totalNum) * 100).toFixed(2) : '0.00';

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="trophy-outline" size={22} color="#fff" />
          <Text style={styles.headerTitle}>Results</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.title}>Test Completed 🎉</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{scoreNum}</Text>
              <Text style={styles.metricLabel}>Correct</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricValue, { color: '#FF3B30' }]}>{Math.max(totalNum - scoreNum, 0)}</Text>
              <Text style={styles.metricLabel}>Wrong</Text>
            </View>
            <View style={styles.metricBox}>
              <View style={styles.accuracyBadge}>
                <Text style={styles.accuracyText}>{accuracy}%</Text>
              </View>
              <Text style={styles.metricLabel}>Accuracy</Text>
            </View>
          </View>
        </View>

        {/* Ad Section (placeholder) */}
        <View style={styles.adBox}>
          <Text style={styles.adText}>Ad Banner</Text>
          {/* Place <BannerAd /> from `react-native-google-mobile-ads` here when ready. */}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/screens/home')}>
            <Ionicons name="home-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },

  scrollContent: { padding: 16 },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#eee',
    ...CARD_SHADOW,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#007AFF', marginBottom: 10 },

  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 6,
    backgroundColor: '#f9fbff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8efff',
  },
  metricValue: { fontSize: 20, fontWeight: '800', color: '#1c1c1c' },
  metricLabel: { marginTop: 4, fontSize: 12, color: '#666', fontWeight: '600' },

  accuracyBadge: {
    backgroundColor: '#eaf3ff',
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  accuracyText: { color: '#007AFF', fontWeight: '800' },

  adBox: {
    marginTop: 16,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#eef3ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  adText: { color: '#333', fontStyle: 'italic' },

  actions: { marginTop: 16 },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
});
