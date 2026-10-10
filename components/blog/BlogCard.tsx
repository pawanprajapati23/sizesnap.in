import React from 'react';
import Link from 'next/link';
import { Article, BLOG_CATEGORIES } from '@/data/blog';

export default function BlogCard({ article }: { article: Article }) {
  const category = BLOG_CATEGORIES.find(c => c.slug === article.category);

  return (
    <Link href={`/blog/${article.slug}`} className="group h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverImage || 'https://picsum.photos/400/225'}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#414FA8]">
            {category.title}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          {article.publishedAt && (
            <time dateTime={new Date(article.publishedAt).toISOString()}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          )}
          <span>•</span>
          <span>{article.readingTime || 5} min read</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#414FA8] transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#414FA8] text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
              {article.author.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.author.profileImage} alt={article.author.name} className="w-full h-full object-cover" />
              ) : (
                article.author.name.charAt(0)
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">{article.author.name}</span>
          </div>
          <span className="text-[#414FA8] font-semibold text-xs group-hover:underline">Read →</span>
        </div>
      </div>
    </Link>
  );
}
