import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Onboarding1({ t, onNext }) {
  const { accentBase, accentBg, accentBorder, accentGrad, invertText, textSecondary, textPrimary } = t;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.badge, { backgroundColor: accentBg, borderColor: accentBorder }]}>
            <Text style={[styles.badgeText, { color: accentBase }]}>VICTORY JOURNAL</Text>
          </View>
          <Text style={[styles.heading, { color: textPrimary }]}>
            Your Victories,{"\n"}
            <Text style={{ color: accentBase, fontStyle: "italic", fontWeight: "400" }}>Remembered.</Text>
          </Text>
          <Text style={[styles.body, { color: textSecondary }]}>
            Every time something works — big or small — you record it.{"\n\n"}
            Over time, you build{" "}
            <Text style={{ fontWeight: "500", color: textPrimary }}>your own proof</Text>
            {" "}that you're capable. When doubt arrives, you read your own record — not a stranger's story.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onNext} activeOpacity={0.85} style={{ width: "100%" }}>
            <LinearGradient
              colors={Array.isArray(accentGrad) ? accentGrad : [accentBase, accentBase]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.btn}
            >
              <Text style={[styles.btnText, { color: invertText }]}>Open my book  →</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={[styles.sparkle, { color: accentBorder }]}>✦</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, justifyContent: "space-between" },
  content: { flex: 1, justifyContent: "center", gap: 24 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  heading: { fontSize: 38, fontWeight: "800", lineHeight: 46 },
  body: { fontSize: 16, lineHeight: 26, fontWeight: "300" },
  footer: { paddingTop: 24, gap: 20, alignItems: "center" },
  btn: { borderRadius: 24, paddingVertical: 20, alignItems: "center" },
  btnText: { fontSize: 16, fontWeight: "700" },
  sparkle: { fontSize: 20 },
});
