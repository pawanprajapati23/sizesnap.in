/**
 * SizeSnap.in SEO Migration & 301 Permanent Redirect Mapping
 * Ensures 100% preservation of historical Google search traffic, backlinks, and indexed URLs.
 */
import { ALL_TOOLS } from '@/data/tools';

const TOOL_SLUG_SET = new Set(ALL_TOOLS.map((t) => t.slug));

// Reserved system routes that should never be treated as tool redirects
export const SYSTEM_ROUTES = new Set([
  'about',
  'contact',
  'privacy-policy',
  'terms',
  'tools',
  'exams',
  'api',
  '_next',
  'favicon.ico',
  'favicon.svg',
  'logo.svg',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
]);

/**
 * Intelligent URL Resolver for all historical SizeSnap URLs (from Google Search Console)
 */
export function getSeoRedirect(pathname: string): string | null {
  // Normalize pathname: remove trailing slash and whitespace
  let cleanPath = pathname.trim().toLowerCase();
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Skip system routes
  const firstSegment = cleanPath.split('/')[1];
  if (SYSTEM_ROUTES.has(firstSegment)) {
    return null;
  }

  // Handle /hi/ localized URLs
  if (cleanPath.startsWith('/hi/')) {
    cleanPath = cleanPath.replace('/hi', '');
  } else if (cleanPath === '/hi') {
    return '/';
  }

  // 1. Dedicated Government Exam Presets (High search volume)
  if (
    cleanPath.includes('ssc-photo') ||
    cleanPath.includes('ssc-signature') ||
    cleanPath.includes('ssc-photo-rejection') ||
    cleanPath.includes('name-and-date-on-photo-for-ssc')
  ) {
    return '/exams/ssc-photo-signature-resizer';
  }

  if (
    cleanPath.includes('upsc-photo') ||
    cleanPath.includes('upsc-signature') ||
    cleanPath.includes('upsc-otr') ||
    cleanPath.includes('name-and-date-on-photo') ||
    cleanPath.includes('dop-photo-maker')
  ) {
    return '/exams/upsc-photo-signature-resizer';
  }

  if (
    cleanPath.includes('delhi-police') ||
    cleanPath.includes('photo-size-for-delhi-police')
  ) {
    return '/exams/delhi-police-photo-resizer';
  }

  if (cleanPath.includes('up-police')) {
    return '/exams/up-police-photo-resizer';
  }

  if (
    cleanPath.includes('ibps') ||
    cleanPath.includes('bank-exam-photo') ||
    cleanPath.includes('sbi-photo')
  ) {
    return '/exams/ibps-bank-photo-signature-resizer';
  }

  // 2. Document scanner & shadow removal (High traffic from GSC!)
  if (
    cleanPath.includes('document-scanner') ||
    cleanPath.includes('remove-shadow') ||
    cleanPath.includes('online-document-shadow-removal') ||
    cleanPath.includes('shadow-removal')
  ) {
    return '/tools/black-and-white';
  }

  // 3. WhatsApp DP & social crops
  if (cleanPath.includes('whatsapp-dp') || cleanPath.includes('whatsapp-crop')) {
    return '/tools/square-crop';
  }

  // 4. Background change / remove
  if (
    cleanPath.includes('change-photo-background-to-white') ||
    cleanPath.includes('change-background') ||
    cleanPath.includes('remove-background')
  ) {
    return '/tools/remove-background';
  }

  // 5. Passport photo maker variants
  if (
    cleanPath.includes('passport-photo') ||
    cleanPath.includes('passport-size-photo') ||
    cleanPath.includes('us-visa') ||
    cleanPath === '/passport-size-photo-maker'
  ) {
    return '/tools/passport-photo-maker';
  }

  // 5. Signature resizing variants
  if (cleanPath.startsWith('/signature-resize')) {
    const kbMatch = cleanPath.match(/(\d+)kb/);
    if (kbMatch) {
      return `/tools/reduce-image-size-in-kb?target=${kbMatch[1]}`;
    }
    return '/tools/resize-signature';
  }

  // 6. PDF Compression with exact KB/MB (Top ranking on GSC: to-12kb, to-10kb, to-140kb, etc.)
  const pdfKbMatch = cleanPath.match(/compress-pdf.*?(?:to-)?(\d+)(?:-)?kb/);
  if (pdfKbMatch) {
    return `/tools/compress-pdf?target=${pdfKbMatch[1]}`;
  }

  const pdfMbMatch = cleanPath.match(/compress-pdf.*?(?:to-)?(\d+)(?:-)?mb/);
  if (pdfMbMatch) {
    const kbVal = parseInt(pdfMbMatch[1], 10) * 1000;
    return `/tools/compress-pdf?target=${kbVal}`;
  }

  if (cleanPath === '/compress-pdf' || cleanPath.startsWith('/compress-pdf/')) {
    return '/tools/compress-pdf';
  }

  if (cleanPath.includes('pdf-under-500kb') || cleanPath.includes('pdf-under-')) {
    const underMatch = cleanPath.match(/pdf-under-(\d+)kb/);
    return underMatch
      ? `/tools/compress-pdf?target=${underMatch[1]}`
      : '/tools/compress-pdf';
  }

  // 7. Image Compression & Resizing with exact KB (e.g. /compress-image/to-12kb, /resize-image/to-14kb)
  const imageKbMatch = cleanPath.match(
    /(?:compress-image|resize-image|compress-to|to)-?(?:to-)?(\d+)(?:-)?kb/
  );
  if (imageKbMatch) {
    return `/tools/reduce-image-size-in-kb?target=${imageKbMatch[1]}`;
  }

  const imageMbMatch = cleanPath.match(
    /(?:compress-image|resize-image)-?(?:to-)?(\d+)(?:-)?mb/
  );
  if (imageMbMatch) {
    const kbVal = parseInt(imageMbMatch[1], 10) * 1024;
    return `/tools/reduce-image-size-in-kb?target=${kbVal}`;
  }

  // 8. General govt form / email presets
  if (cleanPath.includes('/resize-image/for-govt-form') || cleanPath.includes('ssc-photo-rejection')) {
    return '/tools/passport-photo-maker';
  }
  if (cleanPath.includes('/resize-image/for-email') || cleanPath.includes('/compress-image/for-email')) {
    return '/tools/reduce-image-size-in-kb?target=50';
  }
  if (cleanPath.includes('/resize-image/for-instagram')) {
    return '/tools/square-crop';
  }
  if (cleanPath.includes('/resize-image/without-losing-quality')) {
    return '/tools/compress-image';
  }

  // 9. Conversions & PDF tools
  if (cleanPath.includes('convert-image/to-jpg') || cleanPath === '/convert-image') {
    return '/tools/png-to-jpg';
  }
  if (cleanPath.includes('convert-image/to-webp')) {
    return '/tools/image-to-webp';
  }
  if (cleanPath.startsWith('/jpg-to-pdf') || cleanPath.startsWith('/image-to-pdf') || cleanPath === '/word-to-pdf') {
    return '/tools/image-to-pdf';
  }
  if (cleanPath.startsWith('/pdf-to-jpg') || cleanPath.startsWith('/pdf-to-images')) {
    return '/tools/pdf-to-images';
  }
  if (cleanPath.startsWith('/merge-pdf') || cleanPath === '/merge-pdfs' || cleanPath.includes('/merge-pdf/combine')) {
    return '/tools/merge-pdf';
  }
  if (cleanPath.startsWith('/watermark-image')) {
    return '/tools/watermark-images';
  }
  if (cleanPath.startsWith('/dimension-resizer')) {
    return '/tools/resize-image-pixel';
  }

  // 10. Historical blogs & stories
  if (cleanPath.startsWith('/blog') || cleanPath.startsWith('/stories') || cleanPath === '/image-size-guide') {
    return '/#all-tools';
  }

  // 11. Exact single slug check (e.g. /compress-image -> /tools/compress-image)
  const slug = cleanPath.slice(1); // remove leading slash
  if (TOOL_SLUG_SET.has(slug)) {
    return `/tools/${slug}`;
  }

  // Check common aliases
  const ALIAS_MAP: Record<string, string> = {
    'compress-image': 'compress-image',
    'reduce-image-size-kb': 'reduce-image-size-in-kb',
    'reduce-image-size-in-kb': 'reduce-image-size-in-kb',
    'resize-image-pixel': 'resize-image-pixel',
    'bulk-image-resizer': 'bulk-image-resizer',
    'crop-png': 'crop-image',
    'merge-pdfs': 'merge-pdf',
  };

  if (ALIAS_MAP[slug]) {
    return `/tools/${ALIAS_MAP[slug]}`;
  }

  return null;
}
