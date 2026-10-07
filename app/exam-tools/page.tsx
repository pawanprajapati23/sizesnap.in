import { CategoryHubPage } from '@/components/templates/CategoryHubPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Exam Tools & Timers | SizeSnap',
  description: 'Free online exam tools, including exam countdown timers, target grade calculators, and PDF utilities.',
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
      title="Exam Tools"
      description="Prepare for your exams effectively with our collection of online tools designed to track deadlines, calculate targets, and review study materials."
      breadcrumbs={breadcrumbs}
      category="exam-tools"
    />
  );
}
