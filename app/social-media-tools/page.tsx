import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Social Media Image Tools | Resize & Compress for Web | SizeSnap',
  description:
    'Free tools to perfectly resize, crop, and compress images for Instagram, WhatsApp, YouTube, Facebook, and LinkedIn. Keep high quality without exceeding limits.',
  alternates: {
    canonical: 'https://sizesnap.in/social-media-tools',
  },
};

export default function SocialMediaToolsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Social Media Tools', url: '/social-media-tools' },
  ];

  return (
    <CategoryHubPage
      title="Social Media Image Tools"
      description="Resize, compress, and convert images perfectly tailored for platforms like Instagram, WhatsApp, YouTube, and LinkedIn. 100% offline."
      breadcrumbs={breadcrumbs}
      category="Social"
      customSlugs={[
        'resize-image-pixel',
        'crop-image',
        'image-framer',
        'compress-image-to-100kb',
        'compress-image-to-300kb',
        'compress-image-to-500kb',
        'blur-background',
        'add-watermark-pdf',
        'image-watermark',
      ]}
    />
  );
}
