import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CGPA to Percentage Calculator | Convert Grades | SizeSnap',
  description: 'Convert your CGPA to percentage using standard university multipliers (like 9.5). Fast and accurate CGPA conversion tool.',
  alternates: {
    canonical: 'https://sizesnap.in/cgpa-to-percentage',
  },
  openGraph: {
    title: 'CGPA to Percentage Calculator | Convert Grades | SizeSnap',
    description: 'Convert your CGPA to percentage using standard university multipliers (like 9.5). Fast and accurate CGPA conversion tool.',
    url: 'https://sizesnap.in/cgpa-to-percentage',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CGPA to Percentage Calculator | Convert Grades | SizeSnap',
    description: 'Convert your CGPA to percentage using standard university multipliers (like 9.5). Fast and accurate CGPA conversion tool.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'CGPA to Percentage Calculator', 'item': 'https://sizesnap.in/cgpa-to-percentage' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'CGPA to Percentage Calculator',
      'url': 'https://sizesnap.in/cgpa-to-percentage',
      'description': 'Convert your CGPA to percentage using standard university multipliers (like 9.5). Fast and accurate CGPA conversion tool.',
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
