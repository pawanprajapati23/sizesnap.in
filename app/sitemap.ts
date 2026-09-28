import type { MetadataRoute } from 'next';
import { ALL_TOOLS } from '@/data/tools';
import { EXAM_PRESETS } from '@/data/exam-presets';

const BASE_URL = 'https://sizesnap.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/exams`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/exams/exam-application-kit`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.98,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // High‑traffic tool routes – boosted priority
  const highPriorityTools: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/tools/compress-image`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools/compress-pdf`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools/resize-image-pixel`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ];

  // Unique tool routes (excluding the high‑priority ones)
  const uniqueSlugs = Array.from(new Set(ALL_TOOLS.map((t) => t.slug)));
  const filteredSlugs = uniqueSlugs.filter((slug) => !
    ['compress-image', 'compress-pdf', 'resize-image-pixel'].includes(slug)
  );
  const toolRoutes: MetadataRoute.Sitemap = filteredSlugs.map((slug) => {
    const tool = ALL_TOOLS.find((t) => t.slug === slug);
    const isPopular = tool?.popular;
    return {
      url: `${BASE_URL}/tools/${slug}`,
      lastModified: currentDate,
      changeFrequency: isPopular ? 'weekly' : 'monthly',
      priority: isPopular ? 0.9 : 0.8,
    };
  });

  // Dedicated Government Exam routes
  const examRoutes: MetadataRoute.Sitemap = EXAM_PRESETS.map((exam) => ({
    url: `${BASE_URL}/exams/${exam.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.95,
  }));

  // Student Calculators
  const studentCalculatorRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/student-calculators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/percentage-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/cgpa-to-percentage`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/sgpa-to-percentage`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/marks-percentage-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/attendance-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/age-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/cgpa-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/required-marks-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/exam-percentage-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/study-hours-calculator`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
  ];

  return [...staticRoutes, ...highPriorityTools, ...examRoutes, ...toolRoutes, ...studentCalculatorRoutes];
}
