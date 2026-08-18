import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Safe, asynchronous, non-blocking analytics tracker
export const trackEvent = async (
  eventName: string,
  payload: Record<string, any> = {}
) => {
  // If Firebase isn't initialized or fails, fail silently
  // We don't want analytics to ever break the public UI
  try {
    if (!db) return

    // Create a lightweight event object
    const event = {
      eventName,
      ...payload,
      timestamp: serverTimestamp(),
      // Add basic non-PII environment details if in browser
      url: typeof window !== 'undefined' ? window.location.pathname : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    }

    // Fire and forget (No await necessary here, but we wrap in try/catch to be ultra safe)
    addDoc(collection(db, 'analytics_events_raw'), event).catch(() => {
      // Ignore errors (e.g., ad blockers, network failures, quota limits)
    })
  } catch (error) {
    // Completely silent
  }
}
