'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the real tracker so it's not included in the initial SSR payload
const PresenceTracker = dynamic(() => import('./PresenceTracker'), { ssr: false });

export default function PresenceTrackerWrapper() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading the presence tracker by 3 seconds so it absolutely does not affect Core Web Vitals (LCP/FID/INP)
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;
  return <PresenceTracker />;
}
