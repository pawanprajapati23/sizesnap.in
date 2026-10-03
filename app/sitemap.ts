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
    {
      url: `${BASE_URL}/image-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pdf-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compress-image`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/resize-image`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/social-media-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/exam-tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];


  // Production tool routes
  const productionTools = ALL_TOOLS.filter(t => t.status === 'production');

  const toolRoutes: MetadataRoute.Sitemap = productionTools.map((tool) => {
    let priority = 0.8;
    if (tool.seoPriority === 'High') priority = 1.0;
    else if (tool.seoPriority === 'Medium') priority = 0.9;

    return {
      url: `${BASE_URL}/tools/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: priority >= 0.9 ? 'weekly' : 'monthly',
      priority,
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

  return [...staticRoutes, ...examRoutes, ...toolRoutes, ...studentCalculatorRoutes];
}
