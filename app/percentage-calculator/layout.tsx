import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Calculator – Find Marks Percentage | SizeSnap',
  description: 'Calculate your exact percentage from obtained and total marks. Free online percentage calculator for students, exams, and assignments.',
  alternates: {
    canonical: 'https://sizesnap.in/percentage-calculator',
  },
  openGraph: {
    title: 'Percentage Calculator – Find Marks Percentage | SizeSnap',
    description: 'Calculate your exact percentage from obtained and total marks. Free online percentage calculator for students, exams, and assignments.',
    url: 'https://sizesnap.in/percentage-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentage Calculator – Find Marks Percentage | SizeSnap',
    description: 'Calculate your exact percentage from obtained and total marks. Free online percentage calculator for students, exams, and assignments.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Percentage Calculator', 'item': 'https://sizesnap.in/percentage-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Percentage Calculator',
      'url': 'https://sizesnap.in/percentage-calculator',
      'description': 'Calculate your exact percentage from obtained and total marks. Free online percentage calculator for students, exams, and assignments.',
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
