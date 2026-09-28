'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackToolUsage, trackDownload } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track tool usage based on page view
    if (pathname) {
      // Find if the current path matches any tool slug
      // Our slugs usually match the last segment of the path
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
