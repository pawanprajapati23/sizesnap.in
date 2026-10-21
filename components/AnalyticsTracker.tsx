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
          trackDownload();
          // Post-download sponsor ad: Triggers only AFTER user completes their task
          triggerPostDownloadVignette();
          break; // Stop climbing the DOM tree once we matched
        }
        target = target.parentElement;
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null; // This component doesn't render anything
}
