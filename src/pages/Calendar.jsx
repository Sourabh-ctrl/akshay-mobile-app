import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { lookupString } from "../utils";
import WinCard from "../components/WinCard";

export default function Calendar({
  t, wins, currentCalendarDate,
  onPrevMonth, onNextMonth,
  onViewWin, onViewDay,
}) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    bgBase, cardBgSolid, borderColor,
    accentBase, accentGrad, accentBg, accentBorder, invertText,
    cellEmptyBg, cellEmptyBorder,
    lvl1Bg, lvl1Border, lvl2Bg, lvl2Border, lvl3Bg, lvl3Border,
    calNavBg,
  } = t;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const today = new Date();

  const activityMap = {};
  wins.forEach((w) => {
    const d = new Date(w.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const k = d.getDate();
      activityMap[k] = (activityMap[k] || 0) + 1;
    }
  });

  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const activeMonthWins = wins.filter((w) => {
    const d = new Date(w.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const getCellStyle = (count, isToday) => {
    let bg = cellEmptyBg, border = cellEmptyBorder, color = textPrimary, fw = "400";
    if (count === 1) { bg = lvl1Bg; border = lvl1Border; color = accentBase; }
    if (count === 2) { bg = lvl2Bg; border = lvl2Border; }
    if (count >= 3) { bg = lvl3Bg; border = lvl3Border; color = invertText; fw = "700"; }
    return { bg, border, color, fw };
  };

  const handleDayPress = (d) => {
    const count = activityMap[d] || 0;
    if (!count) return;
    const dayWins = wins.filter((w) => {
      const wd = new Date(w.date);
      return wd.getFullYear() === year && wd.getMonth() === month && wd.getDate() === d;
    });
    if (dayWins.length === 1) {
      onViewWin(dayWins[0].id, "calendar");
    } else {
      onViewDay({ year, month, day: d, dayWins });
    }
  };

  const cells = [];

  // Day headers
  lookupString("days").forEach((day, i) => {
    cells.push(
      <View key={`hdr-${i}`} style={styles.cell}>
        <Text style={[styles.dayHeader, { color: textTertiary }]}>{day}</Text>
      </View>
    );
  });

  // Empty cells
  for (let e = 0; e < firstWeekDay; e++) {
    cells.push(<View key={`emp-${e}`} style={styles.cell} />);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const count = activityMap[d] || 0;
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const { bg, border, color, fw } = getCellStyle(count, isToday);
    cells.push(
      <TouchableOpacity
        key={`day-${d}`}
        onPress={() => handleDayPress(d)}
        activeOpacity={count > 0 ? 0.7 : 1}
        style={[styles.cell]}
      >
        <View style={[styles.dayCell, {
          backgroundColor: bg, borderColor: border,
          borderWidth: isToday ? 2 : 1,
          borderColor: isToday ? accentBase : border,
        }]}>
          {count > 1 && (
            <View style={[styles.badge, { backgroundColor: invertText, borderColor: lvl1Border }]}>
              <Text style={[styles.badgeText, { color: accentBase }]}>{count}</Text>
            </View>
          )}
          <Text style={[styles.dayNum, { color, fontWeight: fw }]}>{d}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.label, { color: textTertiary }]}>Victory Journal</Text>
          <Text style={[styles.heading, { color: textPrimary }]}>
            Your <Text style={{ fontStyle: "italic", fontWeight: "400", color: accentBase }}>timeline.</Text>
          </Text>
        </View>

        {/* Month nav */}
        <View style={[styles.monthNav, { backgroundColor: cardBgSolid, borderColor }]}>
          <TouchableOpacity onPress={onPrevMonth} style={[styles.navBtn, { backgroundColor: calNavBg }]} activeOpacity={0.7}>
            <Feather name="chevron-left" size={20} color={textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.monthLabel, { color: accentBase }]}>
            {lookupString("months")[month].toUpperCase()} {year}
          </Text>
          <TouchableOpacity onPress={onNextMonth} style={[styles.navBtn, { backgroundColor: calNavBg }]} activeOpacity={0.7}>
            <Feather name="chevron-right" size={20} color={textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          {cells}
        </View>

        {/* Month wins list */}
        <View style={[styles.monthTitle, { borderTopColor: borderColor }]}>
          <Text style={[styles.monthCount, { color: accentBase }]}>{activeMonthWins.length}</Text>
          <Text style={[styles.monthCountLabel, { color: textSecondary }]}>
            {" "}{activeMonthWins.length === 1 ? lookupString("victory") : lookupString("victories")} — {lookupString("months")[month]}
          </Text>
        </View>

        <View style={styles.list}>
          {activeMonthWins.length ? (
            activeMonthWins.map((win, idx) => (
              <WinCard key={win.id} win={win} idx={idx} t={t} onPress={() => onViewWin(win.id, "calendar")} />
            ))
          ) : (
            <View style={[styles.emptyBox, { borderColor }]}>
              <Text style={[styles.emptyText, { color: textTertiary }]}>{lookupString("no_wins_month")}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120, gap: 0 },
  header: { gap: 4, marginBottom: 20 },
  label: { fontSize: 10, textTransform: "uppercase", letterSpacing: 3, fontWeight: "700" },
  heading: { fontSize: 28, fontWeight: "800" },
  monthNav: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderRadius: 20, borderWidth: 1, padding: 8, marginBottom: 20,
  },
  navBtn: { borderRadius: 12, padding: 8 },
  monthLabel: { fontSize: 13, fontWeight: "700", letterSpacing: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  cell: { width: "14.28%", aspectRatio: 1, padding: 2 },
  dayHeader: { fontSize: 9, fontWeight: "600", letterSpacing: 1, textAlign: "center", textTransform: "uppercase" },
  dayCell: {
    flex: 1, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center", position: "relative",
  },
  dayNum: { fontSize: 13 },
  badge: {
    position: "absolute", top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  badgeText: { fontSize: 8, fontWeight: "700" },
  monthTitle: { flexDirection: "row", alignItems: "baseline", borderTopWidth: 1, paddingTop: 20, marginBottom: 16 },
  monthCount: { fontSize: 18, fontWeight: "800" },
  monthCountLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 2, fontWeight: "600" },
  list: { gap: 12 },
  emptyBox: { borderWidth: 1, borderStyle: "dashed", borderRadius: 20, paddingVertical: 32, alignItems: "center" },
  emptyText: { fontSize: 13, fontWeight: "300" },
});
