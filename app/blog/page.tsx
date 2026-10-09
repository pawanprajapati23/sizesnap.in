import React from 'react';
import Link from 'next/link';
import { getPublishedArticles, getFeaturedArticle, getArticlesByCategory } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/data/blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogSearch from '@/components/blog/BlogSearch';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SizeSnap Blog - Guides, Tips & Requirements for Exams',
  description: 'Practical guides, exam document requirements, student tools, image and PDF tips, and useful resources to help you get your documents ready.',
  alternates: {
    canonical: 'https://sizesnap.in/blog',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const featuredArticle = await getFeaturedArticle();
  const allArticles = await getPublishedArticles();

  // Filter out featured from the rest
  const remainingArticles = allArticles.filter(a => a.id !== featuredArticle?.id);

  // Popular could just be prioritized or latest
  const popularArticles = remainingArticles.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Blog Hero section */}
      <section className="bg-white border-b border-gray-200 pt-16 pb-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            SizeSnap Blog
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Practical guides, exam document requirements, student tools, image and PDF tips, and useful resources to help you get your documents ready.
          </p>
          <div className="max-w-xl mx-auto mb-10">
            <BlogSearch />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {BLOG_CATEGORIES.map(category => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#414FA8] rounded-full inline-block"></span>
              Featured
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <Link href={`/blog/${featuredArticle.slug}`} className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredArticle.coverImage || 'https://picsum.photos/800/400'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#414FA8]">
                    {BLOG_CATEGORIES.find(c => c.slug === featuredArticle.category)?.title || featuredArticle.category}
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    {featuredArticle.publishedAt && (
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    )}
                    <span>•</span>
                    <span>{featuredArticle.readingTime || 5} min read</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#414FA8] transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {featuredArticle.author.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featuredArticle.author.profileImage} alt={featuredArticle.author.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#414FA8] text-white font-bold text-xs">
                            {featuredArticle.author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{featuredArticle.author.name}</span>
                    </div>
                    <span className="text-[#414FA8] font-semibold text-sm group-hover:underline">Read Article →</span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Popular / Latest Guides */}
        {popularArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#414FA8] rounded-full inline-block"></span>
                Latest Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularArticles.map(article => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
