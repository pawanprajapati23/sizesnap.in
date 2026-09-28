import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CGPA Calculator – Subject-Wise Credit Grades | SizeSnap',
  description: 'Calculate your overall Cumulative Grade Point Average (CGPA) from your semester grades, grade points, and credits.',
  alternates: {
    canonical: 'https://sizesnap.in/cgpa-calculator',
  },
  openGraph: {
    title: 'CGPA Calculator – Subject-Wise Credit Grades | SizeSnap',
    description: 'Calculate your overall Cumulative Grade Point Average (CGPA) from your semester grades, grade points, and credits.',
    url: 'https://sizesnap.in/cgpa-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CGPA Calculator – Subject-Wise Credit Grades | SizeSnap',
    description: 'Calculate your overall Cumulative Grade Point Average (CGPA) from your semester grades, grade points, and credits.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'CGPA Calculator', 'item': 'https://sizesnap.in/cgpa-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'CGPA Calculator',
      'url': 'https://sizesnap.in/cgpa-calculator',
      'description': 'Calculate your overall Cumulative Grade Point Average (CGPA) from your semester grades, grade points, and credits.',
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
