import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { lookupString, getExtendedLongDateRepresentation } from "../utils";

export default function Detail({
  t, win, allTags,
  audioRecordings, playingAudioId, onToggleAudio,
  showCustomTagInput, setShowCustomTagInput,
  customTagInput, setCustomTagInput,
  onAddCustomTag, onTagChange,
  onBack, onShare, onResurface, onDelete,
}) {
  if (!win) return null;

  const {
    textPrimary, textSecondary, textTertiary,
    colorMode, cardBgSolid, borderColor,
    accentBase, accentBg, accentBorder, accentGrad,
    invertText, dangerBg,
    backBtnHover, tagUnselectedBg, quoteMarkColor,
  } = t;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="chevron-left" size={16} color={accentBase} />
          <Text style={[styles.backText, { color: accentBase }]}>{lookupString("back")}</Text>
        </TouchableOpacity>

        {/* Date */}
        <Text style={[styles.dateLabel, { color: textTertiary, borderBottomColor: borderColor }]}>
          {getExtendedLongDateRepresentation(win.date).toUpperCase()}
        </Text>

        {/* Tag editor */}
        <View style={[styles.tagBox, { backgroundColor: cardBgSolid, borderColor }]}>
          <Text style={[styles.tagBoxLabel, { color: textSecondary }]}>TAG THIS WIN</Text>
          <View style={styles.tagRow}>
            {allTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => onTagChange(tag)}
                style={[styles.tagBtn, {
                  backgroundColor: win.tag === tag ? accentBase : tagUnselectedBg,
                  borderColor: win.tag === tag ? accentBase : borderColor,
                }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagBtnText, { color: win.tag === tag ? invertText : textSecondary }]}>{tag}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowCustomTagInput((v) => !v)}
              style={[styles.tagBtn, styles.tagBtnDash, {
                backgroundColor: showCustomTagInput ? accentBg : "transparent",
                borderColor: showCustomTagInput ? accentBorder : borderColor,
              }]}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={12} color={showCustomTagInput ? accentBase : textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onTagChange(null)}
              style={[styles.tagBtn, styles.tagBtnDash, {
                borderColor: !win.tag ? "#E53E3E" : borderColor,
                backgroundColor: !win.tag ? dangerBg : "transparent",
              }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tagBtnText, { color: !win.tag ? "#E53E3E" : textTertiary }]}>None</Text>
            </TouchableOpacity>
          </View>
          {showCustomTagInput && (
            <View style={styles.customTagRow}>
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
                style={[styles.addTagBtn, { backgroundColor: accentBase }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.addTagBtnText, { color: colorMode === "dark" ? "#08090A" : "white" }]}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Main text card */}
        <View style={[styles.textCard, {
          backgroundColor: colorMode === "dark" ? "rgba(0,230,153,0.05)" : "rgba(255,255,255,0.6)",
          borderColor: colorMode === "dark" ? "rgba(0,230,153,0.2)" : borderColor,
        }]}>
          <Text style={[styles.quoteMark, { color: quoteMarkColor }]}>"</Text>
          <Text style={[styles.winText, { color: textPrimary }]}>{win.text}</Text>
        </View>

        {/* Audio playback */}
        {audioRecordings[win.id] && (
          <View style={[styles.audioBox, { backgroundColor: cardBgSolid, borderColor: playingAudioId === win.id ? accentBorder : borderColor }]}>
            <Text style={[styles.audioLabel, { color: playingAudioId === win.id ? accentBase : textSecondary }]}>
              VOICE RECORDING
            </Text>
            <View style={styles.audioRow}>
              <TouchableOpacity
                onPress={() => onToggleAudio(win.id)}
                style={[styles.playBtn, { backgroundColor: accentBase }]}
                activeOpacity={0.7}
              >
                <Feather name={playingAudioId === win.id ? "pause" : "play"} size={14} color="white" />
              </TouchableOpacity>
              <Text style={[styles.audioStatus, { color: playingAudioId === win.id ? accentBase : textSecondary }]}>
                {playingAudioId === win.id ? "Playing…" : "Tap to play your voice note"}
              </Text>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={onShare}
            style={[styles.actionBtn, { backgroundColor: cardBgSolid, borderColor }]}
            activeOpacity={0.7}
          >
            <Feather name="share-2" size={14} color={accentBase} />
            <Text style={[styles.actionBtnText, { color: accentBase }]}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onResurface}
            style={[styles.actionBtn, {
              backgroundColor: win.resurface ? accentBase : cardBgSolid,
              borderColor: win.resurface ? accentBase : borderColor,
            }]}
            activeOpacity={0.7}
          >
            <Feather name="refresh-cw" size={14} color={win.resurface ? invertText : textSecondary} />
            <Text style={[styles.actionBtnText, { color: win.resurface ? invertText : textSecondary }]}>
              {win.resurface ? "Set ✦" : "Resurface"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delete */}
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} activeOpacity={0.6}>
          <Text style={styles.deleteBtnText}>Delete this victory</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120, gap: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { fontSize: 14, fontWeight: "500" },
  dateLabel: { fontSize: 10, letterSpacing: 2, borderBottomWidth: 1, paddingBottom: 16 },
  tagBox: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  tagBoxLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagBtn: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1,
  },
  tagBtnDash: { borderStyle: "dashed" },
  tagBtnText: { fontSize: 12, letterSpacing: 0.5 },
  customTagRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  customTagInput: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  addTagBtn: { paddingHorizontal: 16, borderRadius: 12, justifyContent: "center" },
  addTagBtnText: { fontSize: 13, fontWeight: "700" },
  textCard: {
    padding: 24, borderRadius: 24, borderWidth: 1, minHeight: 140,
    alignItems: "center", justifyContent: "center", position: "relative",
  },
  quoteMark: { position: "absolute", top: -8, left: 8, fontSize: 80, lineHeight: 80 },
  winText: { fontSize: 20, fontStyle: "italic", fontWeight: "300", lineHeight: 30, textAlign: "center", paddingHorizontal: 8, zIndex: 1 },
  audioBox: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 10 },
  audioLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  audioRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  playBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  audioStatus: { fontSize: 13, fontWeight: "300" },
  actionRow: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 20, borderRadius: 16, borderWidth: 1, gap: 8 },
  actionBtnText: { fontSize: 14, fontWeight: "500" },
  deleteBtn: { alignItems: "center", paddingVertical: 20 },
  deleteBtnText: { fontSize: 12, color: "#E53E3E", textTransform: "uppercase", letterSpacing: 2, opacity: 0.7 },
});
