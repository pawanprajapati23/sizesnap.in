'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchArticles } from '@/lib/blog';
import { Article } from '@/data/blog';
import Link from 'next/link';

export default function BlogSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await searchArticles(query);
          setResults(res.slice(0, 5));
          setIsOpen(true);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative flex items-center w-full">
        <div className="absolute left-4 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Search guides, tools, and updates..."
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#414FA8] focus:border-transparent transition-all placeholder-gray-400"
        />
        {isSearching && (
          <div className="absolute right-4 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/blog/${article.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-semibold text-gray-900 mb-1">{article.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{article.excerpt}</div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
