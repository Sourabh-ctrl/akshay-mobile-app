import React, { useState, useEffect, useRef } from "react";
import { View, StatusBar, Share, useColorScheme } from "react-native";
import { GluestackUIProvider, config } from "@gluestack-ui/themed";
import Toast from "react-native-toast-message";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

import { storage, initStorage } from "./src/storage";
import { buildTheme } from "./src/theme";
import { TAGS, LANGUAGES } from "./src/constants";
import { lookupString, getExtendedLongDateRepresentation } from "./src/utils";
import { apiUrl } from "./src/lib/api";

// ─── Pages & Components (to be created in src/pages and src/components) ──────
import Login from "./src/pages/Login";
import Profile from "./src/pages/Profile";
import Onboarding1 from "./src/pages/Onboarding1";
import Onboarding2 from "./src/pages/Onboarding2";
import Home from "./src/pages/Home";
import Search from "./src/pages/Search";
import Calendar from "./src/pages/Calendar";
import Day from "./src/pages/Day";
import Detail from "./src/pages/Detail";
import Spiral from "./src/pages/Spiral";
import Settings from "./src/pages/Settings";
import Stack from "./src/pages/Stack";
import NavBar from "./src/components/NavBar";
import Modals from "./src/components/Modals";

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) return null;
    return {
      token,
      id: payload.id,
      email: payload.email,
      name: payload.name || "",
      picture: payload.picture || "",
    };
  } catch {
    return null;
  }
}

export default function App() {
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => { initStorage().then(() => setStorageReady(true)); }, []);

  const systemScheme = useColorScheme();
  const [colorMode, setColorMode] = useState("dark");
  useEffect(() => {
    if (storageReady) {
      setColorMode(storage.getString("vj4_theme") || systemScheme || "dark");
    }
  }, [storageReady]);
  const toggleColorMode = () => {
    const next = colorMode === "dark" ? "light" : "dark";
    setColorMode(next);
    storage.set("vj4_theme", next);
  };

  const t = buildTheme(colorMode);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login");

  // ─── State ────────────────────────────────────────────────────────────────
  const [wins, setWins] = useState([]);
  const [meta, setMeta] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");

  // Hydrate all persisted state once storage cache is warm
  useEffect(() => {
    if (!storageReady) return;
    const token = storage.getString("vj4_token");
    const decoded = token ? decodeToken(token) : null;
    setUser(decoded);
    setWins(JSON.parse(storage.getString("vj4") || "[]"));
    setMeta(JSON.parse(storage.getString("vj4m") || "{}"));
    setSelectedLanguage(storage.getString("vj_slang") || "en-IN");
    setAudioRecordings(JSON.parse(storage.getString("vj4_audio") || "{}"));
    const savedMeta = JSON.parse(storage.getString("vj4m") || "{}");
    if (!decoded) setScreen("login");
    else setScreen(savedMeta.onboarded ? "home" : "ob1");
  }, [storageReady]);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [liveText, setLiveText] = useState("");
  const [textInputBox, setTextInputBox] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterTag, setSearchFilterTag] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState("idle");
  const [isEditableMode, setIsEditableMode] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [showShareNudge, setShowShareNudge] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState({});
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [targetDayData, setTargetDayData] = useState({
    year: null, month: null, day: null, dayWins: [],
  });
  const [selectedWinId, setSelectedWinId] = useState(null);
  const [previousScreenTracker, setPreviousScreenTracker] = useState("home");
  const [spiralWin, setSpiralWin] = useState({ text: "", details: "", anchor: "" });
  const [usedSpiralIds, setUsedSpiralIds] = useState([]);
  const [activeOverlays, setActiveOverlays] = useState({
    delete: false, clearAll: false, share: false, install: false,
  });

  // ─── Refs ─────────────────────────────────────────────────────────────────
  const audioPlayerRef = useRef(null);
  const liveTextRef = useRef("");
  const finalTranscriptRef = useRef("");

  // ─── Speech Recognition Events ────────────────────────────────────────────
  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results?.[0]?.transcript ?? "";
    if (event.isFinal) {
      // Accumulate confirmed segments — continuous mode fires separate utterances
      finalTranscriptRef.current = (finalTranscriptRef.current + " " + text).trim();
      liveTextRef.current = finalTranscriptRef.current;
      setLiveText(finalTranscriptRef.current);
    } else {
      // Show interim result combined with already-confirmed text
      const combined = (finalTranscriptRef.current + " " + text).trim();
      liveTextRef.current = combined;
      setLiveText(combined);
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
    setTranscriptionStatus("idle");
    if (liveTextRef.current.trim()) {
      setIsEditableMode(true);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setIsRecording(false);
    setTranscriptionStatus("idle");
    setSpeechError(event.message || "Speech recognition unavailable on this device");
  });

  // ─── Persistence ──────────────────────────────────────────────────────────
  useEffect(() => { storage.set("vj4", JSON.stringify(wins)); }, [wins]);
  useEffect(() => { storage.set("vj4m", JSON.stringify(meta)); }, [meta]);
  useEffect(() => { storage.set("vj_slang", selectedLanguage); }, [selectedLanguage]);
  useEffect(() => { storage.set("vj4_audio", JSON.stringify(audioRecordings)); }, [audioRecordings]);

  useEffect(() => {
    if (meta.onboarded) {
      const today = new Date().toDateString();
      const resurface = wins.find(
        (w) => w.resurface && new Date(w.resurface).toDateString() === today
      );
      if (resurface) {
        setTimeout(() => {
          routeToWin(resurface.id, "home");
          displayToast("A win resurfaced for you ✦");
        }, 1000);
      }
    }
  }, []);

  // ─── Toast ────────────────────────────────────────────────────────────────
  const displayToast = (message) => {
    Toast.show({ type: "success", text1: message, position: "bottom", visibilityTime: 2500 });
  };

  // ─── Haptics ──────────────────────────────────────────────────────────────
  const triggerHaptic = async (ms = 40) => {
    try {
      const Haptics = await import("expo-haptics");
      if (ms >= 60) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {}
  };

  // ─── Auth handlers ────────────────────────────────────────────────────────
  const handleLoginSuccess = ({ token, user: userData }) => {
    storage.set("vj4_token", token);
    setUser({ token, ...userData });
    setScreen(meta.onboarded ? "home" : "ob1");
  };

  const handleLogout = () => {
    storage.delete("vj4_token");
    setUser(null);
    setScreen("login");
  };

  const handleUpdateUser = ({ token, user: userData }) => {
    storage.set("vj4_token", token);
    setUser({ token, ...userData });
  };

  // ─── Navigation ───────────────────────────────────────────────────────────
  const navigate = (targetScreen) => {
    setSearchQuery("");
    setFilterTag(null);
    setSearchFilterTag(null);
    setShowCustomTagInput(false);
    setCustomTagInput("");
    setScreen(targetScreen);
  };

  const routeToWin = (id, from) => {
    setSelectedWinId(id);
    setPreviousScreenTracker(from);
    navigate("detail");
  };

  // ─── Stats ────────────────────────────────────────────────────────────────
  const calcStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const week = wins.filter((w) => new Date(w.date) >= weekAgo).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let grace = false;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const hit = wins.some((w) => new Date(w.date).toDateString() === d.toDateString());
      if (hit) {
        streak++;
      } else if (i === 0) {
        grace = true;
      } else {
        break;
      }
    }
    return { total: wins.length, streak, week, grace };
  };
  const stats = calcStats();
  const allTags = [...TAGS, ...(meta.customTags || [])];
  const activeDashboardFilteredWins = wins
    .filter((w) => !filterTag || w.tag === filterTag)
    .slice(0, 8);
  const activeSearchFilteredWins = wins.filter((w) => {
    const tagOk = !searchFilterTag || w.tag === searchFilterTag;
    const textOk =
      !searchQuery.trim() ||
      w.text.toLowerCase().includes(searchQuery.toLowerCase());
    return tagOk && textOk;
  });

  // ─── Onboarding ───────────────────────────────────────────────────────────
  const completeOnboarding = async () => {
    setMeta({ ...meta, onboarded: true });
    if (nameInput.trim() && user?.token) {
      try {
        const res = await fetch(apiUrl("/api/auth/profile"), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ name: nameInput.trim() }),
        });
        const data = await res.json();
        if (res.ok) handleUpdateUser(data);
      } catch {}
    }
    if (!wins.length) {
      setWins([{
        id: "sample_" + Date.now(),
        text: lookupString("sample_win"),
        date: new Date().toISOString(),
        resurface: null,
        tag: null,
        sample: true,
      }]);
    }
    setScreen("home");
  };

  // ─── Speech Recognition (expo-speech-recognition) ────────────────────────
  const startRecording = async () => {
    setSpeechError("");
    triggerHaptic(30);
    setLiveText("");
    liveTextRef.current = "";
    finalTranscriptRef.current = "";
    setTextInputBox("");
    setSelectedTag(null);
    setIsEditableMode(false);
    setIsRecording(true);
    setTranscriptionStatus("listening");
    try {
      const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) {
        setIsRecording(false);
        setTranscriptionStatus("idle");
        setSpeechError("Microphone permission required.");
        return;
      }
      ExpoSpeechRecognitionModule.start({
        lang: selectedLanguage,
        interimResults: true,
        continuous: true,
      });
    } catch {
      setIsRecording(false);
      setTranscriptionStatus("idle");
      setSpeechError("Speech recognition failed to start.");
    }
  };

  const stopRecording = () => {
    triggerHaptic(20);
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {}
  };

  const clearInput = () => {
    setLiveText("");
    liveTextRef.current = "";
    finalTranscriptRef.current = "";
    setTextInputBox("");
    setIsRecording(false);
    setSelectedTag(null);
    setSpeechError("");
    setIsEditableMode(false);
    setTranscriptionStatus("idle");
    setShowCustomTagInput(false);
    setCustomTagInput("");
    try { ExpoSpeechRecognitionModule.stop(); } catch {}
  };

  const saveWin = () => {
    const text = liveText.trim();
    if (!text) return;
    const win = {
      id: Date.now().toString(),
      text,
      date: new Date().toISOString(),
      resurface: null,
      tag: selectedTag,
    };
    setWins((prev) => [win, ...prev]);
    triggerHaptic(60);
    clearInput();
    displayToast("Victory stacked ✦");
    setTimeout(() => {
      setSelectedWinId(win.id);
      setPreviousScreenTracker("home");
      setShowShareNudge(true);
    }, 400);
  };

  const micToggle = () => (isRecording ? stopRecording() : startRecording());

  // ─── Win actions ──────────────────────────────────────────────────────────
  const toggleResurface = () => {
    if (!selectedWinId) return;
    const updated = [...wins];
    const i = updated.findIndex((w) => w.id === selectedWinId);
    if (i < 0) return;
    if (updated[i].resurface) {
      updated[i].resurface = null;
      setWins(updated);
      displayToast("Resurface removed");
    } else {
      const days = [7, 10, 14, 21][Math.floor(Math.random() * 4)];
      const d = new Date();
      d.setDate(d.getDate() + days);
      updated[i].resurface = d.toISOString();
      setWins(updated);
      displayToast(`Will return in ${days} days`);
    }
  };

  const deleteWin = () => {
    if (!selectedWinId) return;
    setWins(wins.filter((w) => w.id !== selectedWinId));
    setAudioRecordings((prev) => {
      const u = { ...prev };
      delete u[selectedWinId];
      return u;
    });
    setActiveOverlays((prev) => ({ ...prev, delete: false }));
    displayToast("Victory removed");
    navigate(previousScreenTracker);
  };

  const clearAllWins = () => {
    setWins([]);
    setAudioRecordings({});
    setActiveOverlays((prev) => ({ ...prev, clearAll: false }));
    displayToast("All victories cleared");
  };

  const changeTag = (tag) => {
    if (!selectedWinId) return;
    const updated = [...wins];
    const i = updated.findIndex((w) => w.id === selectedWinId);
    if (i < 0) return;
    updated[i].tag = tag;
    setWins(updated);
    triggerHaptic(20);
    displayToast(tag ? `Tagged as ${tag}` : "Tag removed");
  };

  const toggleAudioPlayback = async (winId) => {
    if (audioPlayerRef.current) {
      await audioPlayerRef.current.stopAsync();
      await audioPlayerRef.current.unloadAsync();
      audioPlayerRef.current = null;
    }
    if (playingAudioId === winId) { setPlayingAudioId(null); return; }
    const rec = audioRecordings[winId];
    if (!rec) return;
    try {
      const { Audio } = await import("expo-av");
      const { FileSystem } = await import("expo-file-system");
      const tempUri = FileSystem.cacheDirectory + `audio_${winId}.m4a`;
      await FileSystem.writeAsStringAsync(tempUri, rec.data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const { sound } = await Audio.Sound.createAsync({ uri: tempUri });
      audioPlayerRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingAudioId(null);
          sound.unloadAsync();
          audioPlayerRef.current = null;
        }
      });
      await sound.playAsync();
      setPlayingAudioId(winId);
    } catch {}
  };

  const addCustomTag = (name) => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 20) return;
    const existing = [...TAGS, ...(meta.customTags || [])];
    if (existing.some((tg) => tg.toLowerCase() === trimmed.toLowerCase())) {
      displayToast("Tag already exists");
      return;
    }
    setMeta((prev) => ({
      ...prev,
      customTags: [...(prev.customTags || []), trimmed],
    }));
    setCustomTagInput("");
    setShowCustomTagInput(false);
    displayToast(`"${trimmed}" tag created ✦`);
  };

  const removeCustomTag = (name) => {
    setMeta((prev) => ({
      ...prev,
      customTags: (prev.customTags || []).filter((tg) => tg !== name),
    }));
    setWins((prev) => prev.map((w) => (w.tag === name ? { ...w, tag: null } : w)));
    displayToast(`"${name}" tag removed`);
  };

  // ─── Spiral ───────────────────────────────────────────────────────────────
  const genSpiralWin = () => {
    let ids = [...usedSpiralIds];
    if (!wins.length) {
      setSpiralWin({
        text: lookupString("empty_spiral"),
        details: "",
        anchor: lookupString("anchors")[0],
      });
      return;
    }
    if (ids.length >= wins.length) ids = [];
    const pool = wins.filter((w) => !ids.includes(w.id));
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    ids.push(chosen.id);
    setUsedSpiralIds(ids);
    setSpiralWin({
      text: chosen.text,
      details:
        (chosen.tag ? chosen.tag + " · " : "") +
        getExtendedLongDateRepresentation(chosen.date),
      anchor:
        lookupString("anchors")[
          Math.floor(Math.random() * lookupString("anchors").length)
        ],
    });
  };

  const startSpiral = () => {
    setUsedSpiralIds([]);
    navigate("spiral");
    setTimeout(genSpiralWin, 50);
  };

  // ─── Share ────────────────────────────────────────────────────────────────
  const openShare = (key, open) =>
    setActiveOverlays((prev) => ({ ...prev, [key]: open }));

  const nativeShare = async () => {
    const win = wins.find((w) => w.id === selectedWinId);
    if (!win) return;
    try {
      await Share.share({
        message: `✦ My Victory\n\n"${win.text}"\n\n— Victory Journal`,
      });
    } catch {}
  };

  // ─── Data export / import ─────────────────────────────────────────────────
  const exportData = async () => {
    try {
      const { FileSystem } = await import("expo-file-system");
      const Sharing = await import("expo-sharing");
      const json = JSON.stringify(
        { exported: new Date().toISOString(), meta, wins },
        null,
        2
      );
      const path =
        FileSystem.documentDirectory + `victory-journal-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(path, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(path);
      displayToast("Exported successfully");
    } catch {
      displayToast("Export failed");
    }
  };

  const importData = async () => {
    try {
      const DocumentPicker = await import("expo-document-picker");
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      if (result.canceled) return;
      const { FileSystem } = await import("expo-file-system");
      const text = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const data = JSON.parse(text);
      const incoming = data.wins || (Array.isArray(data) ? data : []);
      if (!incoming.length) { displayToast("No victories found in file"); return; }
      const existingIds = new Set(wins.map((w) => w.id));
      const newWins = incoming.filter((w) => !existingIds.has(w.id));
      setWins(
        [...wins, ...newWins].sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      if (data.meta?.customTags && !meta.customTags) {
        setMeta((prev) => ({ ...prev, customTags: data.meta.customTags }));
      }
      displayToast(`Imported ${newWins.length} victories`);
    } catch {
      displayToast("Could not read file");
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (!storageReady) {
    return (
      <View style={{ flex: 1, backgroundColor: "#08090A" }} />
    );
  }

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle={colorMode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={t.bgBase}
      />
      <View style={{ flex: 1, backgroundColor: t.bgBase }}>
        {screen === "login" && (
          <Login t={t} onLoginSuccess={handleLoginSuccess} />
        )}
        {screen === "profile" && (
          <Profile
            t={t}
            user={user}
            wins={wins}
            onBack={() => navigate("home")}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
          />
        )}
        {screen === "ob1" && <Onboarding1 t={t} onNext={() => navigate("ob2")} />}
        {screen === "ob2" && (
          <Onboarding2
            t={t}
            nameInput={nameInput}
            setNameInput={setNameInput}
            onComplete={completeOnboarding}
          />
        )}
        {screen === "home" && (
          <Home
            t={t}
            user={user}
            meta={meta}
            wins={wins}
            stats={stats}
            allTags={allTags}
            isRecording={isRecording}
            liveText={liveText}
            setLiveText={setLiveText}
            textInputBox={textInputBox}
            handleManualTextInput={(v) => { setTextInputBox(v); setLiveText(v); }}
            transcriptionStatus={transcriptionStatus}
            isEditableMode={isEditableMode}
            speechError={speechError}
            hasVoiceSupport={true}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            showCustomTagInput={showCustomTagInput}
            setShowCustomTagInput={setShowCustomTagInput}
            customTagInput={customTagInput}
            setCustomTagInput={setCustomTagInput}
            showShareNudge={showShareNudge}
            setShowShareNudge={setShowShareNudge}
            activeDashboardFilteredWins={activeDashboardFilteredWins}
            onClear={clearInput}
            onSave={saveWin}
            onAddCustomTag={addCustomTag}
            onNavigate={navigate}
            onViewWin={routeToWin}
            onSpiral={startSpiral}
            onOpenShare={() => openShare("share", true)}
          />
        )}
        {screen === "search" && (
          <Search
            t={t}
            wins={wins}
            allTags={allTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchFilterTag={searchFilterTag}
            setSearchFilterTag={setSearchFilterTag}
            activeSearchFilteredWins={activeSearchFilteredWins}
            onViewWin={routeToWin}
          />
        )}
        {screen === "calendar" && (
          <Calendar
            t={t}
            wins={wins}
            currentCalendarDate={currentCalendarDate}
            onPrevMonth={() => {
              const d = new Date(currentCalendarDate);
              d.setMonth(d.getMonth() - 1);
              setCurrentCalendarDate(d);
            }}
            onNextMonth={() => {
              const d = new Date(currentCalendarDate);
              d.setMonth(d.getMonth() + 1);
              setCurrentCalendarDate(d);
            }}
            onViewWin={routeToWin}
            onViewDay={(data) => { setTargetDayData(data); navigate("day"); }}
          />
        )}
        {screen === "day" && (
          <Day
            t={t}
            targetDayData={targetDayData}
            onBack={() => navigate("calendar")}
            onViewWin={routeToWin}
          />
        )}
        {screen === "detail" && (
          <Detail
            t={t}
            win={wins.find((w) => w.id === selectedWinId)}
            allTags={allTags}
            audioRecordings={audioRecordings}
            playingAudioId={playingAudioId}
            onToggleAudio={toggleAudioPlayback}
            showCustomTagInput={showCustomTagInput}
            setShowCustomTagInput={setShowCustomTagInput}
            customTagInput={customTagInput}
            setCustomTagInput={setCustomTagInput}
            onAddCustomTag={addCustomTag}
            onTagChange={changeTag}
            onBack={() => navigate(previousScreenTracker)}
            onShare={() => openShare("share", true)}
            onResurface={toggleResurface}
            onDelete={() => openShare("delete", true)}
          />
        )}
        {screen === "spiral" && (
          <Spiral
            t={t}
            spiralWin={spiralWin}
            onNext={genSpiralWin}
            onBack={() => navigate("home")}
          />
        )}
        {screen === "settings" && (
          <Settings
            t={t}
            meta={meta}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            showCustomTagInput={showCustomTagInput}
            setShowCustomTagInput={setShowCustomTagInput}
            customTagInput={customTagInput}
            setCustomTagInput={setCustomTagInput}
            onAddCustomTag={addCustomTag}
            onRemoveCustomTag={removeCustomTag}
            onExport={exportData}
            onImport={importData}
            onClearAll={() => openShare("clearAll", true)}
            onBack={() => navigate("home")}
            toggleColorMode={toggleColorMode}
          />
        )}
        {screen === "stack" && (
          <Stack t={t} wins={wins} onViewWin={routeToWin} />
        )}

        {meta.onboarded &&
          ["home", "search", "calendar", "stack"].includes(screen) && (
            <NavBar
              t={t}
              screen={screen}
              isRecording={isRecording}
              onNavigate={navigate}
              onMicToggle={micToggle}
            />
          )}

        <Modals
          t={t}
          activeOverlays={activeOverlays}
          onClose={(key) => setActiveOverlays((prev) => ({ ...prev, [key]: false }))}
          onDelete={deleteWin}
          onClearAll={clearAllWins}
          shareWinText={wins.find((w) => w.id === selectedWinId)?.text || ""}
          onNativeShare={nativeShare}
          colorMode={colorMode}
        />
      </View>
      <Toast />
    </GluestackUIProvider>
  );
}
