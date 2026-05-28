import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In-memory cache — gives sync reads while AsyncStorage persists in the background
const cache = {};

export const storage = {
  getString: (key) => cache[key],

  set: (key, value) => {
    const str = String(value);
    cache[key] = str;
    AsyncStorage.setItem(key, str).catch(() => {});
  },

  delete: (key) => {
    delete cache[key];
    AsyncStorage.removeItem(key).catch(() => {});
  },
};

// Call once before rendering — loads all persisted values into the cache
export async function initStorage() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length) {
      const pairs = await AsyncStorage.multiGet(keys);
      pairs.forEach(([k, v]) => { if (v !== null) cache[k] = v; });
    }
  } catch {}
}
