'use client';

import React, { useState, useRef } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import {
  Upload,
  Download,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
  Settings,
  Scissors,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { formatBytes } from '@/lib/format-utils';

interface Props {
  isMeesho?: boolean;
}

export function ShippingLabelToA4Tool({ isMeesho = false }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string>('');

  const [labelsPerPage, setLabelsPerPage] = useState<number>(4);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margins, setMargins] = useState<'small' | 'normal' | 'none'>('normal');
  const [showCutGuides, setShowCutGuides] = useState<boolean>(true);

  const [totalLabels, setTotalLabels] = useState<number>(0);
  const [totalPagesGenerated, setTotalPagesGenerated] = useState<number>(0);
  const [resultPdfUrl, setResultPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setFile(uploadedFile);
    setError(null);
    setResultPdfUrl(null);

    // Quick parse to count labels
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setTotalLabels(pdfDoc.getPageCount());
    } catch (err: any) {
      console.error(err);
      setError('Could not read PDF. It might be corrupted or password-protected.');
      setFile(null);
    }
  };

  const processPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgressText('Loading PDF...');

    try {
      const sourceBuffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(sourceBuffer);
      const totalPages = sourceDoc.getPageCount();

      const targetDoc = await PDFDocument.create();

      const a4Width = orientation === 'portrait' ? PageSizes.A4[0] : PageSizes.A4[1];
      const a4Height = orientation === 'portrait' ? PageSizes.A4[1] : PageSizes.A4[0];

      const marginPt = margins === 'small' ? 10 : margins === 'normal' ? 25 : 0;
      const gap = 15;

      let cols = 1, rows = 1;
      if (labelsPerPage === 2) { cols = 1; rows = 2; }
      if (labelsPerPage === 4) { cols = 2; rows = 2; }
      if (labelsPerPage === 6) { cols = 2; rows = 3; }
      if (labelsPerPage === 8) { cols = 2; rows = 4; }

      // Adjust for landscape to better fit rectangles
      if (orientation === 'landscape') {
        if (labelsPerPage === 2) { cols = 2; rows = 1; }
        if (labelsPerPage === 6) { cols = 3; rows = 2; }
        if (labelsPerPage === 8) { cols = 4; rows = 2; }
      }

      const availWidth = a4Width - (2 * marginPt) - (gap * (cols - 1));
      const availHeight = a4Height - (2 * marginPt) - (gap * (rows - 1));

      const cellWidth = availWidth / cols;
      const cellHeight = availHeight / rows;

      let currentTargetPage = targetDoc.addPage([a4Width, a4Height]);
      let labelsOnCurrentPage = 0;
      let pagesCount = 1;

      // Draw cut guides function
      const drawCutGuides = (page: any, x: number, y: number, w: number, h: number) => {
         if (!showCutGuides) return;
         const guideLength = 10;
         const { rgb } = require('pdf-lib');
         const color = rgb(0.8, 0.8, 0.8);

         // Top left
         page.drawLine({ start: { x, y: y + h }, end: { x: x + guideLength, y: y + h }, thickness: 1, color });
         page.drawLine({ start: { x, y: y + h }, end: { x, y: y + h - guideLength }, thickness: 1, color });
         // Top right
         page.drawLine({ start: { x: x + w, y: y + h }, end: { x: x + w - guideLength, y: y + h }, thickness: 1, color });
         page.drawLine({ start: { x: x + w, y: y + h }, end: { x: x + w, y: y + h - guideLength }, thickness: 1, color });
         // Bottom left
         page.drawLine({ start: { x: x, y: y }, end: { x: x + guideLength, y: y }, thickness: 1, color });
         page.drawLine({ start: { x: x, y: y }, end: { x: x, y: y + guideLength }, thickness: 1, color });
         // Bottom right
         page.drawLine({ start: { x: x + w, y: y }, end: { x: x + w - guideLength, y: y }, thickness: 1, color });
         page.drawLine({ start: { x: x + w, y: y }, end: { x: x + w, y: y + guideLength }, thickness: 1, color });
      };

      for (let i = 0; i < totalPages; i++) {
        setProgressText(`Processing label ${i + 1} of ${totalPages}...`);

        if (labelsOnCurrentPage >= labelsPerPage) {
          currentTargetPage = targetDoc.addPage([a4Width, a4Height]);
          labelsOnCurrentPage = 0;
          pagesCount++;
        }

        const [embeddedPage] = await targetDoc.embedPdf(sourceBuffer, [i]);
        const { width: origW, height: origH } = embeddedPage.size();

        const scale = Math.min(cellWidth / origW, cellHeight / origH);
        const finalW = origW * scale;
        const finalH = origH * scale;

        const col = labelsOnCurrentPage % cols;
        const row = Math.floor(labelsOnCurrentPage / cols);

        const x = marginPt + col * (cellWidth + gap) + (cellWidth - finalW) / 2;
        const yTop = marginPt + row * (cellHeight + gap);
        // y is from bottom in pdf-lib
        const y = a4Height - yTop - cellHeight + (cellHeight - finalH) / 2;

        currentTargetPage.drawPage(embeddedPage, {
          x, y, width: finalW, height: finalH,
        });

        drawCutGuides(currentTargetPage, x, y, finalW, finalH);

        labelsOnCurrentPage++;
      }

      setProgressText('Finalizing PDF...');
      setTotalPagesGenerated(pagesCount);
      const resultBytes = await targetDoc.save();

      const blob = new Blob([new Uint8Array(resultBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResultPdfUrl(url);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while processing the PDF.');
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const reset = () => {
    setFile(null);
    setResultPdfUrl(null);
    setError(null);
    setTotalLabels(0);
    setTotalPagesGenerated(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#414FA8]" />
                {isMeesho ? 'Meesho Shipping Label to A4' : 'Shipping Label to A4'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isMeesho
                  ? 'Format your Meesho shipping labels (1 per page) into a print-ready A4 sheet.'
                  : 'Arrange individual shipping labels onto fewer A4 pages for easy printing.'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!file && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 hover:border-[#414FA8] transition-colors cursor-pointer bg-gray-50/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={handleFileUpload}
              />
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#414FA8]">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Shipping Label PDF</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Select a PDF containing multiple individual labels. Processed locally in your browser.
              </p>
              <button className="px-6 py-2.5 bg-[#414FA8] text-white font-medium rounded-lg hover:bg-[#344190] transition-colors">
                Select PDF File
              </button>
            </div>
          )}

          {file && !resultPdfUrl && (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 truncate">
                  <FileText className="h-6 w-6 text-[#414FA8]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatBytes(file.size)} • {totalLabels} {totalLabels === 1 ? 'label' : 'labels'} detected
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                  disabled={isProcessing}
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Layout Settings
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Labels Per Page (A4)</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 4, 6, 8].map(num => (
                        <button
                          key={num}
                          onClick={() => setLabelsPerPage(num)}
                          className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                            labelsPerPage === num
                              ? 'bg-[#414FA8] text-white border-[#414FA8]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Orientation</label>
                      <select
                        value={orientation}
                        onChange={(e) => setOrientation(e.target.value as any)}
                        className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#414FA8] focus:border-[#414FA8]"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Margins</label>
                      <select
                        value={margins}
                        onChange={(e) => setMargins(e.target.value as any)}
                        className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#414FA8] focus:border-[#414FA8]"
                      >
                        <option value="small">Small</option>
                        <option value="normal">Normal</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={showCutGuides}
                      onChange={(e) => setShowCutGuides(e.target.checked)}
                      className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-1.5">
                      <Scissors className="h-3.5 w-3.5" /> Show cut guides
                    </span>
                  </label>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col justify-center items-center text-center space-y-3">
                   <p className="text-sm text-gray-600 font-medium">Estimated Output</p>
                   <div className="text-3xl font-bold text-[#333333]">
                     {Math.ceil(totalLabels / labelsPerPage)}
                   </div>
                   <p className="text-xs text-gray-500">A4 Pages</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={processPdf}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-8 py-3 bg-[#414FA8] text-white font-medium rounded-xl hover:bg-[#344190] transition-colors focus:ring-4 focus:ring-[#414FA8]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {progressText || 'Processing...'}
                    </>
                  ) : (
                    <>Generate A4 PDF</>
                  )}
                </button>
              </div>
            </div>
          )}

          {resultPdfUrl && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">PDF Generated Successfully!</h3>
                <p className="text-sm text-gray-600 mb-6">
                  {totalLabels} labels arranged into {totalPagesGenerated} A4 pages.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                  <a
                    href={resultPdfUrl}
                    download={`shipping_labels_a4_${labelsPerPage}up.pdf`}
                    className="w-full sm:w-auto px-6 py-3 bg-[#414FA8] text-white font-medium rounded-xl hover:bg-[#344190] transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download PDF
                  </a>
                  <button
                    onClick={reset}
                    className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Start Again
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important Print Instructions:</p>
                  <p>When printing the downloaded PDF, make sure to select <strong>&quot;Actual Size&quot;</strong> or <strong>&quot;Scale: 100%&quot;</strong> in your printer settings. Avoid using &quot;Fit to Page&quot; as it might distort the label sizes and affect barcode scanning.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        All processing happens locally in your browser. No files are uploaded to our servers.
      </div>
    </div>
  );
}
