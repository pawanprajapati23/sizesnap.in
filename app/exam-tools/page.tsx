import { CategoryHubPage } from '@/components/templates/CategoryHubPage';
import { ALL_TOOLS } from '@/data/tools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Exam Tools & Timers | SizeSnap',
  description: 'Free online exam tools, including exam countdown timers, target grade calculators, and PDF utilities.',
  alternates: {
    canonical: 'https://sizesnap.in/exam-tools',
  },
};

export default function ExamToolsPage() {
  const tools = ALL_TOOLS.filter((t) => t.category === 'exam-tools');

  return (
    <CategoryHubPage
      title="Exam Tools"
      description="Prepare for your exams effectively with our collection of online tools designed to track deadlines, calculate targets, and review study materials."
      tools={tools}
    />
  );
}
