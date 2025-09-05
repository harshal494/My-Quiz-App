import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !identifier || !password || !confirm) {
      Toast.show({
        type: "error",
        text1: "Missing fields",
        text2: "Please fill all details",
      });
      return;
    }
    if (password !== confirm) {
      Toast.show({
        type: "error",
        text1: "Password mismatch",
        text2: "Confirm password must match",
      });
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const user = { username, identifier, password };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setLoading(false);

      Toast.show({
        type: "success",
        text1: "Registration successful 🎉",
        text2: "Please login now",
      });

      setTimeout(() => router.replace("/"), 1000);
    }, 1000);
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#444"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Email / Mobile"
            placeholderTextColor="#444"
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#444"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#444"
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

          <Pressable onPress={() => router.replace("/")} style={styles.linkBtn}>
            <Text style={styles.link}>Already a user? Login</Text>
          </Pressable>
        </View>
      </View>
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
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
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
    marginTop: 10,
  },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  linkBtn: { marginTop: 15, alignItems: "center" },
  link: { color: "#667eea", fontWeight: "700", textDecorationLine: "underline" },
});
