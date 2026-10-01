import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Resize Image Online | Free Image Resizer | SizeSnap',
  description:
    'Free online tool to resize images in pixels, cm, mm, and inches. Easily resize photos for exams, social media and web without losing quality.',
  alternates: {
    canonical: 'https://sizesnap.in/resize-image',
  },
};

export default function ResizeImageHubPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Resize Image', url: '/resize-image' },
  ];

  return (
    <CategoryHubPage
      title="Resize Image"
      description="Resize images by dimensions (pixels, cm, mm, inches) or to specific standard preset sizes."
      breadcrumbs={breadcrumbs}
      category="Resize"
    />
  );
}
