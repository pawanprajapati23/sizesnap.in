import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, increment, push } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBayDRzocfhvlcwQpK1BEVdfBfTbuP1KNs",
  authDomain: "sizesnapji.firebaseapp.com",
  databaseURL: "https://sizesnapji-default-rtdb.firebaseio.com",
  projectId: "sizesnapji",
  messagingSenderId: "350460574294",
  appId: "1:350460574294:web:3f788a1f3a84748bf4d9f7",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Lazy Auth instance: Only initializes if code actually uses auth (e.g. in /admin)
// Prevents downloading the hidden auth iframe on public tool pages
let _authInstance: ReturnType<typeof getAuth> | null = null;
export const auth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_, prop) {
    if (!_authInstance) {
      _authInstance = getAuth(app);
    }
    return (_authInstance as any)[prop];
  },
});

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

export interface ProcessingTelemetry {
  tool: string;
  toolName?: string;
  fileType?: 'image' | 'pdf' | 'text' | 'other';
  inputKb?: number;
  outputKb?: number;
  targetKb?: number;
}

export const trackProcessingSuccess = async (data: ProcessingTelemetry): Promise<string | null> => {
  try {
    const now = Date.now();
    const hourTimestamp = getCurrentHourTimestamp();

    // 1. Increment standard toolUsage counter
    const usageRef = ref(db, `toolUsage/${data.tool}/${hourTimestamp}`);
    await set(usageRef, increment(1));

    // 2. Increment toolSuccess counter
    const successRef = ref(db, `toolUsage/_success/${data.tool}/${hourTimestamp}`);
    await set(successRef, increment(1));

    // 3. Record recent live activity item (non-blocking)
    const activityRef = ref(db, `toolUsage/_activity`);
    const newActivityRef = push(activityRef);
    await set(newActivityRef, {
      tool: data.tool,
      toolName: data.toolName || data.tool,
      fileType: data.fileType || 'file',
      inputKb: data.inputKb || 0,
      outputKb: data.outputKb || 0,
      targetKb: data.targetKb || 0,
      status: 'success',
      timestamp: now
    });

    return newActivityRef.key;
  } catch (err) {
    console.error("Failed to track processing success:", err);
    return null;
  }
};

export const trackProcessingError = async (tool: string, reason?: string) => {
  try {
    const now = Date.now();
    const hourTimestamp = getCurrentHourTimestamp();

    // Increment error counter
    const errRef = ref(db, `toolUsage/_errors/${tool}/${hourTimestamp}`);
    await set(errRef, increment(1));

    // Also call existing trackToolError
    trackToolError(tool, 'processing_failed', reason).catch(() => {});

    // Record to live activity
    const activityRef = ref(db, `toolUsage/_activity`);
    const newActivityRef = push(activityRef);
    await set(newActivityRef, {
      tool,
      status: 'error',
      errorMessage: reason || 'Processing failed',
      timestamp: now
    });
  } catch (err) {
    console.error("Failed to track processing error:", err);
  }
};

export const trackDownload = async (tool?: string, activityId?: string) => {
  try {
    const hourTimestamp = getCurrentHourTimestamp();
    const downloadRef = ref(db, `downloads/${hourTimestamp}`);
    await set(downloadRef, increment(1));

    if (tool) {
      const toolDlRef = ref(db, `toolUsage/_downloads/${tool}/${hourTimestamp}`);
      await set(toolDlRef, increment(1));
    }

    if (activityId) {
      const itemRef = ref(db, `toolUsage/_activity/${activityId}/downloaded`);
      await set(itemRef, true);
    }
  } catch (err) {
    console.error("Failed to track download:", err);
  }
};

export interface LiveActivityItem {
  id: string;
  tool: string;
  toolName?: string;
  fileType?: string;
  inputKb?: number;
  outputKb?: number;
  targetKb?: number;
  status: 'success' | 'error';
  errorMessage?: string;
  downloaded?: boolean;
  timestamp: number;
}

export const fetchLiveActivity = async (limitCount = 60): Promise<LiveActivityItem[]> => {
  try {
    const snapshot = await get(ref(db, 'toolUsage/_activity'));
    if (!snapshot.exists()) return [];
    const val = snapshot.val();
    const items: LiveActivityItem[] = Object.entries(val).map(([id, item]: [string, any]) => ({
      id,
      ...item
    }));
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, limitCount);
  } catch (err) {
    console.error("Failed to fetch live activity:", err);
    return [];
  }
};

const recentErrors = new Map<string, number>();

export const trackToolError = async (slug: string, errorType: string, message?: string) => {
  try {
    const now = Date.now();
    const errorKey = `${slug}:${errorType}`;
    const lastReported = recentErrors.get(errorKey) || 0;

    // Throttle duplicate identical errors to once every 5 minutes per client session
    if (now - lastReported < 5 * 60 * 1000) {
      return;
    }
    recentErrors.set(errorKey, now);

    const timestamp = getCurrentHourTimestamp();

    // Aggregated counter for dashboard
    const errorAggRef = ref(db, `toolErrors/${slug}/${timestamp}`);
    await set(errorAggRef, increment(1));

    // Store detailed log
    const errorLogRef = ref(db, `errorLogs/${slug}`);
    await set(push(errorLogRef), {
      errorType,
      message: message || "Unknown error",
      timestamp: now,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    });

  } catch (err) {
    console.error("Failed to track tool error:", err);
  }
};

// ---- FEEDBACK LOGIC ----

export interface FeedbackData {
  type: string;
  message: string;
  url: string;
  timestamp: number;
}

export const submitFeedback = async (data: Omit<FeedbackData, 'timestamp'>) => {
  try {
    const feedbackRef = ref(db, 'feedback');
    const newFeedbackRef = push(feedbackRef);
    await set(newFeedbackRef, {
      ...data,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("Failed to submit feedback:", err);
    throw err;
  }
};

export const fetchAllFeedback = async (): Promise<(FeedbackData & { id: string })[]> => {
  try {
    const snapshot = await get(ref(db, 'feedback'));
    if (!snapshot.exists()) return [];
    
    const data = snapshot.val();
    const list = Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
    
    // Sort newest first
    return list.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error("Failed to fetch feedback:", err);
    return [];
  }
};

export const deleteFeedback = async (id: string) => {
  try {
    const feedbackRef = ref(db, `feedback/${id}`);
    await set(feedbackRef, null); // Setting to null deletes the node
  } catch (err) {
    console.error("Failed to delete feedback:", err);
    throw err;
  }
};

