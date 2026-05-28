import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";

export default function Spiral({ t, spiralWin, onNext, onBack }) {
  const {
    textPrimary, textSecondary, textTertiary,
    cardBgSolid, borderColor, accentBase,
    spiralEvidenceBg, spiralEvidenceBorder,
  } = t;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={[styles.evidenceLabel, { color: accentBase }]}>EVIDENCE</Text>
          <Text style={[styles.heading, { color: textPrimary }]}>
            You've done{"\n"}
            <Text style={{ fontStyle: "italic", fontWeight: "400", color: accentBase }}>hard things.</Text>
          </Text>
          <Text style={[styles.sub, { color: textTertiary }]}>From your own record. Read it slowly.</Text>
        </View>

        <View style={[styles.evidenceCard, { backgroundColor: spiralEvidenceBg, borderColor: spiralEvidenceBorder }]}>
          <Text style={[styles.evidenceText, { color: textPrimary }]}>"{spiralWin.text}"</Text>
          {!!spiralWin.details && (
            <Text style={[styles.evidenceDetails, { color: accentBase }]}>
              {spiralWin.details.toUpperCase()}
            </Text>
          )}
        </View>

        <View style={[styles.reflectCard, { backgroundColor: cardBgSolid, borderColor }]}>
          <Text style={[styles.reflectLabel, { color: accentBase }]}>REFLECT</Text>
          <Text style={[styles.reflectText, { color: textSecondary }]}>{spiralWin.anchor}</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onNext}
            style={[styles.nextBtn, { backgroundColor: cardBgSolid, borderColor }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.nextBtnText, { color: textPrimary }]}>Show me another →</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.6}>
            <Text style={[styles.backBtnText, { color: textTertiary }]}>I'M GROUNDED — TAKE ME BACK</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120, gap: 24 },
  headerBlock: { gap: 8 },
  evidenceLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  heading: { fontSize: 30, fontWeight: "800", lineHeight: 38 },
  sub: { fontSize: 12, fontWeight: "300" },
  evidenceCard: {
    padding: 24, borderRadius: 24, borderWidth: 1, minHeight: 140,
    alignItems: "center", justifyContent: "center", gap: 12,
  },
  evidenceText: { fontSize: 18, fontStyle: "italic", fontWeight: "300", lineHeight: 28, textAlign: "center" },
  evidenceDetails: { fontSize: 10, fontWeight: "700", letterSpacing: 2, textAlign: "center" },
  reflectCard: { padding: 20, borderRadius: 20, borderWidth: 1, gap: 8 },
  reflectLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  reflectText: { fontSize: 14, fontWeight: "300", lineHeight: 22, fontStyle: "italic" },
  footer: { gap: 12, marginTop: 8 },
  nextBtn: { paddingVertical: 20, borderRadius: 20, borderWidth: 1, alignItems: "center" },
  nextBtnText: { fontSize: 14, fontWeight: "500" },
  backBtn: { paddingVertical: 14, alignItems: "center" },
  backBtnText: { fontSize: 10, letterSpacing: 2, fontWeight: "500" },
});
