// app/screens/profile.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Animated } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context/UserContext";

const TOKENS = {
  bg: "#0b1220",
  card: "#111a2c",
  border: "rgba(255,255,255,0.08)",
  white: "#fff",
  muted: "rgba(255,255,255,0.7)",
};

const Badge: React.FC<{ type: "premium" | "normal" }> = ({ type }) => {
  const prem = type === "premium";
  return (
    <View style={[styles.badge, prem ? styles.badgePremium : styles.badgeNormal]}>
      <Text style={styles.badgeText}>{prem ? "Premium" : "Normal"}</Text>
    </View>
  );
};

const StatBox: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [avatar, setAvatar] = useState<string | null>(user?.avatarUri ?? null);
  const [points] = useState<number>(1260);
  const [membership] = useState<"premium" | "normal">("premium");

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setAvatar(uri);
      await AsyncStorage.setItem("avatarUri", uri);
      setUser?.({ ...(user ?? {}), avatarUri: uri });
    }
  };

  return (
    <Animated.View style={[styles.page, { opacity: fade }]}>
      <View style={styles.topbar}>
        <Text style={styles.brand}>LearnApp</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Card 1 */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Pressable onPress={pickImage} style={styles.avatarWrap}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <LinearGradient
                  colors={["#3b82f6", "#22c55e", "#a855f7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarFallback}>U</Text>
                </LinearGradient>
              )}
              <Text style={styles.changeText}>Change photo</Text>
            </Pressable>

            <View style={styles.rightCol}>
              <View style={styles.statsRow}>
                <StatBox label="Points" value={String(points)} />
                <View style={styles.membershipBox}>
                  <Text style={styles.memLabel}>Membership</Text>
                  <Badge type={membership} />
                </View>
              </View>

              <Pressable onPress={() => router.push("/screens/home")} style={styles.editBtn}>
                <Text style={styles.editText}>Edit Profile</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <Pressable style={styles.itemRow} onPress={() => router.push("../ProfileScreens/Contact")}>
            <Text style={styles.itemText}>Contact details</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.itemRow} onPress={() => router.push("../ProfileScreens/Memberships")}>
            <Text style={styles.itemText}>Memberships</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.itemRow} onPress={() => router.push("../ProfileScreens/History")}>
            <Text style={styles.itemText}>History (transactions)</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.itemRow} onPress={() => router.push("../ProfileScreens/About")}>
            <Text style={styles.itemText}>About</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        </View>

        {/* Card 3: Ad placeholder */}
        <View style={styles.card}>
          <View style={styles.adBox}>
            <Text style={styles.adText}>Google Ad • 320×100</Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: TOKENS.bg },
  topbar: {
    height: 56,
    backgroundColor: "#0b74ff",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.border,
  },
  brand: { color: TOKENS.white, fontWeight: "800", fontSize: 18 },
  container: { padding: 16, gap: 16 },

  card: {
    backgroundColor: TOKENS.card,
    borderWidth: 1,
    borderColor: TOKENS.border,
    borderRadius: 14,
    padding: 16,
  },

  row: { flexDirection: "row", gap: 16 },
  rightCol: { flex: 1, justifyContent: "space-between" },

  avatarWrap: { alignItems: "center", width: 110 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallback: { color: TOKENS.white, fontSize: 36, fontWeight: "800" },
  changeText: { color: TOKENS.muted, fontSize: 12, marginTop: 8 },

  statsRow: { flexDirection: "row", gap: 12 },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: TOKENS.border,
    borderRadius: 12,
    padding: 12,
  },
  statValue: { color: TOKENS.white, fontWeight: "800", fontSize: 18 },
  statLabel: { color: TOKENS.muted, marginTop: 2 },

  membershipBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: TOKENS.border,
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    gap: 6,
  },
  memLabel: { color: TOKENS.muted },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  badgePremium: { borderColor: "rgba(96,165,250,0.35)", backgroundColor: "rgba(37,99,235,0.15)" },
  badgeNormal: { borderColor: "rgba(34,197,94,0.35)", backgroundColor: "rgba(34,197,94,0.12)" },
  badgeText: { color: TOKENS.white, fontWeight: "700", fontSize: 12 },

  editBtn: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: "transparent",
    paddingVertical: 12,
    alignItems: "center",
  },
  editText: { color: TOKENS.white, fontWeight: "800" },

  sectionTitle: { color: TOKENS.white, fontWeight: "800", marginBottom: 8 },
  itemRow: { paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemText: { color: TOKENS.white },
  chev: { color: TOKENS.muted, fontSize: 18, marginLeft: 8 },
  divider: { height: 1, backgroundColor: TOKENS.border },

  adBox: {
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: TOKENS.border,
    backgroundColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  adText: { color: TOKENS.muted, fontWeight: "700" },
});
