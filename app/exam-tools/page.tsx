import React from 'react';
import type { Metadata } from 'next';
import { CategoryHubPage } from '@/components/templates/CategoryHubPage';

export const metadata: Metadata = {
  title: 'Exam Photo & Signature Tools | Online Resizer | SizeSnap',
  description:
    'Free online tools to resize passport photos and signatures to exact dimensions and KB sizes required by Indian Government exams (SSC, UPSC, State PSCs).',
  alternates: {
    canonical: 'https://sizesnap.in/exam-tools',
  },
};

export default function ExamToolsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Exam Tools', url: '/exam-tools' },
  ];

  return (
    <CategoryHubPage
      title="Exam Photo & Signature Tools"
      description="Strict requirements for SSC, UPSC, and State PSC forms? Use these secure offline tools to resize and compress your passport photos and signatures exactly to spec."
      breadcrumbs={breadcrumbs}
      category="Exam"
      customSlugs={[
        'passport-photo-maker',
        'generate-signature',
        'resize-image-pixel',
        'compress-image-to-10kb',
        'compress-image-to-20kb',
        'compress-image-to-30kb',
        'compress-image-to-40kb',
        'compress-image-to-50kb',
      ]}
    />
  );
}
