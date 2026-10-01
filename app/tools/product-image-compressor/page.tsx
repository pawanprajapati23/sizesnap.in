import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { KbCompressor } from '@/components/tool-ui/KbCompressor';

export const metadata: Metadata = {
  title: 'Product Image Compressor for E-commerce Sellers | SizeSnap',
  description: 'Compress product images for e-commerce listings while maintaining quality.',
};

export default function ProductImageCompressorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading compressor...</div>}>
      <KbCompressor title="Product Image Compressor" initialTargetKb={500} showSeoContent={false} />
    </Suspense>
  );
}
