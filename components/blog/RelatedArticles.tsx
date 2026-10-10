import React from 'react';
import { getArticles } from '@/lib/blog';
import BlogCard from './BlogCard';

export default async function RelatedArticles({ articleIds, currentArticleId }: { articleIds: string[], currentArticleId: string }) {
  const allArticles = await getArticles();

  const related = allArticles
    .filter(a => a.status === 'PUBLISHED' && a.id !== currentArticleId && articleIds.includes(a.id))
    .slice(0, 2);

  if (related.length === 0) {
    const fallback = allArticles
      .filter(a => a.status === 'PUBLISHED' && a.id !== currentArticleId)
      .slice(0, 2);

    if (fallback.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fallback.map(article => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {related.map(article => (
        <BlogCard key={article.id} article={article} />
      ))}
    </div>
  );
}
