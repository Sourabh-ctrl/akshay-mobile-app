import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Onboarding2({ t, nameInput, setNameInput, onComplete }) {
  const {
    accentBase, accentBg, accentBorder, accentGrad,
    invertText, textPrimary, textSecondary, textTertiary,
    cardBgSolid, borderColor,
  } = t;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={[styles.badge, { backgroundColor: accentBg, borderColor: accentBorder }]}>
              <Text style={[styles.badgeText, { color: accentBase }]}>VICTORY JOURNAL</Text>
            </View>
            <Text style={[styles.heading, { color: textPrimary }]}>
              What should{"\n"}we call you?
            </Text>
            <Text style={[styles.sub, { color: textSecondary }]}>Your journal knows your name.</Text>
            <TextInput
              style={[styles.input, { backgroundColor: cardBgSolid, borderColor, color: textPrimary }]}
              placeholder="Your name…"
              placeholderTextColor={textTertiary}
              value={nameInput}
              onChangeText={setNameInput}
              onSubmitEditing={onComplete}
              returnKeyType="done"
              maxLength={32}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onComplete} activeOpacity={0.85} style={{ width: "100%" }}>
              <LinearGradient
                colors={Array.isArray(accentGrad) ? accentGrad : [accentBase, accentBase]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.btn}
              >
                <Text style={[styles.btnText, { color: invertText }]}>Open my journal  ✦</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={onComplete} style={styles.skipBtn} activeOpacity={0.6}>
              <Text style={[styles.skipText, { color: textTertiary }]}>SKIP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, justifyContent: "space-between" },
  content: { flex: 1, justifyContent: "center", gap: 16 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  heading: { fontSize: 30, fontWeight: "800", lineHeight: 38 },
  sub: { fontSize: 14, fontWeight: "300" },
  input: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 18, fontSize: 16, marginTop: 8 },
  footer: { paddingTop: 24, gap: 12, alignItems: "center" },
  btn: { borderRadius: 24, paddingVertical: 20, alignItems: "center" },
  btnText: { fontSize: 16, fontWeight: "700" },
  skipBtn: { paddingVertical: 10 },
  skipText: { fontSize: 11, letterSpacing: 2, fontWeight: "500" },
});
