'use client';

import { useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, set, onDisconnect, push } from 'firebase/database';

export default function PresenceTracker() {
  useEffect(() => {
    // Narrowing type for TS
    const db = rtdb;
    if (!db) return;

    // A special reference provided by Firebase to check client's connection state
    const connectedRef = ref(db, '.info/connected');
    
    const unsubscribe = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)!
        // Create a reference to the active_users node
        const activeUsersRef = ref(db, 'active_users');
        // Push a new session node for this user
        const myConnectionsRef = push(activeUsersRef);

        // When I disconnect, remove this device
        onDisconnect(myConnectionsRef).remove().then(() => {
          // Add this device to the active_users list
          set(myConnectionsRef, {
            connected_at: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 50) // Store tiny info for fun if needed
          });
        });
      }
    });

    return () => {
      // Clean up the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything visually
}
