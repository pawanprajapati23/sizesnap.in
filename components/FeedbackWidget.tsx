'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { submitFeedback } from '@/lib/firebase';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const pathname = usePathname();

  // Hide widget entirely if user is in admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('submitting');
    
    // Optimistic UI: Fire the database request in the background
    submitFeedback({
      type,
      message,
      url: window.location.href,
    }).catch(err => {
      console.error(err);
      // We ignore error for the user to keep the UX fast, but log it.
    });
    
    // Show spinner for just 400ms to give a "fast action" feel, then show success
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
    <div className="fixed bottom-0 right-4 z-50 flex flex-col items-end">
      {/* Modal */}
      {isOpen && (
        <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-5 w-80 mb-0 animate-in slide-in-from-bottom-5 translate-y-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Feedback & Suggestions</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-medium text-gray-900">Thank you!</p>
              <p className="text-xs text-gray-500 mt-1">Your feedback has been sent to the admin.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 w-full text-left">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Feedback Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:ring-[#414FA8] focus:border-[#414FA8]"
                >
                  <option value="suggestion">Suggest a Tool</option>
                  <option value="bug">Report a Bug</option>
                  <option value="other">Other Feedback</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  required
                  className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:ring-[#414FA8] focus:border-[#414FA8] resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
              )}

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-[#414FA8] hover:bg-[#323d8c] text-white font-medium text-sm py-2 rounded-md transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Feedback'
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating Tab attached to bottom */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white font-medium px-4 py-1.5 rounded-t-md shadow-[0_-2px_10px_rgba(0,0,0,0.1)] text-xs transition-colors border border-gray-700 border-b-0 w-32"
      >
        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="tracking-wide">Feedback</span>
      </button>
    </div>
  );
}
