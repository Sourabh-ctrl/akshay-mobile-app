import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView, Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  lookupString,
  renderFormattedTimelineHeaderString,
} from "../utils";
import WinCard from "../components/WinCard";

export default function Home({
  t,
  user,
  wins,
  stats,
  allTags,
  isRecording,
  liveText,
  setLiveText,
  textInputBox,
  handleManualTextInput,
  transcriptionStatus,
  isEditableMode,
  speechError,
  hasVoiceSupport,
  selectedTag,
  setSelectedTag,
  filterTag,
  setFilterTag,
  showCustomTagInput,
  setShowCustomTagInput,
  customTagInput,
  setCustomTagInput,
  showShareNudge,
  setShowShareNudge,
  activeDashboardFilteredWins,
  onClear,
  onSave,
  onAddCustomTag,
  onNavigate,
  onViewWin,
  onSpiral,
  onOpenShare,
}) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    cardBgSolid, borderColor,
    accentBase, accentGrad, accentBg, accentBorder,
    invertText, dangerBg, dangerBorder,
    antiSpiralBg, antiSpiralBorder, antiSpiralText,
    bentoColors, bentoBorders,
  } = t;

  const gradColors = Array.isArray(accentGrad) ? accentGrad : [accentBase, accentBase];

  const initials = user
    ? (user.name || user.email || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const showRecordingCard = isRecording || liveText || transcriptionStatus === "transcribing";
  const showManualInput = !isRecording && !liveText && !hasVoiceSupport;
  const showTagsAndActions = !isRecording && !!liveText;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.dateLabel, { color: textTertiary }]}>
                {renderFormattedTimelineHeaderString()}
              </Text>
              <Text style={[styles.heading, { color: textPrimary }]}>
                {user?.name ? `${user.name}'s Stack` : "Your Stack"}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => onNavigate("settings")}
                style={[styles.iconBtn, { backgroundColor: cardBgSolid, borderColor }]}
                activeOpacity={0.7}
              >
                <Feather name="settings" size={18} color={textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onNavigate("profile")}
                style={[styles.iconBtn, styles.avatarOuter, { backgroundColor: cardBgSolid, borderColor }]}
                activeOpacity={0.7}
              >
                <View style={[styles.avatarInner, { backgroundColor: accentBase }]}>
                  {user?.picture ? (
                    <Image source={{ uri: user.picture }} style={styles.avatarImg} />
                  ) : (
                    <Text style={[styles.avatarText, { color: colorMode === "dark" ? "#08090A" : "white" }]}>
                      {initials}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats bento */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardBlue, {
              backgroundColor: colorMode === "light" ? "#e0f2fe" : "rgba(56,189,248,0.18)",
              borderColor: colorMode === "dark" ? "rgba(56,189,248,0.25)" : borderColor,
            }]}>
              <Text style={[styles.statNum, { color: textPrimary }]}>{stats.total}</Text>
              <Text style={[styles.statLbl, { color: textSecondary }]}>{lookupString("stat_victories")}</Text>
              <Text style={styles.statEmoji}>🏆</Text>
            </View>
            <View style={[styles.statCard, styles.statCardPink, {
              backgroundColor: colorMode === "light" ? "#ffe4e8" : "rgba(251,113,133,0.18)",
              borderColor: colorMode === "dark" ? "rgba(251,113,133,0.25)" : borderColor,
            }]}>
              <Text style={[styles.statNum, { color: textPrimary }]}>{stats.week}</Text>
              <Text style={[styles.statLbl, { color: textSecondary }]}>{lookupString("stat_week")}</Text>
              <Text style={styles.statEmoji}>🔥</Text>
            </View>
          </View>
          <View style={[styles.statCardWide, {
            backgroundColor: colorMode === "light" ? "#e9e5ff" : "rgba(167,139,250,0.18)",
            borderColor: colorMode === "dark" ? "rgba(167,139,250,0.25)" : borderColor,
          }]}>
            <Text style={[styles.statNum, { color: textPrimary }]}>{stats.streak}</Text>
            <Text style={[styles.statLbl, { color: textSecondary }]}>{lookupString("stat_streak")}</Text>
            <Text style={styles.statEmoji}>⚡</Text>
          </View>

          {/* Grace banner */}
          {stats.grace && stats.streak > 0 && (
            <View style={[styles.graceBanner, { backgroundColor: accentBg, borderColor: accentBorder }]}>
              <Text style={[styles.graceBannerText, { color: accentBase }]}>{lookupString("grace")}</Text>
            </View>
          )}

          {/* Speech error */}
          {!!speechError && (
            <Text style={styles.speechError}>{speechError}</Text>
          )}

          {/* Manual text input (no voice, no live text) */}
          {showManualInput && (
            <TextInput
              style={[styles.manualInput, { backgroundColor: cardBgSolid, borderColor, color: textPrimary }]}
              placeholder="Write your win here…"
              placeholderTextColor={textTertiary}
              value={textInputBox}
              onChangeText={handleManualTextInput}
              multiline
              textAlignVertical="top"
            />
          )}

          {/* Recording / transcription card */}
          {showRecordingCard && (
            <View style={[styles.recordCard, {
              backgroundColor: isRecording
                ? colorMode === "light" ? "#ffe4e8" : "rgba(251,113,133,0.15)"
                : colorMode === "light" ? "#e9e5ff" : "rgba(167,139,250,0.15)",
              borderColor,
            }]}>
              <Text style={[styles.recordLabel, { color: accentBase }]}>
                {isRecording
                  ? lookupString("recording")
                  : transcriptionStatus === "transcribing"
                    ? lookupString("transcribing")
                    : "Tap to edit if needed ✦"}
              </Text>

              {/* Waveform bars when recording */}
              {isRecording && (
                <View style={styles.waveform}>
                  {[...Array(9)].map((_, i) => (
                    <View key={i} style={[styles.waveBar, { backgroundColor: accentBorder, height: 8 + (i % 3) * 8 }]} />
                  ))}
                </View>
              )}

              {/* Transcribing indicator */}
              {transcriptionStatus === "transcribing" && (
                <Text style={[styles.transcribingText, { color: textSecondary }]}>Transcribing with AI…</Text>
              )}

              {/* Text display or editable input */}
              {transcriptionStatus !== "transcribing" && (
                isEditableMode ? (
                  <TextInput
                    style={[styles.editableInput, { color: textPrimary, borderBottomColor: accentBorder }]}
                    value={liveText}
                    onChangeText={setLiveText}
                    placeholder="Edit your win…"
                    placeholderTextColor={textTertiary}
                    multiline
                    textAlignVertical="top"
                  />
                ) : (
                  <Text style={[styles.liveText, { color: liveText ? textPrimary : textTertiary }]}>
                    {liveText || lookupString("speak_ph")}
                  </Text>
                )
              )}
            </View>
          )}

          {/* Tag selector + save/discard (shown after recording stops with live text) */}
          {showTagsAndActions && (
            <>
              <Text style={[styles.tagSectionLabel, { color: textSecondary }]}>{lookupString("tag_lbl")}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tagScrollOuter}
                contentContainerStyle={styles.tagScrollContent}
              >
                {allTags.map((tag) => (
                  <TouchableOpacity
                    key={`save-tag-${tag}`}
                    onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    style={[styles.tagChip, {
                      backgroundColor: selectedTag === tag ? accentBase : "transparent",
                      borderColor: selectedTag === tag ? accentBase : borderColor,
                    }]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tagChipText, {
                      color: selectedTag === tag ? invertText : textSecondary,
                    }]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setShowCustomTagInput((v) => !v)}
                  style={[styles.tagChip, styles.tagChipDash, {
                    backgroundColor: showCustomTagInput ? accentBg : "transparent",
                    borderColor: showCustomTagInput ? accentBorder : borderColor,
                  }]}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={12} color={showCustomTagInput ? accentBase : textTertiary} />
                </TouchableOpacity>
              </ScrollView>

              {showCustomTagInput && (
                <View style={styles.customTagInputRow}>
                  <TextInput
                    style={[styles.customTagInput, { backgroundColor: cardBgSolid, borderColor, color: textPrimary }]}
                    placeholder="New tag name…"
                    placeholderTextColor={textTertiary}
                    value={customTagInput}
                    onChangeText={setCustomTagInput}
                    onSubmitEditing={() => onAddCustomTag(customTagInput)}
                    maxLength={20}
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={() => onAddCustomTag(customTagInput)}
                    style={[styles.customTagAddBtn, { backgroundColor: accentBase }]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.customTagAddText, { color: colorMode === "dark" ? "#08090A" : "white" }]}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Save / Discard */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={onClear}
                  style={[styles.discardBtn, { backgroundColor: cardBgSolid, borderColor }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.discardBtnText, { color: textSecondary }]}>{lookupString("discard")}</Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={gradColors}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.saveBtn}
                >
                  <TouchableOpacity onPress={onSave} style={styles.saveBtnInner} activeOpacity={0.8}>
                    <Text style={[styles.saveBtnText, { color: invertText }]}>{lookupString("stack")}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </>
          )}

          {/* Anti-spiral button */}
          <TouchableOpacity
            onPress={onSpiral}
            style={[styles.spiralBtn, {
              backgroundColor: antiSpiralBg,
              borderColor: antiSpiralBorder,
            }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.spiralBtnText, { color: antiSpiralText }]}>{lookupString("spiral_btn")}</Text>
            <Text style={[styles.spiralBtnSub, { color: textSecondary }]}>{lookupString("spiral_sub")}</Text>
          </TouchableOpacity>

          {/* Recent wins */}
          <View style={styles.recentSection}>
            <Text style={[styles.recentLabel, { color: textTertiary }]}>{lookupString("recent")}</Text>

            {/* Filter chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScrollOuter}
              contentContainerStyle={styles.filterScrollContent}
            >
              <TouchableOpacity
                onPress={() => setFilterTag(null)}
                style={[styles.filterChip, {
                  backgroundColor: !filterTag ? textPrimary : cardBgSolid,
                  borderColor: !filterTag ? textPrimary : borderColor,
                }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, {
                  color: !filterTag ? t.bgBase : textSecondary,
                  fontWeight: !filterTag ? "700" : "400",
                }]}>All</Text>
              </TouchableOpacity>
              {allTags.map((tag) => (
                <TouchableOpacity
                  key={`filter-${tag}`}
                  onPress={() => setFilterTag(tag)}
                  style={[styles.filterChip, {
                    backgroundColor: filterTag === tag ? textPrimary : cardBgSolid,
                    borderColor: filterTag === tag ? textPrimary : borderColor,
                  }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, {
                    color: filterTag === tag ? t.bgBase : textSecondary,
                    fontWeight: filterTag === tag ? "700" : "400",
                  }]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Win cards */}
            <View style={styles.winList}>
              {activeDashboardFilteredWins.length ? (
                activeDashboardFilteredWins.map((win, idx) => (
                  <WinCard key={win.id} win={win} idx={idx} t={t} onPress={() => onViewWin(win.id, "home")} />
                ))
              ) : (
                <View style={[styles.emptyBox, { borderColor }]}>
                  <Text style={[styles.emptyText, { color: textTertiary }]}>{lookupString("no_wins_home")}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Share nudge overlay — positioned above NavBar */}
        {showShareNudge && (
          <View style={styles.nudgeOuter} pointerEvents="box-none">
            <LinearGradient colors={gradColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.nudge}>
              <TouchableOpacity
                onPress={() => { onOpenShare(); setShowShareNudge(false); }}
                style={styles.nudgeInner}
                activeOpacity={0.9}
              >
                <Text style={[styles.nudgeText, { color: invertText }]}>{lookupString("share_nudge")}</Text>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation?.(); setShowShareNudge(false); }}
                  style={styles.nudgeClose}
                  activeOpacity={0.7}
                >
                  <Feather name="x" size={12} color={invertText} />
                </TouchableOpacity>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 64, paddingBottom: 160 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  headerLeft: { gap: 6 },
  dateLabel: { fontSize: 11, letterSpacing: 2, fontWeight: "600", textTransform: "uppercase" },
  heading: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  headerRight: { flexDirection: "row", gap: 10, alignItems: "center" },
  iconBtn: { padding: 12, borderRadius: 16, borderWidth: 1 },
  avatarOuter: { padding: 6 },
  avatarInner: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 10, fontWeight: "700" },
  avatarImg: { width: 28, height: 28, borderRadius: 14 },
  statsGrid: { flexDirection: "row", gap: 16, marginBottom: 16 },
  statCard: { flex: 1, padding: 24, borderRadius: 32, borderWidth: 1, position: "relative", overflow: "hidden" },
  statCardBlue: {},
  statCardPink: {},
  statCardWide: { padding: 24, borderRadius: 32, borderWidth: 1, position: "relative", overflow: "hidden", marginBottom: 24 },
  statNum: { fontSize: 40, fontWeight: "800", lineHeight: 48, marginBottom: 4, letterSpacing: -1 },
  statLbl: { fontSize: 14, fontWeight: "500", opacity: 0.8 },
  statEmoji: { position: "absolute", top: 20, right: 20, fontSize: 24 },
  graceBanner: { borderRadius: 16, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 24 },
  graceBannerText: { fontSize: 13, textAlign: "center", letterSpacing: 0.5, fontWeight: "600" },
  speechError: { fontSize: 13, color: "#EF4444", textAlign: "center", marginBottom: 16 },
  manualInput: {
    borderWidth: 1, borderRadius: 24, padding: 20, minHeight: 140,
    fontSize: 18, fontWeight: "400", fontStyle: "italic", lineHeight: 28,
    marginBottom: 24,
  },
  recordCard: {
    borderRadius: 32, padding: 24, borderWidth: 1, marginBottom: 24, gap: 16,
  },
  recordLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700", textTransform: "uppercase" },
  waveform: { flexDirection: "row", height: 28, alignItems: "center", gap: 4 },
  waveBar: { flex: 1, borderRadius: 4 },
  transcribingText: { fontSize: 16, fontWeight: "400" },
  liveText: { fontSize: 20, fontWeight: "400", fontStyle: "italic", lineHeight: 30 },
  editableInput: {
    fontSize: 20, fontWeight: "400", fontStyle: "italic", lineHeight: 30,
    borderBottomWidth: 1, paddingBottom: 10, minHeight: 100,
  },
  tagSectionLabel: { fontSize: 12, letterSpacing: 1.5, fontWeight: "600", textTransform: "uppercase", marginBottom: 10 },
  tagScrollOuter: { marginHorizontal: -20, marginBottom: 6 },
  tagScrollContent: { paddingHorizontal: 20, paddingVertical: 4, gap: 10, flexDirection: "row" },
  tagChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, borderWidth: 1 },
  tagChipDash: { borderStyle: "dashed" },
  tagChipText: { fontSize: 13, fontWeight: "500" },
  customTagInputRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  customTagInput: { flex: 1, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
  customTagAddBtn: { paddingHorizontal: 20, borderRadius: 16, justifyContent: "center" },
  customTagAddText: { fontSize: 14, fontWeight: "700" },
  actionsRow: { flexDirection: "row", gap: 16, marginBottom: 32 },
  discardBtn: { flex: 1, borderWidth: 1, borderRadius: 24, paddingVertical: 20, alignItems: "center", justifyContent: "center" },
  discardBtnText: { fontSize: 15, fontWeight: "600" },
  saveBtn: { flex: 1, borderRadius: 24, overflow: "hidden" },
  saveBtnInner: { paddingVertical: 20, alignItems: "center", justifyContent: "center" },
  saveBtnText: { fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },
  spiralBtn: { borderRadius: 24, borderWidth: 1, padding: 24, marginBottom: 40 },
  spiralBtnText: { fontSize: 16, fontStyle: "italic", fontWeight: "600" },
  spiralBtnSub: { fontSize: 13, letterSpacing: 0.5, marginTop: 6, opacity: 0.8 },
  recentSection: { gap: 16 },
  recentLabel: { fontSize: 11, letterSpacing: 2, fontWeight: "700", textTransform: "uppercase" },
  filterScrollOuter: { marginHorizontal: -20 },
  filterScrollContent: { paddingHorizontal: 20, paddingVertical: 4, gap: 10, flexDirection: "row" },
  filterChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, borderWidth: 1 },
  filterChipText: { fontSize: 13 },
  winList: { gap: 16 },
  emptyBox: { borderWidth: 1, borderStyle: "dashed", borderRadius: 24, paddingVertical: 56, alignItems: "center" },
  emptyText: { fontSize: 15, fontWeight: "400", opacity: 0.7 },
  nudgeOuter: { position: "absolute", bottom: 110, left: 20, right: 20 },
  nudge: { borderRadius: 24, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  nudgeInner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  nudgeText: { fontSize: 13, letterSpacing: 1.5, fontWeight: "700", textTransform: "uppercase", flex: 1 },
  nudgeClose: { padding: 6, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.15)" },
});
