import React from 'react';
import type { Metadata } from 'next';
import { PixelResizer } from '@/components/tool-ui/PixelResizer';

export const metadata: Metadata = {
  title: 'Product Image Resizer for E-commerce Sellers | SizeSnap',
  description: 'Resize product images to exact pixel dimensions for e-commerce listings.',
};

export default function ProductImageResizerPage() {
  return <PixelResizer customTitle="Product Image Resizer" />;
}
