import React from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { lookupString } from "../utils";
import { LANGUAGES } from "../constants";

export default function Settings({
  t, meta,
  selectedLanguage, setSelectedLanguage,
  showCustomTagInput, setShowCustomTagInput,
  customTagInput, setCustomTagInput,
  onAddCustomTag, onRemoveCustomTag,
  onExport, onImport, onClearAll,
  onBack, toggleColorMode,
}) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    bgBase, cardBgSolid, borderColor,
    accentBase, invertText, dangerBg, dangerBorder,
  } = t;

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
          <Text style={[styles.backText, { color: accentBase }]}>{lookupString("back")}</Text>
        </TouchableOpacity>

        <Text style={[styles.heading, { color: textPrimary }]}>Settings.</Text>

        {/* Language */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: textTertiary }]}>TRANSCRIPTION LANGUAGE</Text>
          <View style={[styles.card, {
            backgroundColor: colorMode === "dark" ? "rgba(74,222,128,0.10)" : cardBgSolid,
            borderColor: colorMode === "dark" ? "rgba(74,222,128,0.25)" : borderColor,
          }]}>
            <Text style={[styles.cardHint, { color: textTertiary }]}>Used for voice recording and transcription</Text>
            <View style={styles.tagRow}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setSelectedLanguage(lang.code)}
                  style={[styles.langBtn, {
                    backgroundColor: selectedLanguage === lang.code ? accentBase : "transparent",
                    borderColor: selectedLanguage === lang.code ? accentBase : borderColor,
                  }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.langBtnText, {
                    color: selectedLanguage === lang.code ? invertText : textSecondary,
                  }]}>
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Custom Tags */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: textTertiary }]}>CUSTOM TAGS</Text>
          <View style={[styles.card, {
            backgroundColor: colorMode === "dark" ? "rgba(167,139,250,0.10)" : cardBgSolid,
            borderColor: colorMode === "dark" ? "rgba(167,139,250,0.25)" : borderColor,
          }]}>
            {(meta.customTags || []).map((tag) => (
              <View key={`st-${tag}`} style={styles.customTagRow}>
                <View style={styles.customTagLeft}>
                  <View style={[styles.tagDot, { backgroundColor: accentBase }]} />
                  <Text style={[styles.customTagName, { color: textPrimary }]}>{tag}</Text>
                </View>
                <TouchableOpacity onPress={() => onRemoveCustomTag(tag)} style={styles.removeBtn} activeOpacity={0.7}>
                  <Feather name="x" size={12} color={textTertiary} />
                </TouchableOpacity>
              </View>
            ))}
            {(meta.customTags || []).length === 0 && !showCustomTagInput && (
              <Text style={[styles.cardHint, { color: textTertiary }]}>No custom tags yet.</Text>
            )}
            {!showCustomTagInput ? (
              <TouchableOpacity onPress={() => setShowCustomTagInput(true)} style={styles.addTagBtn} activeOpacity={0.7}>
                <Feather name="plus" size={12} color={accentBase} />
                <Text style={[styles.addTagBtnText, { color: accentBase }]}> Add new tag</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addTagInputRow}>
                <TextInput
                  style={[styles.addTagInput, { backgroundColor: bgBase, borderColor, color: textPrimary }]}
                  placeholder="Tag name…"
                  placeholderTextColor={textTertiary}
                  value={customTagInput}
                  onChangeText={setCustomTagInput}
                  onSubmitEditing={() => onAddCustomTag(customTagInput)}
                  maxLength={20}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => onAddCustomTag(customTagInput)}
                  style={[styles.addTagConfirm, { backgroundColor: accentBase }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.addTagConfirmText, { color: colorMode === "dark" ? "#08090A" : "white" }]}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: textTertiary }]}>APPEARANCE</Text>
          <TouchableOpacity
            onPress={toggleColorMode}
            style={[styles.rowCard, {
              backgroundColor: colorMode === "dark" ? "rgba(251,191,36,0.10)" : cardBgSolid,
              borderColor: colorMode === "dark" ? "rgba(251,191,36,0.25)" : borderColor,
            }]}
            activeOpacity={0.7}
          >
            <View>
              <Text style={[styles.rowTitle, { color: textPrimary }]}>Theme</Text>
              <Text style={[styles.rowSub, { color: textTertiary }]}>Toggle {colorMode === "light" ? "dark" : "light"} mode</Text>
            </View>
            <Feather name={colorMode === "light" ? "moon" : "sun"} size={18} color={textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Storage & Backup */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: textTertiary }]}>STORAGE & BACKUP</Text>
          <TouchableOpacity
            onPress={onExport}
            style={[styles.rowCard, {
              backgroundColor: colorMode === "dark" ? "rgba(56,189,248,0.10)" : cardBgSolid,
              borderColor: colorMode === "dark" ? "rgba(56,189,248,0.25)" : borderColor,
              marginBottom: 8,
            }]}
            activeOpacity={0.7}
          >
            <View>
              <Text style={[styles.rowTitle, { color: textPrimary }]}>Export victories</Text>
              <Text style={[styles.rowSub, { color: textTertiary }]}>Download as JSON backup</Text>
            </View>
            <Feather name="arrow-down" size={16} color={textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onImport}
            style={[styles.rowCard, {
              backgroundColor: colorMode === "dark" ? "rgba(56,189,248,0.10)" : cardBgSolid,
              borderColor: colorMode === "dark" ? "rgba(56,189,248,0.25)" : borderColor,
            }]}
            activeOpacity={0.7}
          >
            <View>
              <Text style={[styles.rowTitle, { color: textPrimary }]}>Import victories</Text>
              <Text style={[styles.rowSub, { color: textTertiary }]}>Restore from JSON file</Text>
            </View>
            <Feather name="arrow-up" size={16} color={textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Danger zone */}
        <View style={[styles.section, styles.dangerSection, { borderTopColor: borderColor }]}>
          <Text style={[styles.sectionLabel, { color: "#E53E3E", opacity: 0.8 }]}>
            {lookupString("settings_danger")}
          </Text>
          <TouchableOpacity
            onPress={onClearAll}
            style={[styles.rowCard, { backgroundColor: dangerBg, borderColor: dangerBorder }]}
            activeOpacity={0.7}
          >
            <View>
              <Text style={[styles.rowTitle, { color: "#E53E3E" }]}>Clear all victories</Text>
              <Text style={[styles.rowSub, { color: "#E53E3E", opacity: 0.6 }]}>This cannot be undone</Text>
            </View>
            <Feather name="trash-2" size={16} color="#E53E3E" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: textTertiary }]}>
          {"Victory Journal · v3\nYour proof library"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 120 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 24 },
  backText: { fontSize: 14, fontWeight: "500" },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 32 },
  section: { marginBottom: 24 },
  dangerSection: { borderTopWidth: 1, paddingTop: 24 },
  sectionLabel: { fontSize: 10, letterSpacing: 2, fontWeight: "700", marginBottom: 12 },
  card: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 },
  cardHint: { fontSize: 12, fontWeight: "300" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  langBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  langBtnText: { fontSize: 12 },
  customTagRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  customTagLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  customTagName: { fontSize: 14, fontWeight: "500" },
  removeBtn: { padding: 4 },
  addTagBtn: { flexDirection: "row", alignItems: "center" },
  addTagBtnText: { fontSize: 12, fontWeight: "500" },
  addTagInputRow: { flexDirection: "row", gap: 8 },
  addTagInput: { flex: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  addTagConfirm: { paddingHorizontal: 16, borderRadius: 12, justifyContent: "center" },
  addTagConfirmText: { fontSize: 13, fontWeight: "700" },
  rowCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 20, borderWidth: 1 },
  rowTitle: { fontSize: 14, fontWeight: "500" },
  rowSub: { fontSize: 12, fontWeight: "300", marginTop: 2 },
  footer: { textAlign: "center", fontSize: 9, letterSpacing: 2, lineHeight: 20, paddingVertical: 48 },
});
