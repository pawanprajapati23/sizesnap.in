/**
 * Centralized PDF.js Loader & Configuration for SizeSnap
 *
 * Ensures exact matching worker version and same-origin execution
 * to avoid CORS or version mismatch errors in all modern browsers.
 */

export const getPdfJs = async () => {
  const pdfjs = await import('pdfjs-dist');

  if (typeof window !== 'undefined') {
    // Configure same-origin worker URL
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }
  }

  return pdfjs;
};

export const getPdfCMapConfig = () => {
  return {
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.624/cmaps/',
    cMapPacked: true,
  };
};
