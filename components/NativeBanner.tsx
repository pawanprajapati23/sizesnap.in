"use client";

import Script from "next/script";

export default function NativeBanner() {
  return (
    <>
      <Script
        src="https://pl30319601.effectivecpmnetwork.com/3c50f070687ff0a0e6143f7bb79d91c9/invoke.js"
        strategy="afterInteractive"
      />
      <div id="container-3c50f070687ff0a0e6143f7bb79d91c9"></div>
    </>
  );
}
