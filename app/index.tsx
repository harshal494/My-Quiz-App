import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // 🔹 Check against credentials saved from Register page
  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    setTimeout(async () => {
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
    }, 1200); // simulate API delay
  };

  // 🔹 Fake Google/Facebook login
  const fakeSocialLogin = async (provider: string) => {
    setLoading(true);
    setTimeout(async () => {
      await storage.setItem("loggedIn", "true");
      await storage.setItem("provider", provider);
      setLoading(false);
      router.replace("/home");
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 15 }} />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Sign-In (Fake for now) */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
              onPress={() => fakeSocialLogin("google")}
            >
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Facebook Sign-In (Fake for now) */}
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
              onPress={() => fakeSocialLogin("facebook")}
            >
              <Text style={styles.socialButtonText}>Sign in with Facebook</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>New user? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f6ff", padding: 20 },
  card: {
    width: "100%",
    maxWidth: isWeb ? 400 : 380,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 8, textAlign: "center", color: "#333" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 12, backgroundColor: "#f9f9f9" },
  error: { color: "#D32F2F", marginBottom: 10, textAlign: "center" },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, marginBottom: 12 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "bold" },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 15 },
  divider: { flex: 1, height: 1, backgroundColor: "#ccc" },
  dividerText: { marginHorizontal: 8, color: "#666" },
  socialButton: { padding: 15, borderRadius: 10, marginBottom: 12 },
  socialButtonText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "bold" },
  link: { color: "#007BFF", marginTop: 10, textAlign: "center", fontSize: 15 },
});
