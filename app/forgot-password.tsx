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
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isWeb = Platform.OS === "web";
const storage = {
  getItem: async (k: string) =>
    isWeb ? Promise.resolve(window.localStorage.getItem(k)) : AsyncStorage.getItem(k),
  setItem: async (k: string, v: string) =>
    isWeb ? Promise.resolve(window.localStorage.setItem(k, v)) : AsyncStorage.setItem(k, v),
};

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<"identifier" | "otp" | "reset">("identifier");
  const [identifier, setIdentifier] = useState(""); // email or mobile
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const sendOtp = async () => {
    setError(null);
    setLoading(true);

    setTimeout(async () => {
      const raw = await storage.getItem("user");
      if (!raw) {
        setError("No registered user found.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(raw);
      if (user.identifier !== identifier.trim().toLowerCase()) {
        setError("Identifier not registered.");
        setLoading(false);
        return;
      }

      // Simulate OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      console.log("📩 OTP sent to", identifier, ":", otp); // simulate API
      setStep("otp");
      setLoading(false);

      // start resend cooldown (30s)
      setResendTimer(30);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setStep("reset");
    } else {
      setError("Invalid OTP.");
    }
  };

  const resetPassword = async () => {
    if (!newPass || newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }
    const raw = await storage.getItem("user");
    if (!raw) return;

    const user = JSON.parse(raw);
    const updated = { ...user, password: newPass };
    await storage.setItem("user", JSON.stringify(updated));

    alert("✅ Password reset successful! Please login again.");
    router.replace("/");
  };

  const webBlurStyle = isWeb ? { backdropFilter: "blur(12px)" } : {};

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
      <View style={styles.wrapper}>
        <View style={[styles.card, webBlurStyle]}>
          {step === "identifier" && (
            <>
              <Text style={styles.title}>Forgot Password</Text>
              <TextInput
                placeholder="Enter Email or Mobile"
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={styles.input}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />
              {error && <Text style={styles.error}>{error}</Text>}
              {loading ? (
                <ActivityIndicator size="large" color="#333" />
              ) : (
                <Pressable onPress={sendOtp} style={styles.primaryBtn}>
                  <Text style={styles.primaryText}>Send OTP</Text>
                </Pressable>
              )}
            </>
          )}

          {step === "otp" && (
            <>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>OTP has been sent and valid for 10 min</Text>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <Pressable onPress={verifyOtp} style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Verify OTP</Text>
              </Pressable>

              {resendTimer > 0 ? (
                <Text style={styles.timerText}>
                  Resend available in {resendTimer}s
                </Text>
              ) : (
                <Pressable onPress={sendOtp} style={styles.linkBtn}>
                  <Text style={styles.link}>Resend OTP</Text>
                </Pressable>
              )}
            </>
          )}

          {step === "reset" && (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <TextInput
                placeholder="New Password"
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={styles.input}
                secureTextEntry
                value={newPass}
                onChangeText={setNewPass}
              />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={styles.input}
                secureTextEntry
                value={confirmPass}
                onChangeText={setConfirmPass}
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <Pressable onPress={resetPassword} style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Reset Password</Text>
              </Pressable>
            </>
          )}
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
  subtitle: { fontSize: 15, marginBottom: 15, textAlign: "center" },
  input2: {
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  primaryBtn: {
    backgroundColor: "#764ba2",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  primaryText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  linkBtn: { marginTop: 12, alignItems: "center" },
  link: { color: "#667eea", fontWeight: "700", textDecorationLine: "underline" },
  timerText: { marginTop: 10, textAlign: "center", color: "#444" },
});
