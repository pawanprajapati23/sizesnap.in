import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SGPA to Percentage Calculator | University Grades | SizeSnap',
  description: 'Easily convert your semester SGPA to an overall percentage score. Supports custom university formulas and multipliers.',
  alternates: {
    canonical: 'https://sizesnap.in/sgpa-to-percentage',
  },
  openGraph: {
    title: 'SGPA to Percentage Calculator | University Grades | SizeSnap',
    description: 'Easily convert your semester SGPA to an overall percentage score. Supports custom university formulas and multipliers.',
    url: 'https://sizesnap.in/sgpa-to-percentage',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SGPA to Percentage Calculator | University Grades | SizeSnap',
    description: 'Easily convert your semester SGPA to an overall percentage score. Supports custom university formulas and multipliers.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'SGPA to Percentage Calculator', 'item': 'https://sizesnap.in/sgpa-to-percentage' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'SGPA to Percentage Calculator',
      'url': 'https://sizesnap.in/sgpa-to-percentage',
      'description': 'Easily convert your semester SGPA to an overall percentage score. Supports custom university formulas and multipliers.',
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
