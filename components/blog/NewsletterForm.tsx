'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, push, serverTimestamp } from 'firebase/database';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const subscribersRef = ref(db, 'newsletter/subscribers');
      await push(subscribersRef, {
        email,
        subscribedAt: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-white mb-2">🎉 Thank you for subscribing!</h3>
        <p className="text-[#EEF1FB] opacity-90">
          You'll be the first to know about new tools, exam updates, and tech tips.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative" onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address" 
        className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20 bg-white shadow-inner"
        required
        disabled={status === 'loading'}
      />
      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap shadow-lg disabled:opacity-70 flex items-center justify-center min-w-[140px]"
      >
        {status === 'loading' ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          'Subscribe'
        )}
      </button>
      {status === 'error' && (
        <p className="absolute -bottom-6 left-0 text-red-200 text-sm">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
