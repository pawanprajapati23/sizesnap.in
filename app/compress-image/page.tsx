import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Compress Image Online | Free Fast Image Compressor | SizeSnap',
  description:
    'Free online tool to compress image size in KB without losing quality. Easy fast and secure offline compressor for JPEG, PNG, WEBP.',
  alternates: {
    canonical: 'https://sizesnap.in/compress-image',
  },
};

export default function CompressImageHubPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Compress Image', url: '/compress-image' },
  ];

  return (
    <CategoryHubPage
      title="Compress Image"
      description="Select from our range of image compression tools. Choose exactly how small you want your image file to be."
      breadcrumbs={breadcrumbs}
      category="Compress"
    />
  );
}
