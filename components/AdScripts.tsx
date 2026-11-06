'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function AdScripts() {
  const pathname = usePathname();

  // Strictly disable ALL ad scripts, popups, and monetization tags on any admin page
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* High-performance non-blocking ad network tag */}
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="306772"
        strategy="afterInteractive"
        data-cfasync="false"
      />

      {/* Google AdSense */}
      {process.env.NEXT_PUBLIC_ADSENSE_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
