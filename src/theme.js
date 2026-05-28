// Returns the full theme token object based on colorMode ("dark" | "light").
// Colours are kept in sync with the web app's token values.
export function buildTheme(colorMode) {
  const isDark = colorMode === "dark";
  const cv = (light, dark) => (isDark ? dark : light);

  return {
    colorMode,
    bgBase:            cv("#f5f3f7", "#08090A"),
    textPrimary:       cv("#1c1c1e", "#EDE8E0"),
    textSecondary:     cv("#5c5c60", "rgba(255,255,255,0.4)"),
    textTertiary:      cv("#8e8e93", "rgba(255,255,255,0.3)"),
    cardBg:            cv("rgba(255,255,255,0.85)", "rgba(255,255,255,0.01)"),
    cardBgHover:       cv("rgba(255,255,255,0.95)", "rgba(255,255,255,0.03)"),
    cardBgSolid:       cv("rgba(255,255,255,0.9)", "rgba(255,255,255,0.04)"),
    borderColor:       cv("rgba(0,0,0,0.06)", "rgba(255,255,255,0.07)"),
    borderColorHover:  cv("rgba(0,0,0,0.1)", "rgba(255,255,255,0.15)"),
    // Accent — matches web exactly
    accentBase:        cv("#111111", "#00E699"),
    accentGrad:        cv(["#111111", "#333333"], ["#00E699", "#00B377"]),
    accentGradHover:   cv(["#333333", "#111111"], ["#00B377", "#00E699"]),
    accentBg:          cv("rgba(17,17,17,0.06)", "rgba(0,230,153,0.05)"),
    accentBorder:      cv("rgba(17,17,17,0.12)", "rgba(0,230,153,0.15)"),
    glassBg:           cv("rgba(255,255,255,0.65)", "rgba(8,9,10,0.85)"),
    invertText:        cv("#FFFFFF", "#08090A"),
    dangerBg:          cv("rgba(229,62,62,0.05)", "rgba(229,62,62,0.08)"),
    dangerBorder:      cv("rgba(229,62,62,0.2)", "rgba(229,62,62,0.2)"),
    dangerHover:       cv("rgba(229,62,62,0.1)", "rgba(229,62,62,0.12)"),
    // Calendar heatmap levels — match web rgba(0,230,153,…) palette
    cellEmptyBg:       cv("rgba(0,0,0,0.02)", "rgba(255,255,255,0.02)"),
    cellEmptyBorder:   cv("rgba(0,0,0,0.05)", "rgba(255,255,255,0.03)"),
    lvl1Bg:            cv("rgba(17,17,17,0.08)", "rgba(0,230,153,0.06)"),
    lvl1Border:        cv("rgba(17,17,17,0.2)",  "rgba(0,230,153,0.2)"),
    lvl2Bg:            cv("rgba(17,17,17,0.2)",  "rgba(0,230,153,0.15)"),
    lvl2Border:        cv("rgba(17,17,17,0.35)", "rgba(0,230,153,0.4)"),
    lvl3Bg:            cv("rgba(17,17,17,0.45)", "rgba(0,230,153,0.4)"),
    lvl3Border:        cv("rgba(17,17,17,0.55)", "rgba(0,230,153,0.5)"),
    antiSpiralBg:      cv("rgba(139,92,246,0.08)", "rgba(139,92,246,0.08)"),
    antiSpiralBorder:  cv("rgba(139,92,246,0.15)", "rgba(139,92,246,0.2)"),
    antiSpiralText:    cv("#6D28D9", "#C084FC"),
    calNavBg:          cv("rgba(255,255,255,0.6)", "rgba(255,255,255,0.04)"),
    calNavBgHover:     cv("rgba(255,255,255,0.9)", "rgba(255,255,255,0.08)"),
    backBtnHover:      cv("#334155", "#00B377"),
    tagUnselectedBg:   cv("rgba(255,255,255,0.6)", "rgba(255,255,255,0.04)"),
    modalOverlayBg:    cv("rgba(255,255,255,0.7)", "rgba(0,0,0,0.7)"),
    modalContentGlassBg: cv("rgba(255,255,255,0.95)", "rgba(15,15,18,0.95)"),
    spiralEvidenceBg:   cv("rgba(139,92,246,0.08)", "rgba(139,92,246,0.1)"),
    spiralEvidenceBorder: cv("rgba(139,92,246,0.2)", "rgba(139,92,246,0.25)"),
    quoteMarkColor:    cv("rgba(0,0,0,0.04)", "rgba(0,230,153,0.08)"),
    bentoColors: isDark
      ? [
          "rgba(255,255,255,0.03)",
          "rgba(56,189,248,0.1)",
          "rgba(244,114,182,0.1)",
          "rgba(250,204,21,0.1)",
          "rgba(52,211,153,0.1)",
        ]
      : ["#FFFFFF", "#F0F9FF", "#FDF2F8", "#FEFCE8", "#ECFDF5"],
    bentoBorders: isDark
      ? [
          "rgba(255,255,255,0.08)",
          "rgba(56,189,248,0.2)",
          "rgba(244,114,182,0.2)",
          "rgba(250,204,21,0.2)",
          "rgba(52,211,153,0.2)",
        ]
      : Array(5).fill("rgba(0,0,0,0.04)"),
  };
}
