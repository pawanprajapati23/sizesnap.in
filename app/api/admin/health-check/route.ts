import { NextResponse } from 'next/server';
import { ALL_TOOLS } from '@/data/tools';

const IMPORTANT_ROUTES = [
  '/',
  '/tools',
  '/image-tools',
  '/pdf-tools',
  '/resize-image',
  '/compress-image',
  '/social-media-tools',
  '/exam-tools',
  '/sitemap.xml',
  '/robots.txt'
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  // We use the origin of the request to determine the base URL to check
  const baseUrl = url.origin;

  const results = [];

  // Pick a random sample of 5 tools to check to keep the endpoint fast
  const sampleTools = [...ALL_TOOLS].sort(() => 0.5 - Math.random()).slice(0, 5).map(t => `/tools/${t.slug}`);
  const routesToCheck = [...IMPORTANT_ROUTES, ...sampleTools];

  for (const route of routesToCheck) {
    try {
      const start = Date.now();
      const res = await fetch(`${baseUrl}${route}`, {
        method: 'HEAD',
        cache: 'no-store'
      });
      const ms = Date.now() - start;

      results.push({
        route,
        status: res.status,
        healthy: res.status === 200,
        ms
      });
    } catch (error) {
      results.push({
        route,
        status: 500,
        healthy: false,
        ms: 0,
        error: error instanceof Error ? error.message : 'Unknown'
      });
    }
  }

  return NextResponse.json({
    timestamp: Date.now(),
    results
  });
}
