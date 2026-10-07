'use client';
import React, { useState, useEffect, useRef } from 'react';

interface AdsterraAdProps {
  dataKey: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdsterraAd({ dataKey, width, height, className = '' }: AdsterraAdProps) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only set up observer on client
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          // Once loaded, we don't need to observe anymore
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before it comes into view
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const srcDoc = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { 
        margin: 0; 
        padding: 0; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        background: transparent; 
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <script>
      atOptions = {
        'key' : '${dataKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    </script>
    <script src="https://www.highrevenueformat.com/${dataKey}/invoke.js"></script>
  </body>
</html>
  `;

  return (
    <div 
      ref={containerRef} 
      className={`flex justify-center items-center overflow-hidden bg-gray-50 border border-gray-100 rounded-sm ${className}`}
      style={{ width: width, height: height }}
    >
      {!inView ? (
        <span className="text-xs text-gray-400">Advertisement</span>
      ) : (
        <iframe
          srcDoc={srcDoc}
          width={width}
          height={height}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          title="Advertisement"
          loading="lazy"
        />
      )}
    </div>
  );
}
