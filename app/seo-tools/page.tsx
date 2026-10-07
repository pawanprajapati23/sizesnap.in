import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Free SEO Tools | Meta Tags, Schemas & Analyzers | SizeSnap',
  description:
    'Free online SEO tools for website owners and developers. Generate meta tags, schemas, open graph cards, robots.txt, and analyze keyword density directly in your browser.',
  alternates: {
    canonical: 'https://sizesnap.in/seo-tools',
  },
};

export default function SeoToolsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'SEO Tools', url: '/seo-tools' },
  ];

  return (
    <CategoryHubPage
      title="SEO Tools"
      description="Fast, privacy-friendly, zero-upload SEO utilities. Generate meta tags, validate sitemaps, build schemas, and analyze keyword density locally in your browser."
      breadcrumbs={breadcrumbs}
      category="seo"
    />
  );
}
