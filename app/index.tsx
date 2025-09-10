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
import { FontAwesome } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Toast.show({
        type: "error",
        text1: "Missing details",
        text2: "Enter email/phone and password",
      });
      return;
    }

    setLoading(true);
    const stored = await AsyncStorage.getItem("user");
    setTimeout(() => {
      setLoading(false);
      if (stored) {
        const user = JSON.parse(stored);
        if (
          (identifier === user.identifier || identifier === user.username) &&
          password === user.password
        ) {
          Toast.show({
            type: "success",
            text1: "Welcome back 👋",
            text2: `Logged in as ${user.username}`,
          });
        
          // ✅ FIX: push instead of replace + shorter delay
          setTimeout(() => {
            router.push("./home");
          }, 1000);
        
        } else {
          Toast.show({
            type: "error",
            text1: "Invalid credentials ❌",
            text2: "Check your email/phone and password",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "No account found",
          text2: "Please register first",
        });
      }
    }, 1000);
  };

  const fakeSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: `${provider} Login successful 🎉`,
      });
      setTimeout(() => router.replace("/screens/home"), 1000);
    }, 1200);
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>
          

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

          

          {loading ? (
            <ActivityIndicator size="large" color="#333" />
          ) : (
            <Pressable onPress={handleLogin} style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Login</Text>
            </Pressable>
          )}

{/* <Pressable
  onPress={() => router.push("/home")}
  style={{ marginTop: 20, padding: 10, backgroundColor: "red" }}
>
  <Text style={{ color: "#fff" }}>Go to Home (Test)</Text>
</Pressable> */}


          {/* Forgot Password */}
          <Pressable onPress={() => router.push("/forgot-password")} style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Google */}
          <Pressable
            onPress={() => fakeSocialLogin("Google")}
            style={[styles.socialBtn, { backgroundColor: "#fff" }]}
          >
            <FontAwesome name="google" size={20} color="#DB4437" />
            <Text style={[styles.socialText, { color: "#DB4437" }]}>
              Sign in with Google
            </Text>
          </Pressable>

          {/* Facebook */}
          <Pressable
            onPress={() => fakeSocialLogin("Facebook")}
            style={[styles.socialBtn, { backgroundColor: "#1877F2" }]}
          >
            <FontAwesome name="facebook" size={20} color="#fff" />
            <Text style={[styles.socialText, { color: "#fff" }]}>
              Sign in with Facebook
            </Text>
          </Pressable>

          {/* Register Link */}
          <Pressable onPress={() => router.replace("/register")} style={styles.linkBtn}>
            <Text style={styles.link}>Not a user? Register</Text>
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
  forgotBtn: { alignItems: "center", marginBottom: 15 },
  forgotText: { color: "#667eea", fontWeight: "700", textDecorationLine: "underline" },
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
