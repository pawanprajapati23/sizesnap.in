'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackToolUsage, trackDownload } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';

// Dynamically trigger Monetag Vignette only after the user clicks Download
function triggerPostDownloadVignette() {
  if (typeof window === 'undefined') return;
  // If already loaded in this session, do not duplicate
  if (document.getElementById('monetag-vignette')) return;

  try {
    const script = document.createElement('script');
    script.id = 'monetag-vignette';
    script.src = 'https://n6wxm.com/vignette.min.js';
    script.setAttribute('data-zone', '11970631');
    script.async = true;
    document.body.appendChild(script);
  } catch (err) {
    console.error('Failed to load post-download sponsor ad:', err);
  }
}

// Dynamically load Monetag In-Page Push on first user interaction or delay
// Keeps initial page load and Lighthouse Core Web Vitals at 95+ (0ms TBT impact)
function initMonetagInPagePush() {
  if (typeof window === 'undefined') return;
  if (document.getElementById('monetag-in-page-push')) return;

  let loaded = false;
  const loadScript = () => {
    if (loaded || document.getElementById('monetag-in-page-push')) return;
    loaded = true;
    try {
      const script = document.createElement('script');
      script.id = 'monetag-in-page-push';
      script.src = 'https://nap5k.com/tag.min.js';
      script.setAttribute('data-zone', '12042471');
      script.async = true;
      document.body.appendChild(script);
    } catch (err) {
      console.error('Failed to load in-page sponsor ad:', err);
    }
    cleanup();
  };

  const cleanup = () => {
    window.removeEventListener('scroll', loadScript);
    window.removeEventListener('touchstart', loadScript);
    window.removeEventListener('mousemove', loadScript);
    window.removeEventListener('keydown', loadScript);
    window.removeEventListener('click', loadScript);
  };

  window.addEventListener('scroll', loadScript, { passive: true, once: true });
  window.addEventListener('touchstart', loadScript, { passive: true, once: true });
  window.addEventListener('mousemove', loadScript, { passive: true, once: true });
  window.addEventListener('keydown', loadScript, { passive: true, once: true });
  window.addEventListener('click', loadScript, { passive: true, once: true });

  return () => {
    cleanup();
  };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track tool usage based on page view
    if (pathname) {
      // Find if the current path matches any tool slug
      const segments = pathname.split('/');
      const lastSegment = segments[segments.length - 1];
      
      if (lastSegment) {
        // Check if it's a known tool
        const isTool = ALL_TOOLS.some(tool => tool.slug === lastSegment);
        if (isTool) {
          trackToolUsage(lastSegment);
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    // Global click listener for downloads
    const handleClick = (e: MouseEvent) => {
      // Find closest element with href containing 'download' or text containing 'download'
      let target = e.target as HTMLElement | null;
      
      while (target && target !== document.body) {
        // Check for download attribute, or common download classes/text
        const hasDownloadAttr = target.hasAttribute('download');
        const text = target.innerText?.toLowerCase() || '';
        const isDownloadButton = 
          target.tagName === 'BUTTON' && 
          (text.includes('download') || text.includes('save'));
        const isDownloadLink = 
          target.tagName === 'A' && 
          (hasDownloadAttr || text.includes('download'));

        if (hasDownloadAttr || isDownloadButton || isDownloadLink) {
          const pathSlug = pathname ? pathname.replace(/^\/tools\//, '').replace(/^\//, '').split('/')[0] : undefined;
          trackDownload(pathSlug);
          // Post-download sponsor ad: Triggers only AFTER user completes their task
          triggerPostDownloadVignette();
          break; // Stop climbing the DOM tree once we matched
        }
        target = target.parentElement;
      }
    };

    // Initialize In-Page Push on first user interaction or delay (Zero CWV penalty)
    const cleanupAd = initMonetagInPagePush();

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      if (cleanupAd) cleanupAd();
    };
  }, []);

  return null; // This component doesn't render anything
}
