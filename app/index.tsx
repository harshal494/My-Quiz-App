import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* -------------------- Button: Green → Yellow -------------------- */
type ButtonGYProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
};

const ButtonGY: React.FC<ButtonGYProps> = ({ children, onPress, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        android_ripple={{
          color: "rgba(250,204,21,0.25)",
          borderless: false,
          foreground: false,
        }}
        style={({ pressed }) => [
          styles.btnWrap,
          pressed && Platform.OS === "ios" ? styles.btnPressedShadow : null,
        ]}
      >
        <LinearGradient
          colors={["rgb(34,197,94)", "rgb(250,204,21)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnGrad}
        >
          <Text style={styles.btnText}>{children}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

/* -------------------- Generic Card -------------------- */
const Card: React.FC<{
  title?: string;
  badge?: "FREE" | "PREMIUM";
  children?: React.ReactNode;
}> = ({ title, badge, children }) => {
  return (
    <View style={styles.card}>
      {title ? (
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle}>{title}</Text>
          {badge ? (
            <View
              style={[
                styles.chip,
                badge === "FREE" ? styles.chipFree : styles.chipPremium,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  badge === "FREE" ? styles.chipTextFree : styles.chipTextPremium,
                ]}
              >
                {badge}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
};

/* -------------------- Bottom Floating CTA -------------------- */
const BottomCTA: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.bottomBar,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <ButtonGY style={styles.bottomBtn} onPress={onPress}>
        Get Started →
      </ButtonGY>
    </View>
  );
};

/* -------------------- Screen -------------------- */
const LearnScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.page}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topbar}>
        <View style={styles.brand}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>L</Text>
          </View>
          <Text style={styles.brandName}>LearnApp</Text>
        </View>
        <View style={{ marginLeft: "auto" }}>
          {/* optional right icons slot to match screenshot */}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          // Add space so content never hides behind the bottom CTA
          { paddingBottom: 140 + insets.bottom },
        ]}
      >
        {/* Hero */}
        <LinearGradient
          colors={["#3b82f6", "#22c55e", "#a855f7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.hero}
        >
          <View>
            <Text style={styles.heroTitle}>Hey there, Champ! 🚀✨</Text>
            <Text style={styles.heroSub}>Time to level up your skills! 🔥</Text>
          </View>
        </LinearGradient>

        {/* Quick Test */}
        <Card title="Quick Test">
          <Text style={styles.muted}>
            Earn XP, boost leaderboard, unlock badges
          </Text>
          <ButtonGY style={{ marginTop: 12 }} onPress={() => router.push("/trial_quiz/trialQuiz")}>Start Quick Test →</ButtonGY>
        </Card>

        {/* Free & Premium - two-up */}
        <View style={styles.twoCol}>
          <Card title="Free Test" badge="FREE">
            <Text style={styles.muted}>Basic questions, limited access</Text>
            <ButtonGY style={{ marginTop: 12 }} onPress={() => router.push("/trial_quiz/trialQuiz")}>Start Free Test</ButtonGY>
          </Card>

          <Card title="Premium Test" badge="PREMIUM">
            <Text style={styles.muted}>
              Advanced questions, unlimited access
            </Text>
            <ButtonGY
              style={{ marginTop: 12 }}
              onPress={() => router.replace("/login")}
            >
              Start Premium Test
            </ButtonGY>
          </Card>
        </View>

        {/* Quote */}
        <Card>
          <Text style={styles.quote}>
            “Success is the sum of small efforts repeated day in and day out.”
          </Text>
        </Card>
      </ScrollView>

      {/* Floating Get Started CTA */}
      <BottomCTA onPress={() => router.replace("/login")} />
    </View>
  );
};

export default LearnScreen;

/* -------------------- Styles -------------------- */
const TOKENS = {
  bg: "#0b1220",
  panel: "#0e1626",
  card: "#111a2c",
  border: "rgba(255,255,255,0.08)",
  muted: "rgba(255,255,255,0.70)",
  white: "#fff",
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: TOKENS.bg },
  topbar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#0b74ff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.border,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#1f3c8a",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: TOKENS.white, fontWeight: "700" },
  brandName: { color: TOKENS.white, fontWeight: "700", marginLeft: 8 },
  container: { padding: 16, gap: 16 },
  hero: { borderRadius: 14, padding: 18 },
  heroTitle: { color: TOKENS.white, fontSize: 20, fontWeight: "800" },
  heroSub: { color: TOKENS.white, opacity: 0.9, marginTop: 4 },
  card: {
    backgroundColor: TOKENS.card,
    borderWidth: 1,
    borderColor: TOKENS.border,
    borderRadius: 14,
    padding: 16,
  },
  cardHead: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { color: TOKENS.white, fontSize: 16, fontWeight: "700" },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 11, fontWeight: "700" },
  chipFree: { borderColor: "rgba(34,197,94,0.35)" },
  chipPremium: { borderColor: "rgba(96,165,250,0.35)" },
  chipTextFree: { color: "rgb(34,197,94)" },
  chipTextPremium: { color: "rgb(96,165,250)" },
  muted: { color: TOKENS.muted, marginTop: 2 },
  twoCol: { gap: 16 },
  quote: { color: "#d1d5db", textAlign: "center", fontStyle: "italic" },

  // Button
  btnWrap: { borderRadius: 12, overflow: "hidden" },
  btnGrad: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22c55e",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnText: { color: "#0a0f1d", fontWeight: "800", fontSize: 15 },
  btnPressedShadow: { shadowOpacity: 0.5, shadowRadius: 16 },

  // Bottom floating CTA
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  bottomBtn: {
    minWidth: 260,
    marginBottom: 4,
  },
});
