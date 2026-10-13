'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { submitFeedback } from '@/lib/firebase';

export default function FeedbackWidget() {
  // Manual feedback state (bottom-left pinned tab)
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Automatic post-download feedback popup state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFeedbackMsg, setDownloadFeedbackMsg] = useState('');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const pathname = usePathname();
  const lastTriggerRef = useRef(0);

  // Global listener for detecting file downloads across all tools
  useEffect(() => {
    // Intercept programmatic HTMLAnchorElement.prototype.click (used by all Canvas/Blob downloads)
    const originalClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.hasAttribute('download') || this.download) {
        triggerDownloadFeedback();
      }
      return originalClick.apply(this);
    };

    // Global click listener for download buttons/links
    const handleGlobalClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target !== document.body) {
        const hasDownloadAttr = target.hasAttribute('download');
        const text = target.innerText?.toLowerCase() || '';
        const isDownloadButton =
          target.tagName === 'BUTTON' &&
          (text.includes('download') || text.includes('save') || text.includes('export'));
        const isDownloadLink =
          target.tagName === 'A' &&
          (hasDownloadAttr || text.includes('download') || text.includes('save'));

        if (hasDownloadAttr || isDownloadButton || isDownloadLink) {
          triggerDownloadFeedback();
          break;
        }
        target = target.parentElement;
      }
    };

    function triggerDownloadFeedback() {
      const now = Date.now();
      // Debounce: don't trigger more than once every 10 seconds
      if (now - lastTriggerRef.current < 10000) return;
      lastTriggerRef.current = now;

      // Small delay (700ms) ensures browser download has initiated first
      setTimeout(() => {
        setShowDownloadModal(true);
      }, 700);
    }

    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      HTMLAnchorElement.prototype.click = originalClick;
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDownloadModal) setShowDownloadModal(false);
        if (isOpen) setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDownloadModal, isOpen]);

  // Hide widget entirely if user is in admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Handle manual feedback form submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('submitting');
    submitFeedback({
      type,
      message,
      url: window.location.href,
    }).catch(err => {
      console.error(err);
    });

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setMessage('');
        setStatus('idle');
      }, 2000);
    }, 400);
  };

  // Handle post-download feedback submit
  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadFeedbackMsg.trim()) return;

    setDownloadStatus('submitting');
    submitFeedback({
      type: 'download_feedback',
      message: downloadFeedbackMsg,
      url: window.location.href,
    }).catch(err => {
      console.error(err);
    });

    setTimeout(() => {
      setDownloadStatus('success');
      setTimeout(() => {
        setShowDownloadModal(false);
        setDownloadFeedbackMsg('');
        setDownloadStatus('idle');
      }, 2200);
    }, 400);
  };

  return (
    <>
      {/* 1. MANUAL FEEDBACK TAB (PINNED COMPLETELY TO BOTTOM-LEFT) */}
      <div className="fixed bottom-0 left-0 z-50 flex flex-col items-start select-none">
        {isOpen && (
          <div className="bg-white border border-gray-200 shadow-2xl rounded-tr-xl rounded-tl-xl sm:rounded-xl p-5 w-80 sm:w-88 ml-2 sm:ml-3 mb-1 animate-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <span>💬</span>
                <span>Feedback & Suggestions</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {status === 'success' ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-900">Thank You! 🙏</p>
                <p className="text-xs text-gray-500 mt-1">Aapka feedback admin tak pahunch gaya hai.</p>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="space-y-3 w-full text-left">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Feedback Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:ring-[#414FA8] focus:border-[#414FA8] outline-none"
                  >
                    <option value="suggestion">Suggest a Tool</option>
                    <option value="bug">Report a Bug / Error</option>
                    <option value="other">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Apna suggestion ya problem yahan likhein..."
                    rows={3}
                    required
                    className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:ring-[#414FA8] focus:border-[#414FA8] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-[#414FA8] hover:bg-[#323d8c] text-white font-semibold text-sm py-2 rounded-md transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Feedback'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* The pinned left button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white font-medium px-3.5 py-1.5 rounded-tr-md shadow-[0_-2px_10px_rgba(0,0,0,0.2)] text-xs transition-colors border border-gray-700 border-b-0 border-l-0"
          aria-label="Feedback"
        >
          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="tracking-wide">Feedback</span>
        </button>
      </div>

      {/* 2. AUTOMATIC POST-DOWNLOAD FEEDBACK MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {downloadStatus === 'success' ? (
              <div className="text-center py-6 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Thank You! 🙏</h3>
                <p className="text-sm text-gray-600">
                  Aapka feedback successfully submit ho gaya hai. We appreciate your help!
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#414FA8] border border-[#414FA8]/20">
                    💡 Quick Feedback
                  </span>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Download started!
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2">
                  Iss website me aapko use karte time koi problem aa rahi ho to please bataye:
                </h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Jaise photo blur ho gayi, file size portal ke according nahi bana, ya koi new feature chahiye?
                </p>

                <form onSubmit={handleDownloadSubmit} className="space-y-3">
                  <textarea
                    value={downloadFeedbackMsg}
                    onChange={(e) => setDownloadFeedbackMsg(e.target.value)}
                    placeholder="Apni problem ya suggestion yahan likhein..."
                    rows={3}
                    required
                    autoFocus
                    className="w-full text-sm border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#414FA8] focus:border-[#414FA8] outline-none resize-none placeholder:text-gray-400"
                  />

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowDownloadModal(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-2"
                    >
                      Abhi nahi (Skip)
                    </button>

                    <button
                      type="submit"
                      disabled={downloadStatus === 'submitting' || !downloadFeedbackMsg.trim()}
                      className="px-5 py-2 bg-[#414FA8] hover:bg-[#323d8c] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-[#414FA8]/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      {downloadStatus === 'submitting' ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
