// app/screens/quiz.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const questions = [
  { id: 1, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: '4' },
  { id: 2, question: 'Capital of France?', options: ['London', 'Berlin', 'Paris', 'Rome'], correct: 'Paris' },
  { id: 3, question: 'React is a ___ library?', options: ['UI', 'Database', 'Backend', 'OS'], correct: 'UI' },
];

export default function QuizScreen() {
  const router = useRouter();
  const { testType } = useLocalSearchParams<{ testType: string }>();

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(1800);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push({ pathname: '/screens/ResultScreen', params: { score, total: questions.length } });
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router, score]);

  const handleAnswer = (option: string) => {
    const correct = questions[current].correct;
    if (option === correct) {
      setScore(score + 1);
      Alert.alert('Correct 🎉', 'You got it right!');
    } else {
      Alert.alert('Wrong ❌', `Correct answer was: ${correct}`);
    }

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      router.push({
        pathname: '/screens/ResultScreen',
        params: { score: score + (option === correct ? 1 : 0), total: questions.length },
      });
    }
  };

  const skipQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      router.push({ pathname: '/screens/ResultScreen', params: { score, total: questions.length } });
    }
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{testType}</Text>
        <Text style={styles.timer}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Text>
      </View>

      <Text style={styles.question}>{`Q${current + 1}. ${questions[current].question}`}</Text>

      {questions[current].options.map((option, i) => (
        <TouchableOpacity key={i} style={styles.option} onPress={() => handleAnswer(option)}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.skipButton} onPress={skipQuestion}>
        <Text style={styles.skipText}>Skip →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6fc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  timer: { fontSize: 18, color: '#FF3B30' },
  question: { fontSize: 18, marginBottom: 20 },
  option: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  optionText: { fontSize: 16 },
  skipButton: { marginTop: 20, alignItems: 'center' },
  skipText: { color: '#007AFF', fontSize: 16 },
});
