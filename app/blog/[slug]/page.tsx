import React from 'react';
import Link from 'next/link';
import { getPublishedArticleBySlug } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/data/blog';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import sanitizeHtml from 'sanitize-html';
import AuthorBox from '@/components/blog/AuthorBox';
import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import RelatedToolsCTA from '@/components/blog/RelatedToolsCTA';
import RelatedArticles from '@/components/blog/RelatedArticles';

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getPublishedArticleBySlug(resolvedParams.slug);

  if (!article) return {};

  return {
    title: article.seoTitle || `${article.title} - SizeSnap Blog`,
    description: article.seoDescription || article.excerpt,
    alternates: {
      canonical: article.canonicalUrl || `https://sizesnap.in/blog/${article.slug}`,
    },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
      authors: [article.author.name],
      images: article.ogImage || article.coverImage ? [article.ogImage || article.coverImage as string] : undefined,
    },
    robots: article.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const article = await getPublishedArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const category = BLOG_CATEGORIES.find(c => c.slug === article.category);

  const cleanContent = sanitizeHtml(article.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'iframe']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'style'],
      'img': ['src', 'alt', 'width', 'height'],
      'iframe': ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
      'a': ['href', 'name', 'target', 'rel']
    }
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage || article.ogImage || 'https://sizesnap.in/logo.png',
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : '',
    dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : '',
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.socialLinks?.website || `https://sizesnap.in/blog`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SizeSnap',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sizesnap.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sizesnap.in/blog/${article.slug}`,
    },
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#414FA8]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#414FA8]">Blog</Link>
            <span>/</span>
            {category && (
              <>
                <Link href={`/blog/category/${category.slug}`} className="hover:text-[#414FA8]">{category.title}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-none">{article.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {article.author.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.author.profileImage} alt={article.author.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#414FA8] text-white font-bold text-xs">
                    {article.author.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-medium text-gray-900">{article.author.name}</span>
            </div>

            <span>•</span>

            {article.publishedAt && (
              <time dateTime={new Date(article.publishedAt).toISOString()}>
                {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            )}

            <span>•</span>

            <span>{article.readingTime || 5} min read</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white aspect-video md:aspect-[21/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Warning/Update Box for Exam Articles */}
      {article.officialSources && article.officialSources.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-10">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 flex gap-4">
            <div className="text-amber-500 mt-1 flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Important Note</h4>
              <p className="text-amber-800 text-sm mb-3">
                Requirements can change. Always verify the latest instructions in the official notification.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {article.lastVerifiedAt && (
                  <div className="text-amber-700">
                    <span className="font-semibold">Last Verified:</span> {new Date(article.lastVerifiedAt).toLocaleDateString('en-US')}
                  </div>
                )}
                {article.examYear && (
                  <div className="text-amber-700">
                    <span className="font-semibold">Application Year:</span> {article.examYear}
                  </div>
                )}
                <div className="text-amber-700">
                  <span className="font-semibold">Source:</span>{' '}
                  {article.officialSources.map((s, i) => (
                    <React.Fragment key={i}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">{s.name}</a>
                      {i < article.officialSources!.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-12">

        {/* Left Sidebar (Desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ShareButtons url={`https://sizesnap.in/blog/${article.slug}`} title={article.title} />
            <TableOfContents htmlContent={cleanContent} />
          </div>
        </div>

        {/* Article Body */}
        <div className="flex-1 min-w-0">
          {/* Mobile TOC */}
          <div className="lg:hidden mb-8">
            <TableOfContents htmlContent={cleanContent} isMobile={true} />
          </div>

          <article
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#414FA8] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>

          {/* Mobile Share */}
          <div className="lg:hidden mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
            <ShareButtons url={`https://sizesnap.in/blog/${article.slug}`} title={article.title} horizontal={true} />
          </div>

          {/* Author Box */}
          <div className="mt-12">
            <AuthorBox author={article.author} />
          </div>
        </div>
      </div>

      {/* Related Content */}
      <div className="max-w-5xl mx-auto px-4 mt-16 pt-16 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-12">
        {article.relatedTools && article.relatedTools.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Tools for this Guide</h3>
            <RelatedToolsCTA toolSlugs={article.relatedTools} />
          </div>
        )}

        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <RelatedArticles articleIds={article.relatedArticles} currentArticleId={article.id} />
          </div>
        )}
      </div>
    </div>
  );
}
