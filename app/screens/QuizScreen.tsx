// app/screens/quiz.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Replace with dynamic questions if needed.
const questions = [
  { id: 1, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: '4' },
  { id: 2, question: 'Capital of France?', options: ['London', 'Berlin', 'Paris', 'Rome'], correct: 'Paris' },
  { id: 3, question: 'React is a ___ library?', options: ['UI', 'Database', 'Backend', 'OS'], correct: 'UI' },
];

const MAX_WIDTH = 720;         // centers on web without looking too wide
const TIMER_BOX_W = 120;       // digital timer box size like the screenshot
const TIMER_BOX_H = 56;
const LINE_W = 320;            // fixed width thin under‑timer progress line (blue)
const LINE_H = 2;

export default function QuizScreen() {
  const router = useRouter();
  const { testType } = useLocalSearchParams<{ testType?: string }>();

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(1800);

  // Selection + submit feedback
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrectSelected, setIsCorrectSelected] = useState<boolean | null>(null);

  // In-app toast (1-minute left)
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Timer background blink (color interpolation)
  const blinkAnim = useRef(new Animated.Value(0)).current; // 0 = base (black), 1 = red pulse
  const fastBlinkStarted = useRef(false);

  const total = questions.length;
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // Only support quick/free; redirect anything else (e.g., premium) to Home
  useEffect(() => {
    const t = (testType ?? 'quick').toString();
    if (t !== 'quick' && t !== 'free') {
      Alert.alert('Not supported', 'This page supports only Quick and Free tests.', [
        { text: 'OK', onPress: () => router.replace('/screens/home') },
      ]);
    }
  }, [testType, router]);

  const title = useMemo(() => {
    const base = (testType ?? 'quick').toString();
    const label = base.charAt(0).toUpperCase() + base.slice(1);
    return `${label} Test`;
  }, [testType]);

  const typeColor = useMemo(() => {
    if (testType === 'free') return '#34C759';
    return '#007AFF';
  }, [testType]);

  // Toast: “Only 1 min left”
  const showOneMinuteToast = () => {
    setShowToast(true);
    Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
          setShowToast(false);
        });
      }, 3000);
    });
  };

  // 5s pulse (before last minute)
  const pulseTimerBackground = (toRedDuration = 120, toBaseDuration = 120) => {
    Animated.sequence([
      Animated.timing(blinkAnim, { toValue: 1, duration: toRedDuration, useNativeDriver: false }),
      Animated.timing(blinkAnim, { toValue: 0, duration: toBaseDuration, useNativeDriver: false }),
    ]).start();
  };

  // Continuous fast blink in last minute
  const startFastBlink = () => {
    if (fastBlinkStarted.current) return;
    fastBlinkStarted.current = true;
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 0, duration: 150, useNativeDriver: false }),
      ])
    ).start();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev - 1;

        // Enter last minute
        if (prev === 61) {
          showOneMinuteToast();
          startFastBlink();
        }

        // Every 5 seconds (> 60s), blink timer background
        if (next > 60 && next % 5 === 0) {
          pulseTimerBackground();
        }

        // Time’s up -> Result (replace)
        if (prev <= 1) {
          clearInterval(interval);
          router.replace({ pathname: '/screens/ResultScreen', params: { score, total } });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router, score, total]);

  // Option select
  const handleOptionPress = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
  };

  // Proceed
  const goNext = () => {
    if (current + 1 < total) {
      setCurrent((c) => c + 1);
      setSelectedIndex(null);
      setSubmitted(false);
      setIsCorrectSelected(null);
    } else {
      router.replace({ pathname: '/screens/ResultScreen', params: { score, total } });
    }
  };

  // Submit & Next
  const handleSubmitNext = () => {
    if (selectedIndex === null) {
      Alert.alert('Choose an option', 'Please select an option before submitting.');
      return;
    }
    const correct = questions[current].correct;
    const chosen = questions[current].options[selectedIndex];
    const isRight = chosen === correct;

    setSubmitted(true);
    setIsCorrectSelected(isRight);
    if (isRight) setScore((s) => s + 1);

    setTimeout(goNext, 800);
  };

  const skipQuestion = () => {
    goNext();
  };

  const progress = (current + 1) / total;
  const inLastMinute = timer <= 60;

  // Animate timer box background from black -> red
  const timerBoxBg = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgb(0,0,0)', 'rgb(255,59,48)'], // use rgb strings for Animated color interpolation
  });

  // Thin under-timer blue progress line
  const lineFillW = Math.max(1, Math.floor(LINE_W * progress));

  return (
    <View style={styles.page}>
      {/* Top header */}
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <Ionicons name="school-outline" size={22} color="#fff" />
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="time-outline" size={18} color="#FF3B30" />
            <Text style={styles.headerRightText}>Timer</Text>
          </View>
        </View>
      </View>

      {/* Centered content, no outer borders */}
      <View style={styles.centerWrap}>
        {/* Type badge (Quick/Free only) */}
        <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
          <Text style={styles.typeBadgeText}>{(testType ?? 'quick').toString().toUpperCase()}</Text>
        </View>

        {/* Timer + thin progress line + question */}
        <View style={styles.promptWrap}>
          <Animated.View style={[styles.timerBox, { backgroundColor: timerBoxBg }]}>
            <Text style={styles.timerDigits}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </Animated.View>

          <View style={styles.lineWrap}>
            <View style={styles.lineTrack} />
            <View style={[styles.lineFill, { width: lineFillW }]} />
          </View>

          <Text style={styles.qText}>{`Q.${current + 1}  ${questions[current].question}`}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Options with selection and feedback */}
          {questions[current].options.map((option, i) => {
            const isSelected = selectedIndex === i;
            const showFeedback = submitted && isSelected && isCorrectSelected !== null;
            const bgColor = showFeedback
              ? isCorrectSelected
                ? '#34C759'
                : '#FF3B30'
              : isSelected
              ? '#f2f2f2'
              : '#fff';
            const textColor = showFeedback ? '#fff' : '#222';
            const borderColor = showFeedback ? (isCorrectSelected ? '#2fb451' : '#e02a20') : '#dfe6f9';

            return (
              <TouchableOpacity
                key={i}
                style={[styles.option, { backgroundColor: bgColor, borderColor }]}
                activeOpacity={0.9}
                onPress={() => handleOptionPress(i)}
                disabled={submitted}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                <Ionicons name="chevron-forward" size={18} color={showFeedback ? '#fff' : '#007AFF'} />
              </TouchableOpacity>
            );
          })}

          {/* Ad placeholder */}
          <View style={styles.adBox}>
            <Text style={styles.adText}>Ad Banner</Text>
          </View>
        </ScrollView>
      </View>

      {/* Footer (Skip + Submit & Next) */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <TouchableOpacity onPress={skipQuestion} style={[styles.footerButton, styles.footerGhost]}>
            <Text style={[styles.footerButtonText, { color: '#007AFF' }]}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmitNext} style={[styles.footerButton, { backgroundColor: '#34C759' }]}>
            <Text style={styles.footerButtonText}>Submit & Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* In-app toast */}
      {showToast && (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Ionicons name="alert-circle-outline" size={18} color="#fff" />
          <Text style={styles.toastText}>Only 1 min left</Text>
        </Animated.View>
      )}
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
  page: { flex: 1, backgroundColor: '#f4f6fc' },

  // Full-width top bar with centered inner
  header: { backgroundColor: '#007AFF' },
  headerInner: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerRightText: { marginLeft: 6, fontSize: 14, color: '#fff', fontWeight: '600' },

  // Center content on web
  centerWrap: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },

  // Badge
  typeBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  typeBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },

  // Prompt area (no outer borders)
  promptWrap: {
    marginTop: 18,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    ...CARD_SHADOW,
  },

  // Digital timer box
  timerBox: {
    width: TIMER_BOX_W,
    height: TIMER_BOX_H,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  timerDigits: {
    color: '#89f7b1',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,255,128,0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },

  // Thin progress line under timer (fixed width, blue)
  lineWrap: {
    width: LINE_W,
    height: LINE_H,
    position: 'relative',
    marginBottom: 12,
  },
  lineTrack: { position: 'absolute', left: 0, right: 0, height: LINE_H, backgroundColor: '#e2e8ff', borderRadius: 2 },
  lineFill: { position: 'absolute', left: 0, height: LINE_H, backgroundColor: '#007AFF', borderRadius: 2 },

  qText: { fontSize: 18, fontWeight: '700', color: '#1c1c1c' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 12 },

  option: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dfe6f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  optionText: { fontSize: 16, color: '#222' },

  adBox: {
    marginTop: 8,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#eef3ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  adText: { color: '#333', fontStyle: 'italic' },

  // Footer (Skip + Submit & Next)
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  footerInner: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  footerButtonText: { color: '#fff', fontWeight: '700' },
  footerGhost: { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#007AFF' },

  // In-app toast
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...CARD_SHADOW,
  },
  toastText: { color: '#fff', fontWeight: '700' },
});
