// app/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import { useUser } from "./context/UserContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUser();

  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !identifier || !password || !confirm) {
      Toast.show({
        type: "error",
        text1: "Missing details",
        text2: "Please fill all fields",
      });
      return;
    }
    if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: "Passwords don’t match",
        text2: "Re-enter the password",
      });
      return;
    }

    try {
      setLoading(true);

      // Store a simple user object for your Login page to read back
      const payload = {
        username,
        identifier, // can be email or mobile
        password,
      };
      await AsyncStorage.setItem("user", JSON.stringify(payload));

      // Optional: update in-memory context
      setUser({
        username,
        email: identifier.includes("@") ? identifier : undefined,
        provider: "local",
      });

      Toast.show({
        type: "success",
        text1: "Account created 🎉",
        text2: `Registered as ${username}`,
      });

      setTimeout(() => {
        // Go to the Login page to sign in
        router.replace("/login");
      }, 800);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
        text2: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="rgba(0,0,0,0.6)"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Email / Mobile"
            placeholderTextColor="rgba(0,0,0,0.6)"
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="rgba(0,0,0,0.6)"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="rgba(0,0,0,0.6)"
            style={styles.input}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <Pressable onPress={handleRegister} style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Register</Text>
            </Pressable>
          )}

          {/* Switch to Login */}
          <Pressable onPress={() => router.replace("/login")} style={styles.linkBtn}>
            <Text style={styles.link}>Already a user? Login</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  primaryBtn: {
    backgroundColor: "#764ba2",
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 12,
  },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  line: { flex: 1, height: 1, backgroundColor: "#aaa" },
  orText: { marginHorizontal: 10, color: "#555", fontWeight: "600" },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 6,
    justifyContent: "center",
    gap: 8,
  },
  socialText: { fontSize: 16, fontWeight: "600" },
  linkBtn: { marginTop: 15, alignItems: "center" },
  link: { color: "#667eea", fontWeight: "700", textDecorationLine: "underline" },
});
