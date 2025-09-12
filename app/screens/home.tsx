// app/screens/home.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext'; // adjust path if needed

export default function HomeScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username?: string }>();
  const displayName = username ?? 'User';

  // Avatar (unchanged behavior)
  const { user } = useUser();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const loadAvatar = useCallback(async () => {
    if (user?.avatarUri) {
      setAvatarUri(user.avatarUri ?? null);
      return;
    }
    const stored = await AsyncStorage.getItem('avatarUri'); // string | null
    setAvatarUri(stored ?? null);
  }, [user?.avatarUri]);

  useEffect(() => {
    loadAvatar();
  }, [loadAvatar]);

  useFocusEffect(
    useCallback(() => {
      loadAvatar();
    }, [loadAvatar])
  );

  const openProfileSmooth = () => {
    setTimeout(() => router.push('/screens/profile'), 220);
  };

  return (
    <View style={styles.container}>
      {/* Header (background full width, content centered) */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <Image source={require('../../assets/images/icon.png')} style={styles.appIcon} />
            <Text style={styles.appName}>LearnApp</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting section centered */}
      <View style={styles.pageInner}>
        <View style={styles.greetingCard}>
          <View style={styles.greetLeft}>
            <Text style={styles.greetingText}>Hey there, {displayName}! 🚀✨</Text>
            <Text style={styles.subGreeting}>Time to level up your skills! 💪🔥</Text>
          </View>

          <TouchableOpacity style={styles.avatarBtn} onPress={openProfileSmooth} activeOpacity={0.8}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={24} color="#0b1220" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Content centered */}
      <ScrollView contentContainerStyle={styles.scrollOuter}>
        <View style={styles.pageInner}>
          {/* Quick Test */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick Test</Text>
            <Text style={styles.cardSubtitle}>Earn XP, boost leaderboard, unlock badges</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push({ pathname: '/screens/QuizScreen', params: { testType: 'quick' } })}
            >
              <Text style={styles.buttonText}>Start Quick Test →</Text>
            </TouchableOpacity>
          </View>

          {/* Free & Premium Test */}
          <View style={styles.row}>
            <View style={[styles.card, styles.halfCard]}>
              <Text style={styles.cardTitle}>Free Test</Text>
              <Text style={styles.cardSubtitle}>Basic questions, limited access</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#34C759' }]}
                onPress={() => router.push({ pathname: '/screens/QuizScreen', params: { testType: 'free' } })}
              >
                <Text style={styles.buttonText}>Start Free Test</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.card, styles.halfCard]}>
              <Text style={styles.cardTitle}>Premium Test</Text>
              <Text style={styles.cardSubtitle}>Advanced questions, unlimited access</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#007AFF' }]}
                onPress={() =>
                  Alert.alert('Premium', 'Premium tests will be available soon. Please use Free or Quick for now.')
                }
              >
                <Text style={styles.buttonText}>Start Premium Test</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI Assistant */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AI Assistant</Text>
            <Text style={styles.cardSubtitle}>Ask me anything about your studies!</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#5856D6' }]}>
              <Text style={styles.buttonText}>Ask AI Assistant →</Text>
            </TouchableOpacity>
          </View>

          {/* Community Hub */}
          <View style={[styles.card, { backgroundColor: '#6A5ACD' }]}>
            <Text style={[styles.cardTitle, { color: '#fff' }]}>Community Hub</Text>
            <Text style={[styles.cardSubtitle, { color: '#eee' }]}>Connect & Learn Together</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#fff' }]}>
              <Text style={[styles.buttonText, { color: '#6A5ACD' }]}>Join Community Hub →</Text>
            </TouchableOpacity>
          </View>

          {/* Quote */}
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>
              “Success is the sum of small efforts repeated day in and day out.” — Robert Collier
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const MAX_WIDTH = 960;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6fc' },

  // Header shell remains full width
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Inner header is centered and constrained
  headerInner: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  appIcon: { width: 28, height: 28, marginRight: 8 },
  appName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Generic center wrapper for sections
  pageInner: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },

  greetingCard: {
    backgroundColor: '#4c669f',
    padding: 20,
    marginTop: 0,
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetLeft: { flexShrink: 1, paddingRight: 12 },
  greetingText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  subGreeting: { fontSize: 14, color: '#f1f1f1', marginTop: 4 },

  // Avatar button on the right
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: { width: 48, height: 48, borderRadius: 24 },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD84D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ScrollView outer (kept separate so we can center inner content easily)
  scrollOuter: { paddingBottom: 16 },

  // Cards
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfCard: { flex: 1, marginHorizontal: 4 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cardSubtitle: { fontSize: 13, color: '#666', marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },

  // Quote
  quoteBox: {
    marginVertical: 20,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    backgroundColor: '#eef3ff',
    borderRadius: 8,
  },
  quoteText: { fontStyle: 'italic', color: '#333' },
});
