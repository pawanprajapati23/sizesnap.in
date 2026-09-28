'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import {
  Upload,
  FilePlus,
  Trash2,
  Download,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Archive,
  Code,
} from 'lucide-react';

interface GeneratedIcon {
  size: number;
  name: string;
  blob: Blob;
  url: string;
}

const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png', desc: 'Standard browser tab icon' },
  { size: 32, name: 'favicon-32x32.png', desc: 'High-DPI / Retina browser tab' },
  { size: 48, name: 'favicon-48x48.png', desc: 'Desktop shortcut icon' },
  { size: 180, name: 'apple-touch-icon.png', desc: 'iOS Safari home screen icon' },
  { size: 192, name: 'android-chrome-192x192.png', desc: 'Android Chrome PWA icon' },
  { size: 512, name: 'android-chrome-512x512.png', desc: 'Splash screen / store listing' },
];

export function FaviconGeneratorTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);
  const [icoBlob, setIcoBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  const registerUrl = useCallback((url: string) => {
    urlsRef.current.push(url);
    return url;
  }, []);

  const cleanupUrls = useCallback(() => {
    urlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    urlsRef.current = [];
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  // Construct valid multi-resolution Windows ICO file containing PNGs
  const createIcoFromPngs = (pngItems: { size: number; arrayBuffer: ArrayBuffer }[]): Blob => {
    const numImages = pngItems.length;
    const headerSize = 6 + 16 * numImages;

    let totalFileSize = headerSize;
    pngItems.forEach((it) => {
      totalFileSize += it.arrayBuffer.byteLength;
    });

    const buffer = new ArrayBuffer(totalFileSize);
    const view = new DataView(buffer);

    // ICONDIR
    view.setUint16(0, 0, true); // Reserved
    view.setUint16(2, 1, true); // Type 1 = ICO
    view.setUint16(4, numImages, true); // Number of images

    let currentOffset = headerSize;

    // ICONDIRENTRY list
    pngItems.forEach((it, idx) => {
      const entryOffset = 6 + idx * 16;
      view.setUint8(entryOffset + 0, it.size >= 256 ? 0 : it.size); // Width
      view.setUint8(entryOffset + 1, it.size >= 256 ? 0 : it.size); // Height
      view.setUint8(entryOffset + 2, 0); // Palette count
      view.setUint8(entryOffset + 3, 0); // Reserved
      view.setUint16(entryOffset + 4, 1, true); // Color planes
      view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
      view.setUint32(entryOffset + 8, it.arrayBuffer.byteLength, true); // Image data size
      view.setUint32(entryOffset + 12, currentOffset, true); // Offset in file

      // Copy PNG data
      const uint8View = new Uint8Array(buffer, currentOffset, it.arrayBuffer.byteLength);
      uint8View.set(new Uint8Array(it.arrayBuffer));

      currentOffset += it.arrayBuffer.byteLength;
    });

    return new Blob([buffer], { type: 'image/x-icon' });
  };

  // Generate all icon resolutions from source image
  const generateFaviconPackage = async (sourceUrl: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    await new Promise((r) => setTimeout(r, 50));

    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for favicon generation.'));
        img.src = sourceUrl;
      });

      const iconResults: GeneratedIcon[] = [];
      const icoPngBuffers: { size: number; arrayBuffer: ArrayBuffer }[] = [];

      for (const target of FAVICON_SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = target.size;
        canvas.height = target.size;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image fit / centered into square
        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;
        const aspect = srcW / srcH;

        let drawW = target.size;
        let drawH = target.size;
        let drawX = 0;
        let drawY = 0;

        if (aspect > 1) {
          drawH = target.size / aspect;
          drawY = (target.size - drawH) / 2;
        } else if (aspect < 1) {
          drawW = target.size * aspect;
          drawX = (target.size - drawW) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/png')
        );

        if (blob) {
          const url = registerUrl(URL.createObjectURL(blob));
          iconResults.push({
            size: target.size,
            name: target.name,
            blob,
            url,
          });

          // Include 16, 32, and 48 in favicon.ico
          if ([16, 32, 48].includes(target.size)) {
            const arrayBuffer = await blob.arrayBuffer();
            icoPngBuffers.push({ size: target.size, arrayBuffer });
          }
        }
      }

      // Generate multi-resolution ICO file
      const multiIcoBlob = createIcoFromPngs(icoPngBuffers);
      setIcoBlob(multiIcoBlob);
      setGeneratedIcons(iconResults);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Favicon package generation failed.');
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const previewUrl = registerUrl(URL.createObjectURL(file));
    setImageSrc(previewUrl);
    setImageName(file.name);
    generateFaviconPackage(previewUrl);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearAll = () => {
    cleanupUrls();
    setImageSrc(null);
    setImageName('');
    setGeneratedIcons([]);
    setIcoBlob(null);
    setErrorMsg(null);
  };

  // Download entire package as ZIP
  const downloadAllZip = async () => {
    if (generatedIcons.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add favicon.ico
      if (icoBlob) {
        zip.file('favicon.ico', icoBlob);
      }

      // Add PNG sizes
      generatedIcons.forEach((icon) => {
        zip.file(icon.name, icon.blob);
      });

      // Add site.webmanifest
      const manifestContent = JSON.stringify(
        {
          name: 'My Application',
          short_name: 'App',
          icons: [
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
        },
        null,
        2
      );
      zip.file('site.webmanifest', manifestContent);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = registerUrl(URL.createObjectURL(zipBlob));
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = 'sizesnap-favicon-package.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setErrorMsg('Failed to create ZIP package: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingleIcon = (name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const htmlHeadSnippet = `<!-- Favicon & App Icons generated by SizeSnap.in -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;

  const copyHtmlSnippet = async () => {
    try {
      await navigator.clipboard.writeText(htmlHeadSnippet);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = htmlHeadSnippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1">{errorMsg}</p>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs font-semibold text-red-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      {!imageSrc ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.svg,.webp"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag Logo to Generate Favicon Package
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Generate multi-resolution favicon.ico (16, 32, 48), Apple Touch Icon (180x180), Android Chrome icons (192, 512), and site.webmanifest.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
          >
            <FilePlus className="h-4 w-4" />
            <span>Select Logo File</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>favicon.ico + PNG bundle</span>
            <span>•</span>
            <span>site.webmanifest + HTML tag</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded border border-gray-200 bg-[#FAFAFC] overflow-hidden flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="Source logo" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md" title={imageName}>
                  {imageName}
                </h3>
                <p className="text-[11px] text-gray-500">
                  Ready to download complete cross-browser favicon suite
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Replace Logo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.svg,.webp"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Quick ZIP Download Banner */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Favicon Package Ready for Production!
                </h3>
              </div>
              <p className="text-xs text-gray-500 pl-7">
                Includes multi-size favicon.ico, Apple Touch Icon, Android Chrome icons, and site.webmanifest.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadAllZip}
              disabled={isZipping || isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-gray-400 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
            >
              {isZipping ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Packaging ZIP...</span>
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  <span>Download Favicon Package (ZIP)</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Icons Grid */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block border-b border-gray-100 pb-2">
              Generated Icon Formats ({generatedIcons.length + (icoBlob ? 1 : 0)})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Multi-resolution favicon.ico */}
              {icoBlob && (
                <div className="p-3 rounded border border-[#9AA3C8]/40 bg-[#FAFAFC] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded border border-gray-200 bg-white flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageSrc} alt="favicon.ico" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">favicon.ico</p>
                      <p className="text-[11px] text-gray-500">16, 32, 48 Multi-size ICO</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadSingleIcon('favicon.ico', icoBlob)}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Download favicon.ico"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* PNG Sizes */}
              {generatedIcons.map((icon) => (
                <div
                  key={icon.name}
                  className="p-3 rounded border border-gray-200 bg-white flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded border border-gray-200 bg-[#FAFAFC] flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={icon.url} alt={icon.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate" title={icon.name}>
                        {icon.name}
                      </p>
                      <p className="text-[11px] text-gray-500">{icon.size} × {icon.size} px</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadSingleIcon(icon.name, icon.blob)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                    title={`Download ${icon.name}`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* HTML Snippet for <head> */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-[#414FA8]" />
                <span>HTML &lt;head&gt; Snippet</span>
              </span>
              <button
                type="button"
                onClick={copyHtmlSnippet}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] text-xs font-semibold rounded border border-[#9AA3C8]/40 transition-colors"
              >
                {copiedHtml ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy HTML</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              readOnly
              value={htmlHeadSnippet}
              rows={5}
              className="w-full p-2.5 font-mono text-[11px] bg-[#FAFAFC] border border-gray-200 rounded text-gray-800 focus:outline-none resize-none"
            />
            <p className="text-[11px] text-gray-400">
              Paste these tags into your index.html or Next.js app/layout.tsx &lt;head&gt; section.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Icons and ICO binaries generated 100% in your browser. Zero server processing.</span>
          </div>
        </div>
      )}
    </div>
  );
}
