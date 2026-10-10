'use client';

import React from 'react';
import { Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';

export default function ShareButtons({ url, title, horizontal = false }: { url: string, title: string, horizontal?: boolean }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    // Could add a toast here
  };

  const containerClasses = horizontal
    ? "flex items-center gap-4"
    : "flex flex-col gap-4";

  return (
    <div className={containerClasses}>
      {!horizontal && <span className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Share</span>}

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-all border border-gray-200 hover:border-transparent shadow-sm"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-all border border-gray-200 hover:border-transparent shadow-sm"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all border border-gray-200 hover:border-transparent shadow-sm"
      >
        <Facebook className="w-4 h-4" />
      </a>

      <button
        onClick={handleCopy}
        aria-label="Copy Link"
        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all border border-gray-200 shadow-sm"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
