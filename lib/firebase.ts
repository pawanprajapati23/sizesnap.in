// lib/firebase.ts
// Firebase client initialization for admin panel usage tracking
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBayDRzocfhvlcwQpK1BEVdfBfTbuP1KNs",
  authDomain: "sizesnapji.firebaseapp.com",
  databaseURL: "https://sizesnapji-default-rtdb.firebaseio.com",
  projectId: "sizesnapji",
  storageBucket: "sizesnapji.firebasestorage.app",
  messagingSenderId: "350460574294",
  appId: "1:350460574294:web:3f788a1f3a84748bf4d9f7",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

/**
 * Helper to fetch usage data for a given path.
 * Returns a plain object where keys are timestamps (ms) and values are counts.
 */
export async function fetchUsage(path: string): Promise<Record<string, number>> {
  const snapshot = await get(ref(db, path));
  if (!snapshot.exists()) return {};
  // Assume data is stored as { <timestamp>: count }
  const data = snapshot.val();
  return typeof data === "object" ? data : {};
}

/**
 * Utility to aggregate counts within a time window.
 * `records` is a map of timestamp (ms) -> count.
 * `ms` is the window size in milliseconds.
 */
export function aggregateWithin(records: Record<string, number>, ms: number): number {
  const now = Date.now();
  let total = 0;
  for (const [tsStr, cnt] of Object.entries(records)) {
    const ts = Number(tsStr);
    if (now - ts <= ms) total += cnt;
  }
  return total;
}
