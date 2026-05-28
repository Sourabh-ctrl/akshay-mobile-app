import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import Svg, { Path } from "react-native-svg";
import { apiUrl } from "../lib/api";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "";
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";
const IS_WEB = Platform.OS === "web";

function GoogleIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <Path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <Path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.805.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <Path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <Path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </Svg>
  );
}

export default function Login({ t, onLoginSuccess }) {
  const {
    accentBase, accentBg, accentBorder, accentGrad,
    invertText, textSecondary, textPrimary, borderColor,
    colorMode,
  } = t;

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const inputBg = colorMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)";
  const inputBorder = colorMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const dividerColor = colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID || GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID || GOOGLE_WEB_CLIENT_ID,
    ...(!IS_WEB ? { redirectUri: AuthSession.makeRedirectUri({ scheme: "akshay-mobile-app" }) } : {}),
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === "success") {
      const token = response.authentication?.accessToken;
      if (token) handleGoogleToken(token);
      else {
        setError("Google sign-in failed: no access token returned.");
        setGoogleLoading(false);
      }
    } else if (response.type === "error") {
      setError("Google sign-in failed. Please check your connection and try again.");
      setGoogleLoading(false);
    } else {
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleToken = async (accessToken) => {
    setGoogleLoading(true);
    setError("");
    try {
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await profileRes.json();
      const res = await fetch(apiUrl("/api/auth/google-token"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Google sign-in failed."); return; }
      onLoginSuccess(data);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGooglePress = () => {
    if (!request) {
      setError("Google sign-in is initialising, try again in a moment.");
      return;
    }
    setError("");
    setGoogleLoading(true);
    promptAsync().catch(() => setGoogleLoading(false));
  };

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/auth/${tab === "login" ? "login" : "register"}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      onLoginSuccess(data);
    } catch {
      setError("Cannot reach the server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (newTab) => { setTab(newTab); setError(""); };
  const isLoginTab = tab === "login";
  const googleDisabled = googleLoading;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerBlock}>
            <View style={[styles.badge, { backgroundColor: accentBg, borderColor: accentBorder }]}>
              <Text style={[styles.badgeText, { color: accentBase }]}>VICTORY JOURNAL</Text>
            </View>
            <Text style={[styles.heading, { color: textPrimary }]}>
              {isLoginTab ? (
                <>Welcome <Text style={{ color: accentBase }}>back ✦</Text></>
              ) : (
                <>Start your <Text style={{ color: accentBase }}>journey ✦</Text></>
              )}
            </Text>
            <Text style={[styles.subText, { color: textSecondary }]}>
              {isLoginTab ? "Sign in to access your victories." : "Create a free account to start tracking your wins."}
            </Text>
          </View>

          {/* Tab switcher */}
          <View style={[styles.tabRow, { backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", borderColor }]}>
            {["login", "register"].map((tabName) => {
              const active = tab === tabName;
              return (
                <TouchableOpacity
                  key={tabName}
                  onPress={() => switchTab(tabName)}
                  style={[styles.tabBtn, active && { backgroundColor: accentBg, borderColor: accentBorder, borderWidth: 1 }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabBtnText, { color: active ? accentBase : textSecondary, fontWeight: active ? "700" : "400" }]}>
                    {tabName === "login" ? "Sign In" : "Create Account"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Google button */}
          <TouchableOpacity
            onPress={handleGooglePress}
            disabled={googleDisabled}
            style={[styles.googleBtn, {
              backgroundColor: colorMode === "dark" ? "rgba(255,255,255,0.06)" : "white",
              borderColor: dividerColor,
              opacity: googleDisabled ? 0.5 : 1,
            }]}
            activeOpacity={0.8}
          >
            <GoogleIcon />
            <Text style={[styles.googleBtnText, { color: textPrimary }]}>
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
            <Text style={[styles.dividerText, { color: textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textPrimary }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textPrimary }]}
                placeholder="you@example.com"
                placeholderTextColor={textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textPrimary }]}>Password</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  style={[styles.input, styles.passwordInput, { backgroundColor: inputBg, borderColor: inputBorder, color: textPrimary }]}
                  placeholder={isLoginTab ? "Your password" : "At least 6 characters"}
                  placeholderTextColor={textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete={isLoginTab ? "current-password" : "new-password"}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  activeOpacity={0.6}
                >
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {!!error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
              <LinearGradient
                colors={Array.isArray(accentGrad) ? accentGrad : [accentBase, accentBase]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={[styles.submitBtn, loading && { opacity: 0.6 }]}
              >
                <Text style={[styles.submitBtnText, { color: invertText }]}>
                  {loading
                    ? (isLoginTab ? "Signing in…" : "Creating account…")
                    : (isLoginTab ? "Sign In →" : "Create Account →")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footerBlock}>
            <Text style={[styles.footerText, { color: textSecondary }]}>
              {isLoginTab ? "Don't have an account? " : "Already have an account? "}
              <Text
                style={{ color: accentBase, fontWeight: "500" }}
                onPress={() => switchTab(isLoginTab ? "register" : "login")}
              >
                {isLoginTab ? "Create one →" : "Sign in →"}
              </Text>
            </Text>
            <Text style={[styles.sparkle, { color: accentBorder }]}>✦</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, gap: 28 },
  headerBlock: { gap: 12 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: "700", letterSpacing: 2 },
  heading: { fontSize: 32, fontWeight: "800", lineHeight: 40 },
  subText: { fontSize: 14, fontWeight: "300" },
  tabRow: {
    flexDirection: "row", borderRadius: 999, borderWidth: 1,
    padding: 4, gap: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center" },
  tabBtnText: { fontSize: 13 },
  googleBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, borderWidth: 1, borderRadius: 16, paddingVertical: 18,
  },
  googleBtnText: { fontSize: 14, fontWeight: "500" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11 },
  form: { gap: 16 },
  formGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "500" },
  input: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, fontSize: 15 },
  passwordWrap: { position: "relative" },
  passwordInput: { paddingRight: 48 },
  eyeBtn: { position: "absolute", right: 16, top: 0, bottom: 0, justifyContent: "center" },
  errorText: { color: "#E53E3E", fontSize: 13, marginTop: -4 },
  submitBtn: { borderRadius: 24, paddingVertical: 20, alignItems: "center", marginTop: 4 },
  submitBtnText: { fontSize: 16, fontWeight: "700" },
  footerBlock: { alignItems: "center", gap: 12, paddingTop: 8 },
  footerText: { fontSize: 12, textAlign: "center" },
  sparkle: { fontSize: 18 },
});
