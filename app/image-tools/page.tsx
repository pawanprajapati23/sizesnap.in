import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Free Image Tools | Compress, Resize & Edit Online | SizeSnap',
  description:
    'Free online image tools to compress, resize, format and edit pictures directly in your browser securely.',
  alternates: {
    canonical: 'https://sizesnap.in/image-tools',
  },
};

export default function ImageToolsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Image Tools', url: '/image-tools' },
  ];

  return (
    <CategoryHubPage
      title="Image Tools"
      description="All your essential image processing needs in one place. Fast, local, and private."
      breadcrumbs={breadcrumbs}
      category="image"
      customSlugs={[
        'compress-image',
        'resize-image-pixel',
        'crop-image',
        'remove-background',
        'image-to-webp',
        'image-to-pdf',
        'blur-background',
        'image-watermark',
      ]}
    />
  );
}
