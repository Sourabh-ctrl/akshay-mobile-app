import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { lookupString, getRelativeTimelineStringRepresentation } from "../utils";
import WinCard from "../components/WinCard";

export default function Day({ t, targetDayData, onBack, onViewWin }) {
  const { textPrimary, textTertiary, accentBase } = t;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="chevron-left" size={16} color={accentBase} />
          <Text style={[styles.backText, { color: accentBase }]}>{lookupString("back")}</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.label, { color: textTertiary }]}>Victory Journal</Text>
          <Text style={[styles.heading, { color: textPrimary }]}>
            {targetDayData.month !== null
              ? `${lookupString("months")[targetDayData.month]} ${targetDayData.day}`
              : ""}
          </Text>
          <Text style={[styles.count, { color: accentBase }]}>
            {targetDayData.dayWins.length} victories
          </Text>
        </View>

        <View style={styles.list}>
          {targetDayData.dayWins.map((win, idx) => (
            <WinCard
              key={win.id}
              win={win}
              idx={idx}
              t={t}
              onPress={() => onViewWin(win.id, "day")}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120, gap: 0 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 24 },
  backText: { fontSize: 14, fontWeight: "500" },
  header: { gap: 4, marginBottom: 24 },
  label: { fontSize: 10, textTransform: "uppercase", letterSpacing: 3, fontWeight: "700" },
  heading: { fontSize: 28, fontWeight: "300", lineHeight: 36 },
  count: { fontSize: 14, fontWeight: "700" },
  list: { gap: 12 },
});
