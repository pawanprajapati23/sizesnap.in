import { MetadataRoute } from 'next';
import { ALL_TOOLS } from '@/data/tools';
import { getPublishedArticles } from '@/lib/blog';
import { BLOG_CATEGORIES } from '@/data/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sizesnap.in';

  // Base routes
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
    '/convert-image',
    '/compress-pdf',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/blog',
  ];

  const sitemapData: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : (route === '/blog' ? 0.9 : (route.includes('-tools') ? 0.9 : 0.8)),
  }));

  // Tools routes
  ALL_TOOLS.forEach((tool) => {
    if (tool.status === 'production') {
      let priority = 0.6;
      if (tool.seoPriority === 'High') priority = 0.8;
      if (tool.seoPriority === 'Medium') priority = 0.6;
      if (tool.seoPriority === 'Low') priority = 0.4;

      sitemapData.push({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: priority,
      });
    }
  });

  // Blog Categories
  BLOG_CATEGORIES.forEach((category) => {
    sitemapData.push({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  try {
    // Blog Articles
    const articles = await getPublishedArticles();
    articles.forEach((article) => {
      if (!article.noIndex) {
        sitemapData.push({
          url: `${baseUrl}/blog/${article.slug}`,
          lastModified: article.updatedAt ? new Date(article.updatedAt) : (article.publishedAt ? new Date(article.publishedAt) : new Date()),
          changeFrequency: 'weekly', // Articles might be updated
          priority: 0.8,
        });
      }
    });
  } catch (error) {
    console.error("Error generating sitemap for blog articles:", error);
  }

  return sitemapData;
}
