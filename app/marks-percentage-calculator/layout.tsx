import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subject-Wise Marks Percentage Calculator | SizeSnap',
  description: 'Calculate total obtained marks, maximum marks, and overall aggregate percentage across multiple subjects instantly.',
  alternates: {
    canonical: 'https://sizesnap.in/marks-percentage-calculator',
  },
  openGraph: {
    title: 'Subject-Wise Marks Percentage Calculator | SizeSnap',
    description: 'Calculate total obtained marks, maximum marks, and overall aggregate percentage across multiple subjects instantly.',
    url: 'https://sizesnap.in/marks-percentage-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subject-Wise Marks Percentage Calculator | SizeSnap',
    description: 'Calculate total obtained marks, maximum marks, and overall aggregate percentage across multiple subjects instantly.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Subject-Wise Marks Percentage Calculator', 'item': 'https://sizesnap.in/marks-percentage-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Subject-Wise Marks Percentage Calculator',
      'url': 'https://sizesnap.in/marks-percentage-calculator',
      'description': 'Calculate total obtained marks, maximum marks, and overall aggregate percentage across multiple subjects instantly.',
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
