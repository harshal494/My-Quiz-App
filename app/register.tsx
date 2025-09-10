import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useUser } from "./context/UserContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUser();

  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (username && identifier && password) {
      setUser({
        username,
        email: identifier.includes("@") ? identifier : undefined,
        provider: "local",
      });
      router.push("/screens/home");
    }
  };

  return (
    <LinearGradient colors={["#00f2fe", "#4facfe"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Email or Mobile"
            value={identifier}
            onChangeText={setIdentifier}
            style={styles.input}
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/")}>
            <Text style={styles.switchText}>
              Already a user? <Text style={styles.switchLink}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "85%",
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backdropFilter: "blur(10px)",
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#00c6ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  switchText: { textAlign: "center", marginTop: 10, color: "#333" },
  switchLink: { color: "#00c6ff", fontWeight: "bold" },
});
