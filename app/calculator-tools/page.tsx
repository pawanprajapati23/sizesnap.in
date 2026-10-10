import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Free Calculator Tools | CGPA, Percentage & Attendance | SizeSnap',
  description: 'Free online calculator tools for students. Calculate CGPA, percentages, and attendance directly in your browser.',
  alternates: { canonical: 'https://sizesnap.in/calculator-tools' },
};

export default function CalculatorToolsPage() {
  return (
    <CategoryHubPage
      title="Calculator Tools"
      description="Percentage, attendance, and general calculator tools for students and professionals."
      breadcrumbs={[ { name: 'Home', url: '/' }, { name: 'Tools', url: '/tools' }, { name: 'Calculator Tools', url: '/calculator-tools' } ]}
      category="calculator"
    />
  );
}
