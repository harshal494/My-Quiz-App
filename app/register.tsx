import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setOk(null);

    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const user = { name: name.trim(), email: email.trim().toLowerCase(), password };
      await storage.setItem("user", JSON.stringify(user));
      setOk("Account created! You can login now.");
      // Small delay so the success message is visible
      setTimeout(() => router.replace("/"), 500);
    } catch {
      setError("Could not save user. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} value={confirm} onChangeText={setConfirm} />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {ok ? <Text style={styles.success}>{ok}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Creating..." : "Register"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.link}>Already have an account? Login</Text>
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
  success: { color: "#1B5E20", marginBottom: 10, textAlign: "center" },
  button: { backgroundColor: "#28A745", padding: 15, borderRadius: 10, marginTop: 4, marginBottom: 10 },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "bold" },
  link: { color: "#007BFF", marginTop: 10, textAlign: "center", fontSize: 15 },
});
