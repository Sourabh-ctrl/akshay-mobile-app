import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView, Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { apiUrl } from "../lib/api";

export default function Profile({ t, user, wins, onBack, onLogout, onUpdateUser }) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    cardBgSolid, borderColor, accentBase, accentBg,
    accentGrad, invertText, dangerBg, dangerBorder,
  } = t;

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isGoogleUser = !!user?.picture;
  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const totalWins = wins.length;
  const thisWeek = wins.filter((w) => {
    const d = new Date(w.date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return d >= cutoff;
  }).length;
  const thisMonth = wins.filter((w) => {
    const d = new Date(w.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/auth/profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save."); return; }
      onUpdateUser(data);
      setEditingName(false);
    } catch {
      setError("Cannot reach server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="chevron-left" size={16} color={accentBase} />
          <Text style={[styles.backText, { color: accentBase }]}>Back</Text>
        </TouchableOpacity>

        <Text style={[styles.heading, { color: textPrimary }]}>Profile.</Text>

        {/* Identity card */}
        <View style={[styles.identityCard, {
          backgroundColor: colorMode === "dark" ? "rgba(0,230,153,0.04)" : cardBgSolid,
          borderColor: colorMode === "dark" ? "rgba(0,230,153,0.12)" : borderColor,
        }]}>
          {isGoogleUser ? (
            <Image source={{ uri: user.picture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: accentBase }]}>
              <Text style={[styles.avatarText, { color: colorMode === "dark" ? "#08090A" : "white" }]}>{initials}</Text>
            </View>
          )}
          <View style={styles.identityInfo}>
            <Text style={[styles.identityName, { color: textPrimary }]} numberOfLines={1}>
              {user?.name || "Victory Tracker"}
            </Text>
            <Text style={[styles.identityEmail, { color: textSecondary }]} numberOfLines={1}>
              {user?.email}
            </Text>
            {isGoogleUser && (
              <View style={styles.googleBadge}>
                <View style={styles.googleDot} />
                <Text style={[styles.googleBadgeText, { color: textTertiary }]}>Signed in with Google</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <Text style={[styles.sectionLabel, { color: textTertiary }]}>YOUR VICTORIES</Text>
        <View style={styles.statsRow}>
          {[["Total", totalWins], ["This month", thisMonth], ["This week", thisWeek]].map(([label, value]) => (
            <View key={label} style={[styles.statCard, {
              backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.02)" : cardBgSolid,
              borderColor,
            }]}>
              <Text style={[styles.statValue, { color: accentBase }]}>{value}</Text>
              <Text style={[styles.statLabel, { color: textTertiary }]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Name editor */}
        <View style={[styles.nameCard, {
          backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.02)" : cardBgSolid,
          borderColor,
        }]}>
          <View style={styles.nameCardHeader}>
            <View>
              <Text style={[styles.rowTitle, { color: textPrimary }]}>Display name</Text>
              {!editingName && (
                <Text style={[styles.rowSub, { color: textSecondary }]}>{user?.name || "Not set"}</Text>
              )}
            </View>
            {!editingName && (
              <TouchableOpacity
                onPress={() => { setNameInput(user?.name || ""); setEditingName(true); setError(""); }}
                style={[styles.editBtn, { backgroundColor: accentBg }]}
                activeOpacity={0.7}
              >
                <Feather name="edit-2" size={12} color={accentBase} />
                <Text style={[styles.editBtnText, { color: accentBase }]}> Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          {editingName && (
            <View style={styles.editForm}>
              <TextInput
                style={[styles.nameInput, {
                  backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
                  borderColor: colorMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
                  color: textPrimary,
                }]}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Your name"
                placeholderTextColor={textSecondary}
                onSubmitEditing={saveName}
                autoFocus
              />
              {!!error && <Text style={styles.errorText}>{error}</Text>}
              <View style={styles.editActions}>
                <LinearGradient
                  colors={Array.isArray(accentGrad) ? accentGrad : [accentBase, accentBase]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.saveBtn, { opacity: saving ? 0.7 : 1 }]}
                >
                  <TouchableOpacity onPress={saveName} disabled={saving} style={styles.btnInner} activeOpacity={0.8}>
                    <Feather name="check" size={14} color={colorMode === "dark" ? "#08090A" : "white"} />
                    <Text style={[styles.saveBtnText, { color: colorMode === "dark" ? "#08090A" : "white" }]}>
                      {saving ? "Saving…" : "Save"}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity
                  onPress={() => setEditingName(false)}
                  style={[styles.cancelBtn, { borderColor }]}
                  activeOpacity={0.7}
                >
                  <View style={styles.btnInner}>
                    <Feather name="x" size={14} color={textSecondary} />
                    <Text style={[styles.cancelBtnText, { color: textSecondary }]}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {joinDate && (
          <View style={styles.memberRow}>
            <Text style={[styles.memberLabel, { color: textTertiary }]}>Member since</Text>
            <Text style={[styles.memberValue, { color: textSecondary }]}>{joinDate}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={onLogout}
          style={[styles.signOutBtn, { backgroundColor: dangerBg, borderColor: dangerBorder }]}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={16} color="#E53E3E" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 24 },
  backText: { fontSize: 14, fontWeight: "500" },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 32 },
  identityCard: { flexDirection: "row", padding: 20, gap: 16, alignItems: "center", borderRadius: 24, borderWidth: 1, marginBottom: 24 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 20, fontWeight: "700" },
  identityInfo: { flex: 1 },
  identityName: { fontSize: 18, fontWeight: "700" },
  identityEmail: { fontSize: 14, marginTop: 2 },
  googleBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  googleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4285F4" },
  googleBadgeText: { fontSize: 11 },
  sectionLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700", marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: { flex: 1, paddingVertical: 16, paddingHorizontal: 8, borderRadius: 20, borderWidth: 1, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 11, marginTop: 4, textAlign: "center" },
  nameCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  nameCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  rowTitle: { fontSize: 14, fontWeight: "500" },
  rowSub: { fontSize: 13, marginTop: 4 },
  editBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { fontSize: 12, fontWeight: "600" },
  editForm: { marginTop: 12, gap: 8 },
  nameInput: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14 },
  errorText: { fontSize: 12, color: "#FC8181" },
  editActions: { flexDirection: "row", gap: 8 },
  saveBtn: { flex: 1, borderRadius: 10, overflow: "hidden" },
  cancelBtn: { flex: 1, borderRadius: 10, borderWidth: 1, overflow: "hidden" },
  btnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  saveBtnText: { fontSize: 13, fontWeight: "700" },
  cancelBtnText: { fontSize: 13 },
  memberRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4, marginBottom: 24 },
  memberLabel: { fontSize: 12 },
  memberValue: { fontSize: 12, fontWeight: "500" },
  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 20, borderRadius: 16, borderWidth: 1 },
  signOutText: { fontSize: 14, fontWeight: "500", color: "#E53E3E" },
});
