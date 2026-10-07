import { MetadataRoute } from 'next';
import { ALL_TOOLS } from '@/data/tools';

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];

  const sitemapData: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : (route.includes('-tools') ? 0.9 : 0.8),
  }));

  // Tools routes
  ALL_TOOLS.forEach((tool) => {
    if (tool.status === 'production') {
      let priority = 0.6;
      if (tool.seoPriority === 'High') priority = 0.8;
      if (tool.seoPriority === 'Medium') priority = 0.6;
      if (tool.seoPriority === 'Low') priority = 0.4;

      // Make absolutely sure we pull from slug dynamically and avoid tool.route type issues that code review warned about
      sitemapData.push({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: priority,
      });
    }
  });

  return sitemapData;
}
