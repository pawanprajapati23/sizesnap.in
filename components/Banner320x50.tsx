"use client";

import Script from "next/script";

export default function Banner320x50() {
  return (
    <>
      <Script id="adsterra-banner-config" strategy="afterInteractive">
        {`
          window.atOptions = {
            key: 'f509bd7d24a58ce7a176067713ca61df',
            format: 'iframe',
            height: 50,
            width: 320,
            params: {}
          };
        `}
      </Script>

      <Script
        src="https://www.highperformanceformat.com/f509bd7d24a58ce7a176067713ca61df/invoke.js"
        strategy="afterInteractive"
      />
    </>
  );
}
