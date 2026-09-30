import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight } from 'lucide-react';

interface CategoryHubPageProps {
  title: string;
  description: string;
  breadcrumbs: { name: string; url: string }[];
  category: string; // E.g., 'Image', 'PDF', 'Compress', 'Resize', 'Social', 'Exam'
  customSlugs?: string[];
}

export function CategoryHubPage({
  title,
  description,
  breadcrumbs,
  category,
  customSlugs
}: CategoryHubPageProps) {

  let tools = ALL_TOOLS;

  if (customSlugs && customSlugs.length > 0) {
    tools = ALL_TOOLS.filter(t => customSlugs.includes(t.slug));
  } else if (category === 'Image') {
    tools = ALL_TOOLS.filter(t => t.categoryTitle.includes('Image') || (t.categoryId === 'F' || t.categoryId === 'G'));
  } else if (category === 'PDF') {
    tools = ALL_TOOLS.filter(t => t.categoryId === 'D');
  } else if (category === 'Compress') {
    tools = ALL_TOOLS.filter(t => t.slug.includes('compress') || t.slug.includes('reduce'));
  } else if (category === 'Resize') {
    tools = ALL_TOOLS.filter(t => t.slug.includes('resize') || t.slug.includes('crop'));
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
                {idx < breadcrumbs.length - 1 ? (
                  <Link href={crumb.url} className="hover:text-[#414FA8] font-medium transition-colors">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-gray-800 font-semibold">{crumb.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  {description}
                </p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {tools.map((tool) => (
                    <ToolButton key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full lg:col-span-4 xl:col-span-3">
              <Sidebar />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
