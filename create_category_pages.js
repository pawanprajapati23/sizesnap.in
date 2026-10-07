const fs = require('fs');
const path = require('path');

// Student Tools
const studentPath = 'app/student-tools';
if (!fs.existsSync(studentPath)) fs.mkdirSync(studentPath, { recursive: true });

fs.writeFileSync(path.join(studentPath, 'page.tsx'), `import { CategoryHubPage } from '@/components/templates/CategoryHubPage';
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
`, 'utf8');

// Exam Tools
const examPath = 'app/exam-tools';
if (!fs.existsSync(examPath)) fs.mkdirSync(examPath, { recursive: true });

fs.writeFileSync(path.join(examPath, 'page.tsx'), `import { CategoryHubPage } from '@/components/templates/CategoryHubPage';
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
`, 'utf8');

console.log('Category pages created successfully.');
