import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Free Text Tools | Formatting, Counting & Analyzers | SizeSnap',
  description: 'Free online text tools for formatting, counting, and string manipulation directly in your browser. 100% secure.',
  alternates: { canonical: 'https://www.sizesnap.in/text-tools' },
};

export default function TextToolsPage() {
  return (
    <CategoryHubPage
      title="Text Tools"
      description="Fast, privacy-friendly text utilities. Format, count, and manipulate text strings locally in your browser."
      breadcrumbs={[ { name: 'Home', url: '/' }, { name: 'Tools', url: '/tools' }, { name: 'Text Tools', url: '/text-tools' } ]}
      category="text"
    />
  );
}
