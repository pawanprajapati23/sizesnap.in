/**
 * Cloudinary Dynamic URL Optimization Helper for SizeSnap
 *
 * Automatically optimizes images via Cloudinary transformations:
 * - f_auto: Serves modern formats (AVIF/WebP) based on user's browser
 * - q_auto: Applies AI perceptual quality compression to minimize file size
 * - w_*, h_*, c_*: Dynamic responsive resizing and smart cropping
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco';
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
}

export function getOptimizedCloudinaryUrl(
  url?: string | null,
  options?: CloudinaryTransformOptions
): string {
  if (!url) return '';
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }

  // Remove existing transformation segment if present after /upload/
  let cleanUrl = url;
  const uploadIndex = cleanUrl.indexOf('/image/upload/');
  if (uploadIndex !== -1) {
    const afterUpload = cleanUrl.substring(uploadIndex + '/image/upload/'.length);
    const slashIndex = afterUpload.indexOf('/');
    if (slashIndex !== -1) {
      const firstSegment = afterUpload.substring(0, slashIndex);
      if (/^(?:[a-z]_[a-zA-Z0-9_:\-]+,?)+$/.test(firstSegment)) {
        cleanUrl = cleanUrl.replace(`/image/upload/${firstSegment}/`, '/image/upload/');
      }
    }
  }

  const transforms: string[] = [];

  // Default to automatic format & quality
  transforms.push(options?.format ? `f_${options.format}` : 'f_auto');
  transforms.push(options?.quality ? `q_${options.quality}` : 'q_auto');

  // Width & Height
  if (options?.width) {
    transforms.push(`w_${options.width}`);
  }
  if (options?.height) {
    transforms.push(`h_${options.height}`);
  }

  // Crop & Gravity
  if (options?.crop) {
    transforms.push(`c_${options.crop}`);
  }
  if (options?.gravity) {
    transforms.push(`g_${options.gravity}`);
  }

  const transformSegment = transforms.join(',');
  return cleanUrl.replace('/image/upload/', `/image/upload/${transformSegment}/`);
}
