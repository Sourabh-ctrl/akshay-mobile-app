import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { lookupString } from "../utils";
import WinCard from "../components/WinCard";

export default function Search({
  t, wins, allTags,
  searchQuery, setSearchQuery,
  searchFilterTag, setSearchFilterTag,
  activeSearchFilteredWins,
  onViewWin,
}) {
  const {
    textPrimary, textSecondary, textTertiary,
    cardBgSolid, borderColor,
    accentBase, accentBg, accentBorder, invertText,
  } = t;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Fixed header + search */}
        <View style={[styles.headerArea, { paddingHorizontal: 24, paddingTop: 60 }]}>
          <Text style={[styles.label, { color: textTertiary }]}>Victory Journal</Text>
          <Text style={[styles.heading, { color: textPrimary }]}>
            Find a <Text style={{ fontStyle: "italic", fontWeight: "400", color: accentBase }}>win.</Text>
          </Text>

          {/* Search input */}
          <View style={[styles.searchBox, { backgroundColor: cardBgSolid, borderColor }]}>
            <Feather name="search" size={18} color={textTertiary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: textPrimary }]}
              placeholder={lookupString("search_ph")}
              placeholderTextColor={textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoComplete="off"
              autoCapitalize="none"
            />
            {!!searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.6}>
                <Feather name="x" size={18} color={textTertiary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Tag filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
            <View style={styles.tagRow}>
              <TouchableOpacity
                onPress={() => setSearchFilterTag(null)}
                style={[styles.tagBtn, {
                  backgroundColor: !searchFilterTag ? accentBase : cardBgSolid,
                  borderColor: !searchFilterTag ? accentBase : borderColor,
                }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagBtnText, { color: !searchFilterTag ? invertText : textSecondary, fontWeight: !searchFilterTag ? "700" : "400" }]}>
                  All
                </Text>
              </TouchableOpacity>
              {allTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setSearchFilterTag(tag)}
                  style={[styles.tagBtn, {
                    backgroundColor: searchFilterTag === tag ? accentBase : cardBgSolid,
                    borderColor: searchFilterTag === tag ? accentBase : borderColor,
                  }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tagBtnText, { color: searchFilterTag === tag ? invertText : textSecondary, fontWeight: searchFilterTag === tag ? "700" : "400" }]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={[styles.countText, { color: textSecondary }]}>
            {searchQuery.trim()
              ? `${activeSearchFilteredWins.length} result${activeSearchFilteredWins.length !== 1 ? "s" : ""}`
              : `${activeSearchFilteredWins.length} ${activeSearchFilteredWins.length === 1 ? "victory" : "victories"}`}
          </Text>
        </View>

        {/* Results list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeSearchFilteredWins.length ? (
            activeSearchFilteredWins.slice(0, 20).map((win, idx) => (
              <WinCard key={win.id} win={win} idx={idx} t={t} onPress={() => onViewWin(win.id, "search")} />
            ))
          ) : (
            <View style={[styles.emptyBox, { borderColor }]}>
              <Text style={[styles.emptyText, { color: textTertiary }]}>{lookupString("no_wins_search")}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerArea: { gap: 12 },
  label: { fontSize: 10, textTransform: "uppercase", letterSpacing: 3, fontWeight: "700" },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  searchBox: {
    flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 4,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "300", paddingVertical: 14 },
  tagScroll: { marginHorizontal: -24 },
  tagRow: { flexDirection: "row", gap: 8, paddingHorizontal: 24, paddingVertical: 4 },
  tagBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  tagBtnText: { fontSize: 12 },
  countText: { fontSize: 12, letterSpacing: 1, marginBottom: 4 },
  listContainer: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 120, gap: 12 },
  emptyBox: { borderWidth: 1, borderStyle: "dashed", borderRadius: 20, paddingVertical: 48, alignItems: "center" },
  emptyText: { fontSize: 13, fontWeight: "300" },
});
