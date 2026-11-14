export const revalidate = 3600;
import { MetadataRoute } from 'next';
import { ALL_TOOLS } from '@/data/tools';
import { TOOL_REDIRECT_MAP } from '@/data/tool-redirects';
import { SITE_URL } from '@/lib/site';
import { getPublishedArticles } from '@/lib/blog';
import { EXAM_PRESETS } from '@/data/exam-presets';
import { GUIDES_LIST } from '@/data/guides';

const STATIC_LASTMOD = new Date('2026-05-01T00:00:00Z');

// Static tool slugs that are 301/308 redirect sources in next.config.ts
const REDIRECTED_TOOL_SLUGS = new Set<string>([
  '11kb-photo-size',
  '12kb-photo-size',
  '13kb-photo-size',
  '150kb-photo-size',
  '15kb-photo-size',
  '28kb-photo-size',
  '5kb-photo-size',
  'compress-image-10kb-to-20kb',
  'compress-jpeg-between-20kb-to-50kb',
  'jpeg-to-pdf-under-100kb',
  'jpeg-to-pdf-under-150kb',
  'jpeg-to-pdf-under-200kb',
  'jpeg-to-pdf-under-500kb',
  'name-and-date-on-photo',
  'passport-size-photo-3.5x4.5cm',
  'reduce-image-size-kb',
  'resize-image-to-3-5cmx4-5cm',
  'ssc-photo-and-signature-resizer',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const seenUrls = new Set<string>();
  const sitemapData: MetadataRoute.Sitemap = [];

  const pushEntry = (
    url: string,
    priority: number,
    lastModified: Date = STATIC_LASTMOD,
    changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ) => {
    if (seenUrls.has(url)) return;
    seenUrls.add(url);
    sitemapData.push({ url, lastModified, changeFrequency, priority });
  };

  // Base routes & Hubs
  const routes = [
    '',
    '/tools',
    '/image-tools',
    '/pdf-tools',
    '/text-tools',
    '/writing-tools',
    '/developer-tools',
    '/calculator-tools',
    '/seo-tools',
    '/student-tools',
    '/exam-tools',
    '/social-media-tools',
    '/ecommerce-tools',
    '/compress-image',
    '/resize-image',
    '/student-calculators',
    '/percentage-calculator',
    '/cgpa-calculator',
    '/cgpa-to-percentage',
    '/sgpa-to-percentage',
    '/attendance-calculator',
    '/study-hours-calculator',
    '/age-calculator',
    '/exam-percentage-calculator',
    '/marks-percentage-calculator',
    '/required-marks-calculator',
    '/exams',
    '/exams/exam-application-kit',
    '/guides',
    '/guides/how-to-compress-image',
    '/about',
    '/privacy-policy',
    '/terms',
    '/contact',
    '/blog',
  ];

  routes.forEach((route) => {
    const priority =
      route === ''
        ? 1.0
        : route === '/blog' || route === '/exams' || route === '/guides' || route.includes('-tools') || route.includes('-calculator')
        ? 0.9
        : 0.8;
    pushEntry(`${baseUrl}${route}`, priority, STATIC_LASTMOD, route === '' || route === '/blog' ? 'daily' : 'weekly');
  });

  // Tools routes (dynamic & static tools) - ONLY canonical 200 OK tools, NO redirects
  ALL_TOOLS.forEach((tool) => {
    if (tool.status !== 'production') return;
    if (TOOL_REDIRECT_MAP[tool.slug] || REDIRECTED_TOOL_SLUGS.has(tool.slug)) return;

    const path = tool.route || `/tools/${tool.slug}`;
    let priority = 0.6;
    if (tool.seoPriority === 'High') priority = 0.85;
    else if (tool.seoPriority === 'Medium') priority = 0.65;
    else if (tool.seoPriority === 'Low') priority = 0.45;

    pushEntry(`${baseUrl}${path}`, priority, STATIC_LASTMOD, 'weekly');
  });

  // Exam Preset routes (High intent queries: SSC, UPSC, Police, Bank, BPSC, GDS, PAN)
  EXAM_PRESETS.forEach((exam) => {
    pushEntry(`${baseUrl}/exams/${exam.slug}`, 0.9, STATIC_LASTMOD, 'weekly');
  });

  // Bilingual Guides Hub routes
  GUIDES_LIST.forEach((guide) => {
    pushEntry(`${baseUrl}/guides/${guide.slug}`, 0.85, STATIC_LASTMOD, 'weekly');
  });

  try {
    // Blog Articles and Active Categories
    const articles = await getPublishedArticles();
    const activeCategories = new Set<string>();

    articles.forEach((article) => {
      if (article.category) {
        activeCategories.add(article.category);
      }
      if (!article.noIndex) {
        const modDate = article.updatedAt
          ? new Date(article.updatedAt)
          : article.publishedAt
          ? new Date(article.publishedAt)
          : STATIC_LASTMOD;
        pushEntry(`${baseUrl}/blog/${article.slug}`, 0.8, modDate, 'weekly');
      }
    });

    // Only add categories that have at least one published article
    activeCategories.forEach((categorySlug) => {
      pushEntry(`${baseUrl}/blog/category/${categorySlug}`, 0.7, STATIC_LASTMOD, 'weekly');
    });
  } catch (error) {
    console.error('Error generating sitemap for blog articles:', error);
  }

  return sitemapData;
}
