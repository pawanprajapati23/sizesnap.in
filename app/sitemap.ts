import type { MetadataRoute } from 'next'
import { getAllPaths, tools } from '@/lib/toolConfigs'
import { blogs } from '@/lib/blogConfigs'

const BASE_URL = 'https://sizesnap.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const variantPages = getAllPaths().map(({ tool, variant }) => ({
    url: `${BASE_URL}/${tool}/${variant}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const toolHubPages = tools.map(tool => ({
    url: `${BASE_URL}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const blogPages = blogs.map(blog => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const staticPages = [
    { url: `${BASE_URL}/about-us`, priority: 0.5 },
    { url: `${BASE_URL}/contact`, priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.5 },
    { url: `${BASE_URL}/terms-of-service`, priority: 0.5 },
    { url: `${BASE_URL}/blog`, priority: 0.8 },
  ].map(page => ({
    ...page,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    ...staticPages,
    ...blogPages,
    ...toolHubPages,
    ...variantPages,
  ]
}
