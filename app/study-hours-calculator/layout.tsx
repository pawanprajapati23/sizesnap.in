import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Hours Calculator – Plan Exam Schedule | SizeSnap',
  description: 'Plan your study schedule and find out how many hours you need to study each day to finish your syllabus before the exam.',
  alternates: {
    canonical: 'https://sizesnap.in/study-hours-calculator',
  },
  openGraph: {
    title: 'Study Hours Calculator – Plan Exam Schedule | SizeSnap',
    description: 'Plan your study schedule and find out how many hours you need to study each day to finish your syllabus before the exam.',
    url: 'https://sizesnap.in/study-hours-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Hours Calculator – Plan Exam Schedule | SizeSnap',
    description: 'Plan your study schedule and find out how many hours you need to study each day to finish your syllabus before the exam.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://sizesnap.in/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Student Calculators', 'item': 'https://sizesnap.in/student-calculators' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Study Hours Calculator', 'item': 'https://sizesnap.in/study-hours-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Study Hours Calculator',
      'url': 'https://sizesnap.in/study-hours-calculator',
      'description': 'Plan your study schedule and find out how many hours you need to study each day to finish your syllabus before the exam.',
      'applicationCategory': 'EducationalApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
