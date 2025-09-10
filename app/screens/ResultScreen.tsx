// app/screens/result.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResultScreen() {
  const router = useRouter();
  const { score, total } = useLocalSearchParams<{ score: string; total: string }>();

  const scoreNum = Number(score);
  const totalNum = Number(total);
  const accuracy = ((scoreNum / totalNum) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Completed 🎉</Text>
      <Text style={styles.result}>Correct: {scoreNum}</Text>
      <Text style={styles.result}>Wrong: {totalNum - scoreNum}</Text>
      <Text style={styles.result}>Accuracy: {accuracy}%</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6fc' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  result: { fontSize: 18, marginVertical: 6 },
  button: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
