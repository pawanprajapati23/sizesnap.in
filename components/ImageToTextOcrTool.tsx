'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Upload, Copy, Check, FileText, Settings2, RefreshCw } from 'lucide-react';
import Tesseract from 'tesseract.js';

function OcrToolContent() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [language, setLanguage] = useState('eng');
  const [isCopied, setIsCopied] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setText('');
    setProgress(0);
    setStatusText('');
  };

  const handleExtract = async () => {
    if (!imageSrc) return;
    
    setIsProcessing(true);
    setText('');
    setProgress(0);
    setStatusText('Initializing OCR Engine...');

    try {
      const result = await Tesseract.recognize(
        imageSrc,
        language,
        {
          logger: m => {
            if (m.status === 'recognizing text') {
                setProgress(Math.round(m.progress * 100));
                setStatusText('Extracting Text...');
            } else {
                setStatusText(m.status);
            }
          }
        }
      );
      
      setText(result.data.text);
      setStatusText('Extraction Complete!');
    } catch (error) {
      console.error(error);
      setStatusText('Failed to extract text. Please try a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!imageSrc) {
    return (
      <div className="border-2 border-dashed border-[#9AA3C8] rounded-md p-10 text-center bg-[#FAFAFC] hover:bg-white transition-colors">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center mb-4 shadow-xs">
            <Upload className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Upload Image to Extract Text</h2>
          <p className="text-xs text-gray-500 mb-5">
            Works best with clear, high-contrast images like screenshots, documents, and book pages.
          </p>
          <label className="cursor-pointer px-5 py-2.5 bg-[#414FA8] text-white text-sm font-semibold rounded shadow-sm hover:bg-[#343f88] transition-all">
            <span>Choose Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Image Preview & Settings */}
      <div className="space-y-4">
        <div className="bg-gray-100 border border-gray-200 rounded p-2 flex items-center justify-center h-[350px] overflow-hidden relative">
            <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain shadow-sm" />
        </div>

        <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 mb-3">
                <Settings2 className="w-4 h-4" /> OCR Settings
            </h3>
            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Language</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={isProcessing}
                        className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border-[#414FA8] disabled:opacity-50"
                    >
                        <option value="eng">English</option>
                        <option value="hin">Hindi</option>
                        <option value="spa">Spanish</option>
                        <option value="fra">French</option>
                        <option value="deu">German</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleExtract}
                disabled={isProcessing}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-sm font-semibold py-2.5 rounded shadow-sm transition-all disabled:opacity-50"
            >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {isProcessing ? 'Processing...' : 'Extract Text Now'}
            </button>
            
            <button onClick={() => setImageSrc(null)} disabled={isProcessing} className="w-full mt-2 text-xs text-red-600 hover:underline disabled:opacity-50 text-center py-2">
                Upload Different Image
            </button>
        </div>
      </div>

      {/* Right: Extracted Text */}
      <div className="bg-white border border-gray-200 rounded flex flex-col shadow-xs">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Extracted Result
            </h3>
            {text && (
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Copied!' : 'Copy Text'}
                </button>
            )}
        </div>
        <div className="flex-1 p-4 relative min-h-[300px]">
            {isProcessing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 px-6">
                    <RefreshCw className="w-8 h-8 text-[#414FA8] animate-spin mb-4" />
                    <p className="text-sm font-medium text-gray-800">{statusText}</p>
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div className="bg-[#414FA8] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            ) : text ? (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-full min-h-[300px] p-2 text-sm text-gray-800 outline-none resize-none bg-transparent"
                    placeholder="Extracted text will appear here..."
                />
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    {statusText || "Click 'Extract Text Now' to begin."}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export function ImageToTextOcrTool() {
    return (
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
            <OcrToolContent />
        </Suspense>
    );
}
