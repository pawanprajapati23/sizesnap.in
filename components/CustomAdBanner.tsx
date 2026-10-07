'use client';
import React, { useEffect, useState } from 'react';
import { getCustomAdConfig, CustomAdConfig } from '@/lib/firebase';
import Image from 'next/image';

export default function CustomAdBanner() {
  const [adConfig, setAdConfig] = useState<CustomAdConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      const config = await getCustomAdConfig();
      setAdConfig(config);
      setLoading(false);
    }
    loadConfig();
  }, []);

  if (loading || !adConfig || !adConfig.isActive || !adConfig.imageUrl) {
    return null;
  }

  // Ensure absolute URL
  let targetUrl = adConfig.targetUrl?.trim();
  if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  const BannerContent = (
    <div className="relative w-full overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-transform hover:scale-[1.01] bg-gray-50 flex items-center justify-center">
      <Image
        src={adConfig.imageUrl}
        alt="Advertisement"
        width={1200}
        height={300}
        className="w-full h-auto object-contain max-h-[300px]"
        unoptimized // Allow external/Base64 URLs
      />
      <span className="absolute top-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm z-10 shadow-sm pointer-events-none">
        Ad
      </span>
    </div>
  );

  return (
    <section className="my-8">
      {targetUrl ? (
        <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
          {BannerContent}
        </a>
      ) : (
        BannerContent
      )}
    </section>
  );
}
