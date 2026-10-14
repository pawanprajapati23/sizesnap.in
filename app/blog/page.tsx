import React from 'react';
import Link from 'next/link';
import AdsterraAd from '@/components/AdsterraAd';
import { getPublishedArticles, getFeaturedArticle, getArticlesByCategory } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/data/blog';
import BlogCard from '@/components/blog/BlogCard';
import BlogSearch from '@/components/blog/BlogSearch';
import NewsletterForm from '@/components/blog/NewsletterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SizeSnap Blog - Guides, Tips & Requirements for Exams',
  description: 'Practical guides, exam document requirements, student tools, image and PDF tips, and useful resources to help you get your documents ready.',
  alternates: {
    canonical: 'https://www.sizesnap.in/blog',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const featuredArticle = await getFeaturedArticle();
  const allArticles = await getPublishedArticles();

  // Filter out featured from the rest
  const remainingArticles = allArticles.filter(a => a.id !== featuredArticle?.id);

  // Display all published articles in the feed
  const popularArticles = remainingArticles;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Blog Hero section with Theme Gradient */}
      <section className="relative overflow-hidden bg-white border-b border-gray-200">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#414FA8]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#414FA8]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 pt-20 pb-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-[#414FA8]/10 text-[#414FA8] text-sm font-semibold mb-4 border border-[#414FA8]/20">
              Welcome to the Knowledge Base
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              SizeSnap <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#414FA8] to-[#6b79d6]">Blog</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Practical guides, exam document requirements, student tools, image tips, and useful resources to help you get your documents ready flawlessly.
            </p>
            <div className="max-w-2xl mx-auto mb-10 shadow-xl shadow-[#414FA8]/5 rounded-full">
              <BlogSearch />
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto mt-8">
              {BLOG_CATEGORIES.filter(c => allArticles.some(a => a.category === c.slug)).map(category => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 hover:border-[#414FA8]/30 hover:bg-[#414FA8]/5 text-gray-700 hover:text-[#414FA8] text-sm font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2.5 h-8 bg-gradient-to-b from-[#414FA8] to-[#7181ea] rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Featured Story
              </h2>
            </div>
            
            <div className="bg-white rounded-3xl shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <Link href={`/blog/${featuredArticle.slug}`} className="flex flex-col md:flex-row">
                <div className="md:w-[55%] relative h-72 md:h-auto bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredArticle.coverImage || 'https://picsum.photos/800/400'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent md:hidden"></div>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-wide text-[#414FA8] shadow-sm">
                    {BLOG_CATEGORIES.find(c => c.slug === featuredArticle.category)?.title || featuredArticle.category}
                  </div>
                </div>
                <div className="md:w-[45%] p-8 md:p-12 flex flex-col justify-center bg-white relative">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-5 font-medium">
                    {featuredArticle.publishedAt && (
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {featuredArticle.readingTime || 5} min read
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-5 group-hover:text-[#414FA8] transition-colors leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                        {featuredArticle.author.profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={featuredArticle.author.profileImage} alt={featuredArticle.author.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#414FA8] text-white font-bold text-sm">
                            {featuredArticle.author.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{featuredArticle.author.name}</span>
                    </div>
                    <span className="bg-[#414FA8]/10 text-[#414FA8] px-4 py-2 rounded-lg font-semibold text-sm group-hover:bg-[#414FA8] group-hover:text-white transition-colors">
                      Read Story
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        <div className="mb-20 flex justify-center">
          <AdsterraAd dataKey="3bd154ece61c60859c2b8242ae85b927" width={728} height={90} className="w-full hidden md:flex" />
          <AdsterraAd dataKey="f509bd7d24a58ce7a176067713ca61df" width={320} height={50} className="w-full md:hidden flex" />
        </div>

        {/* Popular / Latest Guides */}
        {popularArticles.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2.5 h-8 bg-gradient-to-b from-[#414FA8] to-[#7181ea] rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Latest Guides & Tips
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularArticles.map(article => (
                <BlogCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="mt-12 bg-gradient-to-br from-[#414FA8] to-[#2B3575] rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-[#414FA8]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay updated with SizeSnap</h2>
            <p className="text-[#EEF1FB] mb-8 text-lg opacity-90">
              Get the latest exam updates, document requirements, and tech tips delivered directly to your inbox. No spam, ever.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </div>
    </div>
  );
}
