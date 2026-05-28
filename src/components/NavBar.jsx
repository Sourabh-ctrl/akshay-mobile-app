import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function NavBar({ t, screen, isRecording, onNavigate, onMicToggle }) {
  const { accentBase, textTertiary, glassBg, colorMode } = t;

  const ripple1Scale = useRef(new Animated.Value(1)).current;
  const ripple1Opacity = useRef(new Animated.Value(0)).current;
  const ripple2Scale = useRef(new Animated.Value(1)).current;
  const ripple2Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isRecording) {
      ripple1Scale.setValue(1);
      ripple1Opacity.setValue(0);
      ripple2Scale.setValue(1);
      ripple2Opacity.setValue(0);
      return;
    }

    const r1 = Animated.loop(
      Animated.parallel([
        Animated.timing(ripple1Scale, { toValue: 2, duration: 1200, useNativeDriver: true }),
        Animated.timing(ripple1Opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    const r2 = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(ripple2Scale, { toValue: 2, duration: 1200, useNativeDriver: true }),
          Animated.timing(ripple2Opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ]),
      ])
    );

    ripple1Opacity.setValue(0.4);
    ripple2Opacity.setValue(0.4);
    r1.start();
    r2.start();

    return () => {
      r1.stop();
      r2.stop();
    };
  }, [isRecording]);

  const navBtn = (iconName, target) => (
    <TouchableOpacity
      key={target}
      onPress={() => onNavigate(target)}
      style={styles.navBtn}
      activeOpacity={0.7}
    >
      <Feather
        name={iconName}
        size={20}
        color={screen === target ? accentBase : textTertiary}
      />
    </TouchableOpacity>
  );

  const rippleColor = isRecording ? "rgba(229,62,62,0.45)" : `${accentBase}70`;

  return (
    <View style={[styles.bar, {
      backgroundColor: glassBg,
      borderColor: colorMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.8)",
      shadowOpacity: colorMode === "dark" ? 0.4 : 0.08,
    }]}>
      {navBtn("home", "home")}
      {navBtn("refresh-cw", "stack")}

      <View style={styles.micWrap}>
        {isRecording && (
          <>
            <Animated.View style={[
              styles.ripple,
              { backgroundColor: rippleColor, transform: [{ scale: ripple1Scale }], opacity: ripple1Opacity },
            ]} />
            <Animated.View style={[
              styles.ripple,
              { backgroundColor: rippleColor, transform: [{ scale: ripple2Scale }], opacity: ripple2Opacity },
            ]} />
          </>
        )}
        <TouchableOpacity onPress={onMicToggle} activeOpacity={0.85}>
          <View style={[styles.micBtn, {
            backgroundColor: isRecording ? "#E53E3E" : accentBase,
            shadowColor: isRecording ? "#E53E3E" : accentBase,
          }]}>
            <Feather name={isRecording ? "square" : "mic"} size={22} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {navBtn("calendar", "calendar")}
      {navBtn("search", "search")}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 12,
  },
  navBtn: { flex: 1, alignItems: "center", justifyContent: "center", height: "100%" },
  micWrap: { flex: 1, alignItems: "center", justifyContent: "center", position: "relative" },
  ripple: {
    position: "absolute",
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  micBtn: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: "center", justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
});
