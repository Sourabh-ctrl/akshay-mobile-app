// Replace with your deployed Express server URL for production.
// For local dev: use your computer's LAN IP (e.g. http://192.168.1.15:5000)
// because 'localhost' on a phone refers to the phone itself, not your PC.
const BASE = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");

export const apiUrl = (path) => `${BASE}${path}`;
