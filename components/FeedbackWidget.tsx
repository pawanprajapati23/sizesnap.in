'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Check, Loader2 } from 'lucide-react';
import { submitFeedback } from '@/lib/firebase';

export default function FeedbackWidget() {
  // Manual feedback state (bottom-right pinned tab)
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const pathname = usePathname();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col items-end select-none">
      {isOpen && (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-5 w-80 mb-2 mr-2 animate-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#414FA8]" />
              <span>Feedback & Suggestions</span>
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-200">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Thank You! 🙏</h4>
              <p className="text-xs text-gray-500 mt-1">Aapka feedback successfully submit ho gaya hai.</p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-3 w-full text-left">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Feedback Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:ring-1 focus:ring-[#414FA8] focus:border-[#414FA8] outline-none"
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
                  className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:ring-1 focus:ring-[#414FA8] focus:border-[#414FA8] outline-none resize-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3572] text-white font-medium text-sm py-2 rounded-md transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-xs"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Feedback'
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* The pinned right button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white font-medium px-3.5 py-1.5 rounded-tl-md shadow-[0_-2px_10px_rgba(0,0,0,0.15)] text-xs transition-colors border border-gray-700 border-b-0 border-r-0"
        aria-label="Feedback"
      >
        <MessageSquare className="w-3.5 h-3.5 text-gray-300" />
        <span className="tracking-wide">Feedback</span>
      </button>
    </div>
  );
}
