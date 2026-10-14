import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Free Writing Tools | Generators & Converters | SizeSnap',
  description: 'Free online writing tools to prepare, structure, format, and check written content directly in your browser.',
  alternates: { canonical: 'https://www.sizesnap.in/writing-tools' },
};

export default function WritingToolsPage() {
  return (
    <CategoryHubPage
      title="Writing Tools"
      description="Tools to prepare, structure, format, and check written content quickly and securely."
      breadcrumbs={[ { name: 'Home', url: '/' }, { name: 'Tools', url: '/tools' }, { name: 'Writing Tools', url: '/writing-tools' } ]}
      category="writing"
    />
  );
}
