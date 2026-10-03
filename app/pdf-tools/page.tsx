import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Free PDF Tools | Compress, Merge & Convert PDF | SizeSnap',
  description:
    'Free online PDF tools to compress, merge, split, rotate, and manage PDF documents directly in your browser. 100% private and secure.',
  alternates: {
    canonical: 'https://sizesnap.in/pdf-tools',
  },
};

export default function PdfToolsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'PDF Tools', url: '/pdf-tools' },
  ];

  return (
    <CategoryHubPage
      title="PDF Tools"
      description="Easily compress, merge, split and modify PDF documents completely locally and privately."
      breadcrumbs={breadcrumbs}
      category="pdf"
      customSlugs={[
        'compress-pdf',
        'merge-pdf',
        'split-pdf',
        'rotate-pdf',
        'image-to-pdf',
        'pdf-to-images',
        'delete-pdf-pages',
        'extract-pdf-pages',
        'add-watermark-pdf',
        'add-page-numbers-pdf'
      ]}
    />
  );
}
