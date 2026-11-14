import { NextResponse } from 'next/server';
import { ALL_TOOLS } from '@/data/tools';
import { TOOL_REDIRECT_MAP } from '@/data/tool-redirects';

const IMPORTANT_ROUTES = [
  '/',
  '/tools',
  '/exams',
  '/guides',
  '/image-tools',
  '/pdf-tools',
  '/resize-image',
  '/compress-image',
  '/exam-tools',
  '/sitemap.xml',
  '/robots.txt',
];

const CANONICAL_TOOLS = ALL_TOOLS.filter(
  (t) => !TOOL_REDIRECT_MAP[t.slug] && t.status === 'production'
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  const results = [];

  const sampleTools = [...CANONICAL_TOOLS]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map((t) => t.route || `/tools/${t.slug}`);
  const routesToCheck = [...IMPORTANT_ROUTES, ...sampleTools];

  for (const route of routesToCheck) {
    try {
      const start = Date.now();
      const res = await fetch(`${baseUrl}${route}`, {
        method: 'HEAD',
        cache: 'no-store',
      });
      const ms = Date.now() - start;

      results.push({
        route,
        status: res.status,
        healthy: res.status === 200,
        ms,
      });
    } catch (error) {
      results.push({
        route,
        status: 500,
        healthy: false,
        ms: 0,
        error: error instanceof Error ? error.message : 'Unknown',
      });
    }
  }

  return NextResponse.json({
    timestamp: Date.now(),
    results,
  });
}
