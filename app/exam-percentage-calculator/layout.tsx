import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exam Percentage Calculator – Multi-Subject Result | SizeSnap',
  description: 'Calculate your final exam percentage across multiple subjects. Easily track total marks obtained and maximum marks.',
  alternates: {
    canonical: 'https://sizesnap.in/exam-percentage-calculator',
  },
  openGraph: {
    title: 'Exam Percentage Calculator – Multi-Subject Result | SizeSnap',
    description: 'Calculate your final exam percentage across multiple subjects. Easily track total marks obtained and maximum marks.',
    url: 'https://sizesnap.in/exam-percentage-calculator',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exam Percentage Calculator – Multi-Subject Result | SizeSnap',
    description: 'Calculate your final exam percentage across multiple subjects. Easily track total marks obtained and maximum marks.',
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
        { '@type': 'ListItem', 'position': 3, 'name': 'Exam Percentage Calculator', 'item': 'https://sizesnap.in/exam-percentage-calculator' }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Exam Percentage Calculator',
      'url': 'https://sizesnap.in/exam-percentage-calculator',
      'description': 'Calculate your final exam percentage across multiple subjects. Easily track total marks obtained and maximum marks.',
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
