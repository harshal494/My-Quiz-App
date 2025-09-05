import { Stack } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={[styles.toast, { borderLeftColor: "#4CAF50" }]}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={[styles.toast, { borderLeftColor: "#F44336" }]}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  toast: {
    borderLeftWidth: 6,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  text2: {
    fontSize: 14,
    color: "#555",
  },
});
