export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, sizes.length - 1);
  const value = parseFloat((bytes / Math.pow(k, idx)).toFixed(dm));

  return `${value} ${sizes[idx]}`;
}

export function calculateSavings(
  originalBytes: number,
  compressedBytes: number
): { percent: number; savedBytes: number; isSmaller: boolean } {
  if (!originalBytes || !compressedBytes) {
    return { percent: 0, savedBytes: 0, isSmaller: false };
  }

  const diff = originalBytes - compressedBytes;
  const percent = Math.round((diff / originalBytes) * 100);
  const isSmaller = diff > 0;

  return {
    percent: Math.abs(percent),
    savedBytes: Math.max(0, diff),
    isSmaller,
  };
}

export function sanitizeFilename(name: string, targetExt: string): string {
  const baseName = name.replace(/\.[^/.]+$/, '').trim() || 'image';
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${cleanBase}-sizesnap.${targetExt}`;
}

export function getExtensionFromMime(mime: string, fallbackName: string): string {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  
  // Extract from original name
  const match = fallbackName.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : 'jpg';
}
