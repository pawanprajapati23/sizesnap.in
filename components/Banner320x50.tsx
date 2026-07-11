"use client";

import { useEffect, useRef } from "react";

export default function Banner320x50() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 0; background: transparent; overflow: hidden; display: flex; justify-content: center; align-items: center; }
              </style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : 'f509bd7d24a58ce7a176067713ca61df',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highperformanceformat.com/f509bd7d24a58ce7a176067713ca61df/invoke.js"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, []);

  return (
    <div className="flex justify-center w-full my-4 overflow-hidden min-h-[50px] bg-slate-50 border-y border-slate-100">
      <iframe
        ref={iframeRef}
        title="Adsterra 320x50"
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        className="max-w-full"
      />
    </div>
  );
}
