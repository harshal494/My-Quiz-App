import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const isWeb = Platform.OS === "web";
const storage = {
  setItem: async (k: string, v: string) =>
    isWeb ? Promise.resolve(window.localStorage.setItem(k, v)) : AsyncStorage.setItem(k, v),
};

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      const user = { name, email: email.trim().toLowerCase(), password };
      await storage.setItem("user", JSON.stringify(user));
      await storage.setItem("loggedIn", "true");
      setLoading(false);
      router.replace("/home");
    }, 900);
  };

  const webBlurStyle = isWeb ? { backdropFilter: "blur(12px)" } : {};

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
      <View style={styles.wrapper}>
        <View style={[styles.card, webBlurStyle]}>
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create a new account</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="rgba(0,0,0,0.5)"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="rgba(0,0,0,0.5)"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(0,0,0,0.5)"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="rgba(0,0,0,0.5)"
            style={styles.input}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {loading ? (
            <ActivityIndicator size="large" color="#333" style={{ marginVertical: 12 }} />
          ) : (
            <Pressable onPress={handleRegister} style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Create Account</Text>
            </Pressable>
          )}

          <Pressable onPress={() => router.replace("/")} style={styles.linkBtn}>
            <Text style={styles.link}>Already have an account? Login here</Text>
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
