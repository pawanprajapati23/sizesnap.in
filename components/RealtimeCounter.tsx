'use client';

import { useEffect, useState } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Users } from 'lucide-react';

export default function RealtimeCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const db = rtdb;
    if (!db) return;
    const activeUsersRef = ref(db, 'active_users');
    const unsubscribe = onValue(activeUsersRef, (snap) => {
      if (snap.exists()) {
        setCount(Object.keys(snap.val()).length);
      } else {
        setCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
        <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
      </div>
      <Users className="w-3.5 h-3.5" />
      <span>{count} {count === 1 ? 'Active User' : 'Active Users'}</span>
    </div>
  );
}
