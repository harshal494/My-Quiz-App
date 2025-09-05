import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const isWeb = Platform.OS === "web";
const storage = {
  getItem: async (k: string) =>
    isWeb ? Promise.resolve(window.localStorage.getItem(k)) : AsyncStorage.getItem(k),
  setItem: async (k: string, v: string) =>
    isWeb ? Promise.resolve(window.localStorage.setItem(k, v)) : AsyncStorage.setItem(k, v),
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    setTimeout(async () => {
      try {
        const raw = await storage.getItem("user");
        if (!raw) {
          setError("No registered user found. Please register first.");
          setLoading(false);
          return;
        }
        const user = JSON.parse(raw);
        if (user.email === email.trim().toLowerCase() && user.password === password) {
          await storage.setItem("loggedIn", "true");
          setLoading(false);
          router.replace("/home");
        } else {
          setError("Invalid email or password.");
          setLoading(false);
        }
      } catch {
        setError("Something went wrong. Try again.");
        setLoading(false);
      }
    }, 900);
  };

  const fakeSocialLogin = async (provider: string) => {
    setLoading(true);
    setTimeout(async () => {
      await storage.setItem("loggedIn", "true");
      await storage.setItem("provider", provider);
      setLoading(false);
      router.replace("/home");
    }, 900);
  };

  const webBlurStyle = isWeb ? { backdropFilter: "blur(12px)" } : {};

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
      <View style={styles.wrapper}>
        <View style={[styles.card, webBlurStyle]}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Sign in with your account</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(0,0,0,0.5)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {loading ? (
            <ActivityIndicator size="large" color="#333" style={{ marginVertical: 12 }} />
          ) : (
            <>
              <Pressable onPress={handleLogin} style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Login</Text>
              </Pressable>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
              </View>

              {/* Google */}
              <Pressable
                onPress={() => fakeSocialLogin("google")}
                style={[styles.socialBtn, { backgroundColor: "#DB4437" }]}
              >
                <Image
                  source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
                  style={styles.icon}
                />
                <Text style={styles.socialText}>Continue with Google</Text>
              </Pressable>

              {/* Facebook */}
              <Pressable
                onPress={() => fakeSocialLogin("facebook")}
                style={[styles.socialBtn, { backgroundColor: "#1877F2" }]}
              >
                <Image
                  source={{ uri: "https://img.icons8.com/fluency/48/facebook-new.png" }}
                  style={styles.icon}
                />
                <Text style={styles.socialText}>Continue with Facebook</Text>
              </Pressable>
            </>
          )}

          <Pressable onPress={() => router.push("/register")} style={styles.linkBtn}>
            <Text style={styles.link}>New user? Register here</Text>
          </Pressable>
        </View>

        {/* 📢 Google Ads Placeholder */}
        <View style={styles.adBox}>
          <Text style={styles.adText}>[ Your Ad Here ]</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  wrapper: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.75)",
    padding: 25,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 6, textAlign: "center", color: "#222" },
  subtitle: { fontSize: 14, color: "#444", marginBottom: 14, textAlign: "center" },
  input: {
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
  primaryBtn: {
    backgroundColor: "#764ba2",
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 16 },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  divider: { flex: 1, height: 1, backgroundColor: "#aaa" },
  dividerText: { marginHorizontal: 8, color: "#444" },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  socialText: { color: "#fff", fontWeight: "700", marginLeft: 10 },
  icon: { width: 22, height: 22 },
  linkBtn: { marginTop: 12, alignItems: "center" },
  link: { color: "#667eea", fontWeight: "700", textDecorationLine: "underline" },

  // 📢 Ad Box
  adBox: {
    marginTop: 20,
    width: "90%",
    maxWidth: 400,
    height: 60,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
  },
  adText: { color: "#444", fontWeight: "600" },
});
