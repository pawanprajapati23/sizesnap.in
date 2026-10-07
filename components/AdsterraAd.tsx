'use client';
import React, { useState, useEffect } from 'react';

interface AdsterraAdProps {
  dataKey: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdsterraAd({ dataKey, width, height, className = '' }: AdsterraAdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    // Render a placeholder while SSR to avoid hydration mismatch
    return (
      <div 
        className={`bg-gray-50 flex flex-col items-center justify-center border border-gray-200 rounded-sm ${className}`}
        style={{ width: width, height: height }}
      >
        <span className="text-xs text-gray-400">Advertisement</span>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center overflow-hidden ${className}`}>
      <iframe
        srcDoc={srcDoc}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}
