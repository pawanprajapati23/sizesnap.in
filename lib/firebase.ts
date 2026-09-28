import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, increment } from "firebase/database";
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

export async function fetchUsage(path: string): Promise<Record<string, number>> {
  const snapshot = await get(ref(db, path));
  if (!snapshot.exists()) return {};
  const data = snapshot.val();
  return typeof data === "object" ? data : {};
}

export function aggregateWithin(records: Record<string, number>, ms: number): number {
  const now = Date.now();
  let total = 0;
  for (const [tsStr, cnt] of Object.entries(records)) {
    const ts = Number(tsStr);
    if (now - ts <= ms) total += cnt;
  }
  return total;
}

// ---- NEW TRACKING LOGIC ----

// Utility to get start of current hour timestamp (ms) to group data
const getCurrentHourTimestamp = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return now.getTime().toString();
};

export const trackToolUsage = async (slug: string) => {
  try {
    const timestamp = getCurrentHourTimestamp();
    const usageRef = ref(db, `toolUsage/${slug}/${timestamp}`);
    // Using increment from firebase/database to safely increment the counter
    await set(usageRef, increment(1));
  } catch (err) {
    console.error("Failed to track tool usage:", err);
  }
};

export const trackDownload = async () => {
  try {
    const timestamp = getCurrentHourTimestamp();
    const downloadRef = ref(db, `downloads/${timestamp}`);
    await set(downloadRef, increment(1));
  } catch (err) {
    console.error("Failed to track download:", err);
  }
};
