export const revalidate = 3600;
import { MetadataRoute } from 'next';
import { ALL_TOOLS } from '@/data/tools';
import { TOOL_REDIRECT_MAP } from '@/data/tool-redirects';
import { SITE_URL } from '@/lib/site';
import { getPublishedArticles } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/data/blog';
import { EXAM_PRESETS } from '@/data/exam-presets';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

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

  const sitemapData: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : (route === '/blog' || route === '/exams' ? 0.9 : (route.includes('-tools') || route.includes('-calculator') ? 0.9 : 0.8)),
  }));

  // Tools routes (dynamic & static tools) - ONLY direct 200 OK canonical tools, NO redirects!
  ALL_TOOLS.forEach((tool) => {
    if (tool.status === 'production' && !TOOL_REDIRECT_MAP[tool.slug]) {
      let priority = 0.6;
      if (tool.seoPriority === 'High') priority = 0.8;
      if (tool.seoPriority === 'Medium') priority = 0.6;
      if (tool.seoPriority === 'Low') priority = 0.4;

      sitemapData.push({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: priority,
      });
    }
  });

  // Exam Preset routes (High intent queries: SSC, UPSC, Police, Bank)
  EXAM_PRESETS.forEach((exam) => {
    sitemapData.push({
      url: `${baseUrl}/exams/${exam.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
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
        sitemapData.push({
          url: `${baseUrl}/blog/${article.slug}`,
          lastModified: article.updatedAt ? new Date(article.updatedAt) : (article.publishedAt ? new Date(article.publishedAt) : new Date()),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    });

    // Only add categories that have at least one published article (prevents Google thin-content / soft-404)
    activeCategories.forEach((categorySlug) => {
      sitemapData.push({
        url: `${baseUrl}/blog/category/${categorySlug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error generating sitemap for blog articles:', error);
  }

  return sitemapData;
}
