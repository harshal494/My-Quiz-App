import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isWeb = Platform.OS === "web";
const storage = {
  getItem: async (k: string) =>
    isWeb ? Promise.resolve(window.localStorage.getItem(k)) : AsyncStorage.getItem(k),
  setItem: async (k: string, v: string) =>
    isWeb ? Promise.resolve(window.localStorage.setItem(k, v)) : AsyncStorage.setItem(k, v),
  removeItem: async (k: string) =>
    isWeb ? Promise.resolve(window.localStorage.removeItem(k)) : AsyncStorage.removeItem(k),
};

export default function HomeScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const loggedIn = await storage.getItem("loggedIn");
      if (loggedIn !== "true") {
        router.replace("/");
      } else {
        setReady(true);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await storage.removeItem("loggedIn");
    router.replace("/");
  };

  if (!ready) return null; // avoid flicker while checking

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Welcome Home!</Text>
      <Text style={styles.subtitle}>You are logged in 🎉</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f6ff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#555", marginBottom: 30 },
  button: { backgroundColor: "#FF3B30", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
