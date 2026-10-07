import { CategoryHubPage } from '@/components/templates/CategoryHubPage';
import { ALL_TOOLS } from '@/data/tools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Student Tools & Calculators | SizeSnap',
  description: 'A suite of free online tools for students, including GPA calculators, attendance trackers, study timers, and grade calculators.',
  alternates: {
    canonical: 'https://sizesnap.in/student-tools',
  },
};

export default function StudentToolsPage() {
  const tools = ALL_TOOLS.filter((t) => t.category === 'student-tools');

  return (
    <CategoryHubPage
      title="Student Tools"
      description="Manage your academics with our free collection of online tools designed for students. Calculate GPA, track attendance, and optimize your study sessions."
      tools={tools}
    />
  );
}
