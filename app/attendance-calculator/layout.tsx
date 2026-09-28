import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Attendance Calculator – Track Classes & Shortage | SizeSnap',
  description: 'Calculate how many classes you need to attend or can safely miss to maintain your target attendance percentage (like 75%).',
  alternates: {
    canonical: 'https://sizesnap.in/attendance-calculator',
  },
  openGraph: {
    title: 'Attendance Calculator – Track Classes & Shortage | SizeSnap',
    description: 'Calculate how many classes you need to attend or can safely miss to maintain your target attendance percentage (like 75%).',
    url: 'https://sizesnap.in/attendance-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Attendance Calculator – Track Classes & Shortage | SizeSnap',
    description: 'Calculate how many classes you need to attend or can safely miss to maintain your target attendance percentage (like 75%).',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Attendance Calculator', 'item': 'https://sizesnap.in/attendance-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Attendance Calculator',
      'url': 'https://sizesnap.in/attendance-calculator',
      'description': 'Calculate how many classes you need to attend or can safely miss to maintain your target attendance percentage (like 75%).',
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
