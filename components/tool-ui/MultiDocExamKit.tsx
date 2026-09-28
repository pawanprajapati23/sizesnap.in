'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';

interface DocSpec {
  id: string;
  name: string;
  description: string;
  targetWidth: number;
  targetHeight: number;
  minKb: number;
  maxKb: number;
  targetKb: number;
  aspectRatio: string;
  format: 'image/jpeg';
  isSignature?: boolean;
  hasNameDateOption?: boolean;
}

interface ExamKitConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  docs: DocSpec[];
}

const EXAM_KITS: ExamKitConfig[] = [
  {
    id: 'ssc',
    name: 'SSC All Exams Kit (CGL, CHSL, MTS, GD)',
    shortName: 'SSC Kit',
    tagline: 'Standard 3.5×4.5 cm Photo + 4.0×2.0 cm Signature',
    badge: 'SSC Official Portal Ready',
    docs: [
      {
        id: 'photo',
        name: 'Passport Photo',
        description: 'Light/plain background, front facing, clear eyes',
        targetWidth: 350,
        targetHeight: 450,
        minKb: 20,
        maxKb: 50,
        targetKb: 35,
        aspectRatio: '3.5 × 4.5 cm (7:9)',
        format: 'image/jpeg',
      },
      {
        id: 'signature',
        name: 'Applicant Signature',
        description: 'Black or blue ink on clean white unruled paper',
        targetWidth: 280,
        targetHeight: 120,
        minKb: 10,
        maxKb: 20,
        targetKb: 15,
        aspectRatio: '4.0 × 2.0 cm (7:3)',
        format: 'image/jpeg',
        isSignature: true,
      },
    ],
  },
  {
    id: 'upsc',
    name: 'UPSC Civil Services / NDA / CDS (OTR Kit)',
    shortName: 'UPSC Kit',
    tagline: 'Square Photo with Name & DOP Stamp + Official Signature',
    badge: 'Latest 10-Day DOP Rule Compliant',
    docs: [
      {
        id: 'photo',
        name: 'Passport Photo (with DOP)',
        description: 'Clean background with candidate name and date of photo',
        targetWidth: 550,
        targetHeight: 550,
        minKb: 20,
        maxKb: 300,
        targetKb: 120,
        aspectRatio: '1:1 Square',
        format: 'image/jpeg',
        hasNameDateOption: true,
      },
      {
        id: 'signature',
        name: 'Applicant Signature',
        description: 'Clear running handwriting signature on plain white paper',
        targetWidth: 350,
        targetHeight: 175,
        minKb: 20,
        maxKb: 300,
        targetKb: 80,
        aspectRatio: '2:1 Landscape',
        format: 'image/jpeg',
        isSignature: true,
      },
    ],
  },
  {
    id: 'ibps',
    name: 'IBPS Banking & SBI Kit (PO, Clerk, SO)',
    shortName: 'IBPS 4-in-1',
    tagline: 'Complete 4-Document Bundle: Photo, Sign, Thumb & Declaration',
    badge: 'IBPS / SBI Portal Ready',
    docs: [
      {
        id: 'photo',
        name: 'Color Passport Photo',
        description: '200 × 230 pixels, light/white background',
        targetWidth: 200,
        targetHeight: 230,
        minKb: 20,
        maxKb: 50,
        targetKb: 35,
        aspectRatio: '200 × 230 px',
        format: 'image/jpeg',
      },
      {
        id: 'signature',
        name: 'Black Ink Signature',
        description: '140 × 60 pixels, strictly black ink on white paper',
        targetWidth: 140,
        targetHeight: 60,
        minKb: 10,
        maxKb: 20,
        targetKb: 15,
        aspectRatio: '140 × 60 px',
        format: 'image/jpeg',
        isSignature: true,
      },
      {
        id: 'thumb',
        name: 'Left Thumb Impression',
        description: '240 × 240 pixels on white paper with black/blue ink',
        targetWidth: 240,
        targetHeight: 240,
        minKb: 20,
        maxKb: 50,
        targetKb: 35,
        aspectRatio: '1:1 Square (240px)',
        format: 'image/jpeg',
      },
      {
        id: 'declaration',
        name: 'Handwritten Declaration',
        description: '800 × 400 pixels in candidate\'s own handwriting',
        targetWidth: 800,
        targetHeight: 400,
        minKb: 50,
        maxKb: 100,
        targetKb: 75,
        aspectRatio: '2:1 Landscape (800×400px)',
        format: 'image/jpeg',
      },
    ],
  },
  {
    id: 'police',
    name: 'UP Police, Delhi Police & State Constable Kit',
    shortName: 'Police Exams',
    tagline: 'Strict 35×45 mm Photo & Black Ink Signature',
    badge: 'Police Recruitment Ready',
    docs: [
      {
        id: 'photo',
        name: 'Passport Size Photo',
        description: '35×45 mm, light white or grey background',
        targetWidth: 350,
        targetHeight: 450,
        minKb: 20,
        maxKb: 50,
        targetKb: 35,
        aspectRatio: '35 × 45 mm',
        format: 'image/jpeg',
      },
      {
        id: 'signature',
        name: 'Strict Black Ink Signature',
        description: 'Only black ink signature on white paper is accepted',
        targetWidth: 280,
        targetHeight: 120,
        minKb: 5,
        maxKb: 20,
        targetKb: 15,
        aspectRatio: '280 × 120 px',
        format: 'image/jpeg',
        isSignature: true,
      },
    ],
  },
];

interface ProcessedDoc {
  file: File;
  previewUrl: string;
  processedBlob: Blob | null;
  processedUrl: string | null;
  sizeKb: number;
  width: number;
  height: number;
  status: 'idle' | 'processing' | 'ready' | 'error';
  errorMessage?: string;
}

export default function MultiDocExamKit() {
  const [selectedKitId, setSelectedKitId] = useState<string>('ssc');
  const [docStates, setDocStates] = useState<Record<string, ProcessedDoc>>({});
  
  // UPSC specific Name and DOP state
  const [candidateName, setCandidateName] = useState<string>('YOUR NAME');
  const [photoDate, setPhotoDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [applyDopStamp, setApplyDopStamp] = useState<boolean>(true);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const currentKit = EXAM_KITS.find((k) => k.id === selectedKitId) || EXAM_KITS[0];

  // Processing function
  const processImageForDoc = async (
    file: File,
    spec: DocSpec,
    kitId: string,
    options?: { name?: string; date?: string; addStamp?: boolean }
  ) => {
    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          canvas.width = spec.targetWidth;
          canvas.height = spec.targetHeight;

          // Fill clean background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Calculate cover crop
          const targetRatio = canvas.width / canvas.height;
          const imgRatio = img.width / img.height;

          let sx = 0, sy = 0, sw = img.width, sh = img.height;

          if (imgRatio > targetRatio) {
            sw = img.height * targetRatio;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / targetRatio;
            sy = (img.height - sh) / 2;
          }

          // If signature, apply contrast enhancement
          if (spec.isSignature) {
            ctx.filter = 'contrast(135%) brightness(105%)';
          }

          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
          ctx.filter = 'none';

          // Optional UPSC Name and Date of Photo Stamp
          if (spec.hasNameDateOption && options?.addStamp) {
            const stripHeight = Math.round(canvas.height * 0.18);
            const startY = canvas.height - stripHeight;

            // White banner for name & DOP
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, startY, canvas.width, stripHeight);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, startY, canvas.width - 2, stripHeight - 1);

            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const fontSize = Math.max(12, Math.round(stripHeight * 0.32));
            ctx.font = `bold ${fontSize}px sans-serif`;

            const nameText = (options.name || 'CANDIDATE NAME').toUpperCase();
            const dateText = `DOP: ${options.date || new Date().toISOString().split('T')[0]}`;

            ctx.fillText(nameText, canvas.width / 2, startY + stripHeight * 0.32);
            ctx.font = `600 ${Math.max(10, Math.round(fontSize * 0.85))}px sans-serif`;
            ctx.fillText(dateText, canvas.width / 2, startY + stripHeight * 0.72);
          }

          // Compression loop to stay strictly between minKb and maxKb
          const targetBytes = spec.targetKb * 1024;
          const maxBytes = spec.maxKb * 1024;

          let low = 0.05;
          let high = 0.96;
          let bestBlob: Blob | null = null;

          for (let iter = 0; iter < 8; iter++) {
            const mid = (low + high) / 2;
            const blob = await new Promise<Blob | null>((res) => {
              canvas.toBlob((b) => res(b), 'image/jpeg', mid);
            });

            if (!blob) break;

            if (blob.size <= maxBytes) {
              bestBlob = blob;
              if (Math.abs(blob.size - targetBytes) < 2048) {
                break;
              }
              low = mid;
            } else {
              high = mid;
            }
          }

          if (!bestBlob) {
            canvas.toBlob((b) => {
              if (b) resolve(b);
              else reject(new Error('Compression failed'));
            }, 'image/jpeg', 0.5);
          } else {
            resolve(bestBlob);
          }
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (spec: DocSpec, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setDocStates((prev) => ({
      ...prev,
      [spec.id]: {
        file,
        previewUrl,
        processedBlob: null,
        processedUrl: null,
        sizeKb: 0,
        width: spec.targetWidth,
        height: spec.targetHeight,
        status: 'processing',
      },
    }));

    try {
      const blob = await processImageForDoc(file, spec, selectedKitId, {
        name: candidateName,
        date: photoDate,
        addStamp: applyDopStamp,
      });

      const processedUrl = URL.createObjectURL(blob);
      setDocStates((prev) => ({
        ...prev,
        [spec.id]: {
          ...prev[spec.id],
          processedBlob: blob,
          processedUrl,
          sizeKb: Number((blob.size / 1024).toFixed(1)),
          status: 'ready',
        },
      }));
    } catch {
      setDocStates((prev) => ({
        ...prev,
        [spec.id]: {
          ...prev[spec.id],
          status: 'error',
          errorMessage: 'Could not process image',
        },
      }));
    }
  };

  const handleReprocessWithStamp = async () => {
    const photoSpec = currentKit.docs.find((d) => d.hasNameDateOption);
    if (!photoSpec || !docStates[photoSpec.id]?.file) return;

    const file = docStates[photoSpec.id].file;
    setDocStates((prev) => ({
      ...prev,
      [photoSpec.id]: {
        ...prev[photoSpec.id],
        status: 'processing',
      },
    }));

    try {
      const blob = await processImageForDoc(file, photoSpec, selectedKitId, {
        name: candidateName,
        date: photoDate,
        addStamp: applyDopStamp,
      });

      const processedUrl = URL.createObjectURL(blob);
      setDocStates((prev) => ({
        ...prev,
        [photoSpec.id]: {
          ...prev[photoSpec.id],
          processedBlob: blob,
          processedUrl,
          sizeKb: Number((blob.size / 1024).toFixed(1)),
          status: 'ready',
        },
      }));
    } catch {
      setDocStates((prev) => ({
        ...prev,
        [photoSpec.id]: {
          ...prev[photoSpec.id],
          status: 'error',
          errorMessage: 'Failed to update DOP stamp',
        },
      }));
    }
  };

  const downloadDoc = (docId: string, docName: string) => {
    const doc = docStates[docId];
    if (!doc?.processedUrl) return;

    const link = document.createElement('a');
    link.href = doc.processedUrl;
    link.download = `${selectedKitId}_${docId}_sizesnap.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Kit Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {EXAM_KITS.map((kit) => (
            <button
              key={kit.id}
              onClick={() => {
                setSelectedKitId(kit.id);
                setDocStates({});
              }}
              className={`flex-1 min-w-[200px] text-left px-4 py-3 rounded-xl transition-all duration-200 border ${
                selectedKitId === kit.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{kit.shortName}</span>
                {selectedKitId === kit.id && (
                  <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {kit.tagline}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Kit Header Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {currentKit.badge}
            </div>
            <h2 className="text-2xl font-bold">{currentKit.name}</h2>
            <p className="text-blue-100 text-sm mt-1">{currentKit.tagline}</p>
          </div>
          <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <div>
              <div className="font-semibold text-white">100% Client-Side Safe</div>
              <div className="text-blue-200 text-[11px]">Zero server upload · 100% Private</div>
            </div>
          </div>
        </div>
      </div>

      {/* UPSC Name & DOP Form (If UPSC is active) */}
      {selectedKitId === 'upsc' && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-200">
              UPSC OTR 10-Day Photo Customization (Name & DOP Strip)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. RAHUL SHARMA"
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date of Photo (DOP)
              </label>
              <input
                type="date"
                value={photoDate}
                onChange={(e) => setPhotoDate(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleReprocessWithStamp}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Update Name & DOP Stamp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Document Grid */}
      <div className={`grid grid-cols-1 ${currentKit.docs.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-6`}>
        {currentKit.docs.map((spec) => {
          const docState = docStates[spec.id];
          const isUploaded = !!docState;
          const isReady = docState?.status === 'ready';

          return (
            <div
              key={spec.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header of Doc Box */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {spec.name}
                      </span>
                      {spec.isSignature && (
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
                          Signature
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {spec.description}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                      {spec.minKb}–{spec.maxKb} KB
                    </span>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {spec.targetWidth}×{spec.targetHeight} px
                    </div>
                  </div>
                </div>

                {/* Upload or Preview Box */}
                {!isUploaded ? (
                  <div
                    onClick={() => fileInputRefs.current[spec.id]?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/40 group"
                  >
                    <input
                      type="file"
                      ref={(el) => {
                        fileInputRefs.current[spec.id] = el;
                      }}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(spec, file);
                      }}
                      className="hidden"
                    />
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      Click to choose or drop {spec.name}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      JPG, PNG, WebP up to 25 MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Visual Preview */}
                    <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[200px] max-h-[260px] p-2">
                      {docState.status === 'processing' ? (
                        <div className="flex flex-col items-center gap-2 py-8">
                          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                            Calculating exact {spec.targetKb} KB size...
                          </span>
                        </div>
                      ) : docState.processedUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={docState.processedUrl}
                          alt={spec.name}
                          className="max-h-[220px] max-w-full object-contain rounded shadow-sm border border-slate-200 dark:border-slate-700 bg-white"
                        />
                      ) : null}
                    </div>

                    {/* Verification Badges */}
                    {isReady && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            Official Portal Compliant
                          </span>
                          <span className="bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded font-mono text-[11px]">
                            {docState.sizeKb} KB (Target: {spec.minKb}–{spec.maxKb} KB)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                          <span>Resolution: {spec.targetWidth} × {spec.targetHeight} px</span>
                          <span>Format: JPEG (.jpg)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                {isUploaded ? (
                  <>
                    <button
                      onClick={() => downloadDoc(spec.id, spec.name)}
                      disabled={!isReady}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download {spec.name} ({docState?.sizeKb ? `${docState.sizeKb} KB` : '...'})
                    </button>
                    <button
                      onClick={() => {
                        setDocStates((prev) => {
                          const next = { ...prev };
                          delete next[spec.id];
                          return next;
                        });
                      }}
                      className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      title="Replace or Remove"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Required Format: JPEG</span>
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                      <Zap className="w-3.5 h-3.5" /> Auto 1-Click Resize
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Portal Instructions & Checklist */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-blue-600" />
          Official Govt Portal Submission Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex gap-2">
            <span className="font-bold text-blue-600">1.</span>
            <span>
              <strong>White/Plain Background:</strong> SSC, UPSC, and Police recruitment boards reject photos with dark or scenic backgrounds.
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-blue-600">2.</span>
            <span>
              <strong>Running Hand Signature:</strong> Never sign in CAPITAL / BLOCK letters. Sign with standard running handwriting.
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold text-blue-600">3.</span>
            <span>
              <strong>No Glasses or Caps:</strong> Spectacles with flash reflection, caps, masks or shaded glasses will lead to immediate rejection.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
