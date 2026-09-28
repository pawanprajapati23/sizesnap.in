import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age Calculator – Exact Age in Years, Months, Days | SizeSnap',
  description: 'Calculate your exact age for exam forms and applications. Find your age in years, months, and days as of any specific date.',
  alternates: {
    canonical: 'https://sizesnap.in/age-calculator',
  },
  openGraph: {
    title: 'Age Calculator – Exact Age in Years, Months, Days | SizeSnap',
    description: 'Calculate your exact age for exam forms and applications. Find your age in years, months, and days as of any specific date.',
    url: 'https://sizesnap.in/age-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator – Exact Age in Years, Months, Days | SizeSnap',
    description: 'Calculate your exact age for exam forms and applications. Find your age in years, months, and days as of any specific date.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Age Calculator', 'item': 'https://sizesnap.in/age-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Age Calculator',
      'url': 'https://sizesnap.in/age-calculator',
      'description': 'Calculate your exact age for exam forms and applications. Find your age in years, months, and days as of any specific date.',
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
