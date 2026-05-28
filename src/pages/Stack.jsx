import React, { useRef, useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, PanResponder, Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TEM } from "../constants";

const SCREEN_W = Dimensions.get("window").width;
const SCENE_W = Math.min(SCREEN_W - 48, 360);
const CARD_W = 64;
const CARD_H = 248;
const RADIUS = Math.round((SCENE_W - CARD_W) * 0.42);
const SCENE_H = CARD_H + 112;
const NUM_SLOTS = 24;
const PERSP = 820; // matches web CSS perspective: 820px

// Vertical text container math — inner is TEXT_H×TEXT_W, rotated 90deg,
// appears as TEXT_W wide × TEXT_H tall (matches web's writing-mode: vertical-rl)
const TEXT_W = CARD_W - 20;          // 44px — available inner card width
const TEXT_H = 140;                   // matches web's max-height on .bpg-ttl
const ROT_OFFSET = (TEXT_H - TEXT_W) / 2; // 48px — offset to center rotated box

function getCardProps(slotIndex, drumAngle) {
  const slotAngle = (slotIndex * 360) / NUM_SLOTS;
  const effectiveAngleDeg = ((slotAngle + drumAngle) % 360 + 360) % 360;
  const theta = (effectiveAngleDeg * Math.PI) / 180;
  const depth = Math.cos(theta);
  // Perspective scale: matches web's perspective: 820px — front cards appear
  // larger, back cards smaller, identical to CSS 3D rendering
  const persp = PERSP / Math.max(1, PERSP - RADIUS * depth);
  // x: perspective-corrected horizontal position on the cylinder
  const x = RADIUS * Math.sin(theta) * persp;
  // scaleX: perspective foreshortening — card goes edge-on at 90° (like CSS 3D)
  const scaleX = Math.max(0.02, Math.abs(depth) * persp);
  // scaleY: depth-based size variation from perspective
  const scaleY = persp;
  const opacity = Math.max(0.06, (depth + 1) / 2);
  const zIndex = Math.round((depth + 1) * 50);
  return { x, scaleX, scaleY, opacity, zIndex };
}

export default function Stack({ t, wins, onViewWin }) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    accentBase, accentGrad, invertText,
  } = t;

  const [spinning, setSpinning] = useState(false);
  const [, forceRender] = useState(0);
  const drumAngleRef = useRef(0);
  const dragStartRef = useRef(0);
  const rafRef = useRef(null);
  const spinningRef = useRef(false);

  const gradColors = Array.isArray(accentGrad) ? accentGrad : [accentBase, accentBase];
  const sorted = [...wins].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

  const slots = Array.from({ length: NUM_SLOTS }, (_, i) => {
    const pageIndex = Math.floor(i / 3);
    return i % 3 === 0 && pageIndex < sorted.length ? sorted[pageIndex] : null;
  });

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        !spinningRef.current && Math.abs(gs.dx) > Math.abs(gs.dy),
      onPanResponderGrant: () => {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        dragStartRef.current = drumAngleRef.current;
      },
      onPanResponderMove: (_, gs) => {
        drumAngleRef.current = dragStartRef.current + gs.dx * 0.5;
        forceRender((n) => n + 1);
      },
    })
  ).current;

  const triggerSpin = () => {
    if (!sorted.length || spinningRef.current) return;
    const idx = Math.floor(Math.random() * sorted.length);
    const win = sorted[idx];
    const slotAngle = (idx * 3 * 360) / NUM_SLOTS;
    const curr = drumAngleRef.current;
    const targetRemainder = ((-slotAngle % 360) + 360) % 360;
    const currRemainder = ((curr % 360) + 360) % 360;
    let delta = targetRemainder - currRemainder;
    if (delta < 0) delta += 360;
    const target = curr + delta + 6 * 360;

    spinningRef.current = true;
    setSpinning(true);

    const duration = 3500;
    const startAngle = curr;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      drumAngleRef.current = startAngle + (target - startAngle) * eased;
      forceRender((n) => n + 1);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        drumAngleRef.current = target;
        rafRef.current = null;
        setTimeout(() => {
          spinningRef.current = false;
          setSpinning(false);
          onViewWin(win.id, "stack");
        }, 600);
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  const isDark = colorMode === "dark";
  const cardGrad = isDark
    ? ["rgba(28,32,44,0.98)", "rgba(18,22,32,0.96)"]
    : ["rgba(255,255,255,0.98)", "rgba(247,249,252,0.96)"];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.outer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.heading, { color: textPrimary }]}>Victory Stack</Text>
        <Text style={[styles.sub, { color: textSecondary }]}>Spin to rediscover a random win.</Text>

        <View
          style={[styles.scene, { width: SCENE_W, height: SCENE_H }]}
          {...panResponder.panHandlers}
        >
          <View style={[styles.floor, { left: SCENE_W / 2 - 135 }]} />

          {slots.map((win, i) => {
            const { x, scaleX, scaleY, opacity, zIndex } = getCardProps(i, drumAngleRef.current);
            const left = SCENE_W / 2 + x - CARD_W / 2;
            const top = SCENE_H / 2 - CARD_H / 2;

            if (!win) {
              return (
                <View
                  key={i}
                  style={[styles.card, {
                    left, top, width: CARD_W, height: CARD_H,
                    opacity: opacity * 0.5,
                    zIndex,
                    transform: [{ scaleX }, { scaleY }],
                    backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                  }]}
                />
              );
            }

            return (
              <LinearGradient
                key={i}
                colors={cardGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.card, styles.cardWin, {
                  left, top, width: CARD_W, height: CARD_H,
                  opacity,
                  zIndex,
                  transform: [{ scaleX }, { scaleY }],
                  borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
                  elevation: Math.max(1, Math.round(zIndex / 5)),
                }]}
              >
                <View style={[styles.emojiCircle, {
                  backgroundColor: isDark ? "rgba(0,230,153,0.15)" : "rgba(0,179,119,0.12)",
                }]}>
                  <Text style={styles.emojiText}>{TEM[win.tag] || "✦"}</Text>
                </View>

                {/* Vertical text: inner View is TEXT_H×TEXT_W, rotated 90deg so it
                    appears TEXT_W wide × TEXT_H tall — mirrors writing-mode: vertical-rl */}
                <View style={styles.vertOuter}>
                  <View style={styles.vertInner}>
                    <Text
                      style={[styles.cardTitle, { color: isDark ? "#EDE8E0" : "#1A202C" }]}
                      numberOfLines={2}
                    >
                      {win.text.length > 30 ? win.text.slice(0, 30) + "…" : win.text}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            );
          })}
        </View>

        {sorted.length > 0 && (
          <Text style={[styles.hint, { color: textTertiary }]}>
            Drag to explore · Tap spin to discover
          </Text>
        )}

        {sorted.length === 0 ? (
          <Text style={[styles.noWins, { color: textTertiary }]}>
            Record your first victory to bring the stack to life.
          </Text>
        ) : (
          <LinearGradient
            colors={gradColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.spinBtn}
          >
            <TouchableOpacity
              onPress={triggerSpin}
              disabled={spinning}
              style={styles.spinBtnInner}
              activeOpacity={0.85}
            >
              <Text style={[styles.spinBtnText, { color: invertText }]}>
                {spinning ? "Spinning…" : "Spin ✦"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1, alignItems: "center",
    paddingTop: 60, paddingHorizontal: 24, paddingBottom: 120,
  },
  heading: { fontSize: 26, fontWeight: "800", marginBottom: 6, textAlign: "center" },
  sub: { fontSize: 14, fontWeight: "300", textAlign: "center", marginBottom: 8 },
  scene: { position: "relative", marginVertical: 8 },
  floor: {
    position: "absolute", bottom: 18,
    width: 270, height: 52, borderRadius: 135,
    backgroundColor: "rgba(0,0,0,0.12)",
    opacity: 0.6,
  },
  card: {
    position: "absolute", borderRadius: 18, borderWidth: 1,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  cardWin: {
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4, shadowRadius: 18,
    paddingVertical: 14, paddingHorizontal: 10,
  },
  emojiCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
  },
  emojiText: { fontSize: 22 },
  vertOuter: {
    width: TEXT_W,
    height: TEXT_H,
    alignSelf: "center",
  },
  vertInner: {
    position: "absolute",
    width: TEXT_H,
    height: TEXT_W,
    top: ROT_OFFSET,
    left: -ROT_OFFSET,
    transform: [{ rotate: "90deg" }],
    justifyContent: "flex-start",
  },
  cardTitle: {
    fontSize: 12, fontWeight: "600", lineHeight: 16,
  },
  hint: {
    fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
    textAlign: "center", marginTop: 4, marginBottom: 20,
  },
  noWins: { fontSize: 14, fontWeight: "300", textAlign: "center", marginTop: 16 },
  spinBtn: { borderRadius: 30, overflow: "hidden", width: "100%" },
  spinBtnInner: { paddingVertical: 20, alignItems: "center", justifyContent: "center" },
  spinBtnText: { fontSize: 16, fontWeight: "700", letterSpacing: 1 },
});
