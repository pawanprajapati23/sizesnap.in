import React from 'react';
import Link from 'next/link';
import { getArticlesByCategory } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/data/blog';
import BlogCard from '@/components/blog/BlogCard';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = BLOG_CATEGORIES.find(c => c.slug === resolvedParams.slug);

  if (!category) return {};

  return {
    title: `${category.title} - SizeSnap Blog`,
    description: category.description,
    alternates: {
      canonical: `https://sizesnap.in/blog/category/${resolvedParams.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const category = BLOG_CATEGORIES.find(c => c.slug === resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <section className="bg-white border-b border-gray-200 pt-12 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#414FA8]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#414FA8]">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{category.title}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {category.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {category.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">We&apos;re still working on guides for this category. Check back soon!</p>
            <Link href="/blog" className="inline-block mt-6 px-6 py-2 bg-[#414FA8] text-white rounded-lg font-medium hover:bg-[#344082] transition-colors">
              Back to Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
