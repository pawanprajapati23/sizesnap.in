/**
 * SizeSnap.in SEO Migration & 301 Permanent Redirect Mapping
 * Ensures 100% preservation of historical Google search traffic, backlinks, and indexed URLs.
 */
import { ALL_TOOLS } from '@/data/tools';

const TOOL_SLUG_SET = new Set(ALL_TOOLS.map((t) => t.slug));

// Dedicated standalone tool pages that exist in app/tools/
const KNOWN_EXTRA_TOOLS = new Set([
  '11kb-photo-size',
  'compress-image-to-11kb',
  '12kb-photo-size',
  'compress-image-to-12kb',
  '13kb-photo-size',
  'compress-image-to-13kb',
  '14kb-photo-size',
  '15kb-photo-size',
  'compress-image-to-15kb',
  '28kb-photo-size',
  'compress-image-to-28kb',
  '150kb-photo-size',
  'compress-image-to-150kb',
  '110kb-photo-size',
  'compress-pdf-12kb',
  'compress-pdf-140kb',
  'compress-pdf-200kb',
  'compress-pdf-300kb',
  'compress-pdf-100kb',
  'compress-pdf-500kb',
  'compress-pdf-50kb',
  'thumb-impression-resizer',
  'handwritten-declaration-resizer',
  'jpg-to-pdf-under-200kb',
  'jpeg-to-pdf-under-200kb',
  'jpg-to-pdf-under-100kb',
  'jpeg-to-pdf-under-100kb',
  'jpg-to-pdf-under-500kb',
  'jpeg-to-pdf-under-500kb',
  'jpg-to-pdf-under-150kb',
  'jpeg-to-pdf-under-150kb',
  'compress-image-between-20kb-to-50kb',
  'compress-jpeg-between-20kb-to-50kb',
  'compress-image-between-10kb-to-20kb',
  'compress-image-10kb-to-20kb',
  'compress-image-between-30kb-to-70kb',
  '5kb-photo-size',
  'compress-image-to-5kb',
  'resize-image-3-5cm-4-5cm',
  'resize-image-to-3-5cmx4-5cm',
  'add-name-and-date-on-photo',
  'name-and-date-on-photo',
  'white-background-passport-photo',
  'remove-shadow-from-document',
  'pan-card-photo-resizer',
  'ssc-photo-and-signature-resizer',
  'passport-size-photo-3.5x4.5cm',
  '60kb-photo-size',
  '200-dpi-converter',
  '20kb-photo-size',
  '50kb-photo-size',
  '30kb-photo-size',
  '100kb-photo-size',
]);

// Reserved system routes that should never be treated as tool redirects
export const SYSTEM_ROUTES = new Set([
  'about',
  'contact',
  'privacy-policy',
  'terms',
  'tools',
  'exams',
  'blog',
  'admin',
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

  // Legacy blog redirects
  if (cleanPath.includes('how-to-compress-pdf-for-government-exams')) {
    return '/blog/how-to-compress-pdf-to-100kb-140kb-for-govt-portals';
  }
  if (cleanPath.includes('how-to-resize-image-to-20kb')) {
    return '/blog/how-to-reduce-image-size-in-kb-without-losing-quality';
  }
  if (cleanPath.includes('document-scanner-app-alternative')) {
    return '/tools/ai-photo-enhancer';
  }

  // Skip system routes
  const firstSegment = cleanPath.split('/')[1];
  if (SYSTEM_ROUTES.has(firstSegment)) {
    return null;
  }

  // Handle /hi/ localized URLs, /$, /&
  if (cleanPath.startsWith('/hi/')) {
    cleanPath = cleanPath.replace('/hi', '');
  } else if (cleanPath === '/hi' || cleanPath === '/$' || cleanPath === '/&') {
    return '/';
  }

  // 0. Exam Application Pack & Combos
  if (
    cleanPath.includes('exam-pack') ||
    cleanPath.includes('combine-photo-and-signature')
  ) {
    return '/exams/exam-application-kit';
  }

  // 0.5. Specialized Photo Presets (Name & Date, 3.5x4.5cm, White Background)
  if (
    cleanPath.includes('name-and-date-on-photo') ||
    cleanPath.includes('add-name-and-date') ||
    cleanPath.includes('dop-photo-maker') ||
    cleanPath.includes('photo-name-date')
  ) {
    return '/tools/add-name-and-date-on-photo';
  }

  if (
    cleanPath.includes('3.5cmx4.5cm') ||
    cleanPath.includes('3-5cm-4-5cm') ||
    cleanPath.includes('3.5-4.5') ||
    cleanPath.includes('35mmx45mm') ||
    cleanPath.includes('35x45mm')
  ) {
    return '/tools/resize-image-3-5cm-4-5cm';
  }

  if (
    cleanPath.includes('white-background-passport-photo') ||
    cleanPath.includes('white-background-photo') ||
    cleanPath.includes('make-photo-white-background')
  ) {
    return '/tools/white-background-passport-photo';
  }

  // PAN Card photo and signature resizer (NSDL & UTIITSL)
  if (
    cleanPath.includes('pan-card') ||
    cleanPath.includes('nsdl-photo') ||
    cleanPath.includes('uti-photo') ||
    cleanPath.includes('213x213')
  ) {
    return '/tools/pan-card-photo-resizer';
  }

  // 1. Dedicated Government Exam Presets (High search volume)
  if (
    cleanPath.includes('ssc-photo') ||
    cleanPath.includes('ssc-signature') ||
    cleanPath.includes('ssc-photo-rejection')
  ) {
    return '/exams/ssc-photo-signature-resizer';
  }

  if (
    cleanPath.includes('upsc-photo') ||
    cleanPath.includes('upsc-signature') ||
    cleanPath.includes('upsc-otr')
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

  if (
    cleanPath.includes('rrb') ||
    cleanPath.includes('railway-photo') ||
    cleanPath.includes('railway-signature') ||
    cleanPath.includes('rrb-ntpc')
  ) {
    return '/exams/rrb-railway-photo-signature-resizer';
  }

  if (
    cleanPath.includes('neet') ||
    cleanPath.includes('jee-main') ||
    cleanPath.includes('postcard-photo') ||
    cleanPath.includes('nta-photo')
  ) {
    return '/exams/neet-jee-photo-signature-resizer';
  }

  if (
    cleanPath.includes('ctet') ||
    cleanPath.includes('kvs-photo') ||
    cleanPath.includes('kvs-signature') ||
    cleanPath.includes('teacher-exam')
  ) {
    return '/exams/ctet-kvs-photo-signature-resizer';
  }

  // 2. Document scanner, enhancer & shadow removal
  if (
    cleanPath.includes('document-enhancer') ||
    cleanPath.includes('enhance-document')
  ) {
    return '/tools/ai-photo-enhancer';
  }

  if (
    cleanPath.includes('scanner-black-and-white') ||
    cleanPath.includes('black-and-white-scanner') ||
    cleanPath.includes('pdf-shadow-remover') ||
    cleanPath.includes('shadow-remover') ||
    cleanPath.includes('remove-shadow') ||
    cleanPath.includes('online-document-shadow-removal') ||
    cleanPath.includes('shadow-removal') ||
    cleanPath.includes('bw-filter')
  ) {
    return '/tools/remove-shadow-from-document';
  }

  if (cleanPath.includes('document-scanner')) {
    return '/tools/document-scanner';
  }

  // 2.5. 200 DPI Scan Converter (UPSC / SSC)
  if (
    cleanPath.includes('200-dpi') ||
    cleanPath.includes('dpi-200') ||
    cleanPath.includes('dpi200') ||
    cleanPath.includes('200dpi')
  ) {
    return '/tools/200-dpi-converter';
  }

  // 2.6. General Reduce Image Size Hub (High GSC Impression queries)
  if (
    cleanPath === '/reduce-image-size-in-kb' ||
    cleanPath === '/reduce-image-size-kb' ||
    cleanPath === '/reduce-image-size' ||
    cleanPath === '/reduce-photo-size-in-kb' ||
    cleanPath === '/reduce-photo-size' ||
    cleanPath === '/photo-compressor-in-kb' ||
    cleanPath === '/size-reducer-in-kb' ||
    cleanPath === '/image-size-reducer-in-kb'
  ) {
    return '/tools/reduce-image-size-in-kb';
  }

  // 3. WhatsApp DP, square crop & social crops
  if (
    cleanPath.includes('whatsapp-dp') ||
    cleanPath.includes('whatsapp-crop') ||
    cleanPath.includes('crop-image-to-square') ||
    cleanPath.includes('crop-to-square')
  ) {
    return '/tools/crop-image';
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

  // 5. Signature resizing & digital signature variants
  if (
    cleanPath.includes('signature-transparent') ||
    cleanPath.includes('transparent-and-convert-ink') ||
    cleanPath.includes('convert-ink')
  ) {
    return '/tools/generate-signature';
  }

  if (cleanPath.startsWith('/signature-resize')) {
    const kbMatch = cleanPath.match(/(\d+)kb/);
    if (kbMatch) {
      return `/tools/reduce-image-size-in-kb?target=${kbMatch[1]}`;
    }
    return '/tools/generate-signature';
  }

  // 6. Universal PDF Compression with exact KB/MB (Top ranking on GSC: 140kb, 100kb, 200kb, 500kb, 12kb, etc.)
  // Handles all query permutations: /pdf-140-kb, /140kb-pdf, /pdf-compressor-140kb, /compress-pdf-to-140kb, /pdf-resize-140kb
  if (cleanPath.includes('pdf')) {
    const pdfExactKbMatch = cleanPath.match(/(?:(\d+)\s*(?:-|–|_)?\s*kb.*pdf|pdf.*?(?:to-)?(\d+)\s*(?:-|–|_)?\s*kb)/);
    if (pdfExactKbMatch) {
      const targetKb = pdfExactKbMatch[1] || pdfExactKbMatch[2];
      const exactPdfSlug = `compress-pdf-${targetKb}kb`;
      if (TOOL_SLUG_SET.has(exactPdfSlug) || KNOWN_EXTRA_TOOLS.has(exactPdfSlug)) {
        return `/tools/${exactPdfSlug}`;
      }
      return `/tools/compress-pdf?target=${targetKb}`;
    }

    const pdfExactMbMatch = cleanPath.match(/(?:(\d+(?:\.\d+)?)\s*(?:-|–|_)?\s*mb.*pdf|pdf.*?(?:to-)?(\d+(?:\.\d+)?)\s*(?:-|–|_)?\s*mb)/);
    if (pdfExactMbMatch) {
      const mbVal = pdfExactMbMatch[1] || pdfExactMbMatch[2];
      const kbVal = Math.round(parseFloat(mbVal) * 1024);
      const exactPdfSlug = `compress-pdf-${kbVal}kb`;
      if (TOOL_SLUG_SET.has(exactPdfSlug) || KNOWN_EXTRA_TOOLS.has(exactPdfSlug)) {
        return `/tools/${exactPdfSlug}`;
      }
      return `/tools/compress-pdf?target=${kbVal}`;
    }

    if (
      cleanPath === '/compress-pdf' ||
      cleanPath.startsWith('/compress-pdf/') ||
      cleanPath === '/pdf-compressor' ||
      cleanPath === '/pdf-compress' ||
      cleanPath === '/pdf-resizer' ||
      cleanPath === '/pdf-size-reducer'
    ) {
      return '/tools/compress-pdf';
    }

    if (cleanPath.includes('pdf-under-')) {
      const underMatch = cleanPath.match(/pdf-under-(\d+)kb/);
      return underMatch
        ? `/tools/compress-pdf?target=${underMatch[1]}`
        : '/tools/compress-pdf';
    }
  }

  // 6.5. Range Image Compression (e.g. 20kb-50kb, 10kb-20kb, 30kb-70kb)
  if (
    cleanPath.includes('between-20kb-to-50kb') ||
    cleanPath.includes('20kb-to-50kb') ||
    cleanPath.includes('20-to-50kb') ||
    cleanPath.includes('20-50kb')
  ) {
    return '/tools/compress-image-between-20kb-to-50kb';
  }

  if (
    cleanPath.includes('between-10kb-to-20kb') ||
    cleanPath.includes('10kb-to-20kb') ||
    cleanPath.includes('10-to-20kb') ||
    cleanPath.includes('10-20kb')
  ) {
    return '/tools/compress-image-between-10kb-to-20kb';
  }

  if (
    cleanPath.includes('between-30kb-to-70kb') ||
    cleanPath.includes('30kb-to-70kb') ||
    cleanPath.includes('30-to-70kb') ||
    cleanPath.includes('30-70kb')
  ) {
    return '/tools/compress-image-between-30kb-to-70kb';
  }

  // 6.5. Exact Photo Size Queries (e.g. /20kb-photo-size, /50kb-photo-size, /jpg20kb, /photo-size-20kb)
  const photoKbMatch = cleanPath.match(/(?:^|\/)(?:jpg)?(\d+)(?:-)?kb(?:-photo|-photo-size|-size)?/);
  if (photoKbMatch) {
    const kb = photoKbMatch[1];
    const candidateSlug = `${kb}kb-photo-size`;
    if (TOOL_SLUG_SET.has(candidateSlug) || KNOWN_EXTRA_TOOLS.has(candidateSlug)) {
      return `/tools/${candidateSlug}`;
    }
  }

  // 7. Image Compression & Resizing with exact KB (e.g. /compress-image/to-12kb, /resize-image/to-14kb, /resize-image/to-40kb)
  const imageKbMatch = cleanPath.match(
    /(?:compress-image|resize-image|compress-to|to)-?(?:to-)?(\d+)(?:-)?kb/
  );
  if (imageKbMatch) {
    const targetKb = imageKbMatch[1];
    const exactToolSlug = `compress-image-to-${targetKb}kb`;
    if (TOOL_SLUG_SET.has(exactToolSlug) || KNOWN_EXTRA_TOOLS.has(exactToolSlug)) {
      return `/tools/${exactToolSlug}`;
    }
    if (targetKb === '14' && (TOOL_SLUG_SET.has('14kb-photo-size') || KNOWN_EXTRA_TOOLS.has('14kb-photo-size'))) {
      return '/tools/14kb-photo-size';
    }
    if (targetKb === '110' && (TOOL_SLUG_SET.has('110kb-photo-size') || KNOWN_EXTRA_TOOLS.has('110kb-photo-size'))) {
      return '/tools/110kb-photo-size';
    }
    if (targetKb === '60' && (TOOL_SLUG_SET.has('60kb-photo-size') || KNOWN_EXTRA_TOOLS.has('60kb-photo-size'))) {
      return '/tools/60kb-photo-size';
    }
    return `/tools/reduce-image-size-in-kb?target=${targetKb}`;
  }

  const imageMbMatch = cleanPath.match(
    /(?:compress-image|resize-image)[\/-]?(?:to[\/-])?(\d+(?:\.\d+)?)[\/-]?mb/
  );
  if (imageMbMatch) {
    const kbVal = Math.round(parseFloat(imageMbMatch[1]) * 1024);
    return `/tools/reduce-image-size-in-kb?target=${kbVal}`;
  }

  // 8. General govt form / email presets
  if (cleanPath.includes('for-govt-form') || cleanPath.includes('ssc-photo-rejection')) {
    return '/tools/passport-photo-maker';
  }
  if (cleanPath.includes('/resize-image/for-email') || cleanPath.includes('/compress-image/for-email')) {
    return '/tools/reduce-image-size-in-kb?target=50';
  }
  if (cleanPath.includes('/resize-image/for-instagram')) {
    return '/tools/crop-image';
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
  // Specific JPG to PDF Under [X] KB redirects
  if (cleanPath.includes('200') && (cleanPath.includes('jpg-to-pdf') || cleanPath.includes('jpeg-to-pdf') || cleanPath.includes('image-to-pdf'))) {
    return '/tools/jpg-to-pdf-under-200kb';
  }
  if (cleanPath.includes('100') && (cleanPath.includes('jpg-to-pdf') || cleanPath.includes('jpeg-to-pdf') || cleanPath.includes('image-to-pdf'))) {
    return '/tools/jpg-to-pdf-under-100kb';
  }
  if (cleanPath.includes('500') && (cleanPath.includes('jpg-to-pdf') || cleanPath.includes('jpeg-to-pdf') || cleanPath.includes('image-to-pdf'))) {
    return '/tools/jpg-to-pdf-under-500kb';
  }
  if (cleanPath.includes('150') && (cleanPath.includes('jpg-to-pdf') || cleanPath.includes('jpeg-to-pdf') || cleanPath.includes('image-to-pdf'))) {
    return '/tools/jpg-to-pdf-under-150kb';
  }

  if (cleanPath.startsWith('/jpg-to-pdf') || cleanPath.startsWith('/image-to-pdf') || cleanPath === '/word-to-pdf') {
    return '/tools/image-to-pdf';
  }
  if (cleanPath.startsWith('/pdf-to-jpg') || cleanPath.startsWith('/pdf-to-images')) {
    return '/tools/pdf-to-images';
  }
  if (
    cleanPath.includes('rotate-and-reorder') ||
    cleanPath.includes('rotate-pdf')
  ) {
    return '/tools/rotate-pdf';
  }
  if (
    cleanPath.includes('add-page-numbers') ||
    cleanPath.includes('page-numbers-to-pdf')
  ) {
    return '/tools/add-page-numbers-pdf';
  }
  if (
    cleanPath.includes('password-protect-pdf') ||
    cleanPath.includes('protect-pdf')
  ) {
    return '/pdf-tools';
  }
  if (cleanPath.includes('password-generator')) {
    return '/developer-tools';
  }
  if (cleanPath === '/file-sharing') {
    return '/';
  }
  if (
    cleanPath.startsWith('/merge-pdf') ||
    cleanPath === '/merge-pdfs' ||
    cleanPath.includes('/merge-pdf/combine') ||
    cleanPath.includes('merge-marksheet') ||
    cleanPath.includes('merge-aadhaar')
  ) {
    return '/tools/merge-pdf';
  }
  if (cleanPath.startsWith('/watermark-image')) {
    return '/tools/image-watermark';
  }
  if (cleanPath.startsWith('/dimension-resizer')) {
    return '/tools/resize-image-pixel';
  }

  // 10. Historical blogs & stories
  if (cleanPath.startsWith('/stories') || cleanPath === '/image-size-guide') {
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
    '11kb-photo-size': 'compress-image-to-11kb',
    '12kb-photo-size': 'compress-image-to-12kb',
    '13kb-photo-size': 'compress-image-to-13kb',
    '14kb-photo-size': '14kb-photo-size',
    '15kb-photo-size': 'compress-image-to-15kb',
    'resize-image-to-15kb': 'compress-image-to-15kb',
    '28kb-photo-size': 'compress-image-to-28kb',
    '150kb-photo-size': 'compress-image-to-150kb',
    'resize-image-to-150kb': 'compress-image-to-150kb',
    'pdf-shadow-remover': 'remove-shadow-from-document',
    'document-shadow-remover': 'remove-shadow-from-document',
    'black-and-white-scanner': 'remove-shadow-from-document',
    '140kb-pdf': 'compress-pdf-140kb',
    'pdf-140kb': 'compress-pdf-140kb',
    '100kb-pdf': 'compress-pdf-100kb',
    'pdf-100kb': 'compress-pdf-100kb',
    '200kb-pdf': 'compress-pdf-200kb',
    'pdf-200kb': 'compress-pdf-200kb',
    '300kb-pdf': 'compress-pdf-300kb',
    'pdf-300kb': 'compress-pdf-300kb',
    '500kb-pdf': 'compress-pdf-500kb',
    'pdf-500kb': 'compress-pdf-500kb',
    '50kb-pdf': 'compress-pdf-50kb',
    'pdf-50kb': 'compress-pdf-50kb',
    'thumb-impression-resizer': 'thumb-impression-resizer',
    'left-thumb-impression-resizer': 'thumb-impression-resizer',
    'thumb-resizer': 'thumb-impression-resizer',
    'ibps-thumb-resizer': 'thumb-impression-resizer',
    'thumb-impression': 'thumb-impression-resizer',
    'handwritten-declaration-resizer': 'handwritten-declaration-resizer',
    'ibps-declaration-resizer': 'handwritten-declaration-resizer',
    'declaration-resizer': 'handwritten-declaration-resizer',
    'sbi-declaration-resizer': 'handwritten-declaration-resizer',
    'handwritten-declaration-800x400': 'handwritten-declaration-resizer',
    'bank-declaration-resizer': 'handwritten-declaration-resizer',
  };

  if (ALIAS_MAP[slug]) {
    return `/tools/${ALIAS_MAP[slug]}`;
  }

  return null;
}
