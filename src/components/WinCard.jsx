import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getRelativeTimelineStringRepresentation } from "../utils";

export default function WinCard({ win, idx, t, onPress, numberOfLines = 3 }) {
  const { bentoColors, bentoBorders, textTertiary, textPrimary, accentBase, accentBg, accentBorder } = t;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, {
        backgroundColor: bentoColors[idx % 5],
        borderColor: bentoBorders[idx % 5],
      }]}
      activeOpacity={0.75}
    >
      <View style={styles.row}>
        <Text style={[styles.date, { color: textTertiary }]}>
          {getRelativeTimelineStringRepresentation(win.date)}
        </Text>
        {win.tag && (
          <View style={[styles.badge, { backgroundColor: accentBg, borderColor: accentBorder }]}>
            <Text style={[styles.badgeText, { color: accentBase }]}>
              {win.tag.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={[styles.text, { color: textPrimary }]}
        numberOfLines={numberOfLines}
      >
        {win.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20, borderRadius: 28, borderWidth: 1,
    marginBottom: 0,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  date: { fontSize: 11, letterSpacing: 1.5, fontWeight: "500", textTransform: "uppercase" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  text: { fontSize: 16, fontWeight: "400", fontStyle: "italic", lineHeight: 26 },
});
