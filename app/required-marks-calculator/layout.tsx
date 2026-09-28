import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Required Marks Calculator – Target Exam Score | SizeSnap',
  description: 'Find out exactly how many marks you need in your remaining exams to achieve your target overall percentage.',
  alternates: {
    canonical: 'https://sizesnap.in/required-marks-calculator',
  },
  openGraph: {
    title: 'Required Marks Calculator – Target Exam Score | SizeSnap',
    description: 'Find out exactly how many marks you need in your remaining exams to achieve your target overall percentage.',
    url: 'https://sizesnap.in/required-marks-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Required Marks Calculator – Target Exam Score | SizeSnap',
    description: 'Find out exactly how many marks you need in your remaining exams to achieve your target overall percentage.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Required Marks Calculator', 'item': 'https://sizesnap.in/required-marks-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Required Marks Calculator',
      'url': 'https://sizesnap.in/required-marks-calculator',
      'description': 'Find out exactly how many marks you need in your remaining exams to achieve your target overall percentage.',
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
