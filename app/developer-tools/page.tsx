import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Free Developer Tools | Format, Validate & Hash | SizeSnap',
  description:
    'Free online developer tools to format JSON, test Regex, decode JWTs, convert Unix timestamps, and generate hashes securely in your browser.',
  alternates: {
    canonical: 'https://sizesnap.in/developer-tools',
  },
};

export default function DeveloperToolsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Developer Tools', url: '/developer-tools' },
  ];

  return (
    <CategoryHubPage
      title="Developer Tools"
      description="Fast, privacy-friendly, zero-upload utilities for developers. Format JSON, test regex, encode URLs, decode JWTs, and generate secure hashes directly in your browser."
      breadcrumbs={breadcrumbs}
      category="developer"
    />
  );
}
