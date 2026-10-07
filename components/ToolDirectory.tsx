'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles } from 'lucide-react';
import { ALL_TOOLS, TOOL_CATEGORIES, type ToolItem } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import AdsterraAd from '@/components/AdsterraAd';

export function ToolDirectory() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tools client-side dynamically
  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return ALL_TOOLS;
    return ALL_TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(query) ||
      tool.categoryTitle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group tools by category for normal browsing view
  const categorizedTools = useMemo(() => {
    return TOOL_CATEGORIES.map((category) => ({
      category,
      tools: ALL_TOOLS.filter((t) => t.categoryId === category.id),
    }));
  }, []);

  const handleClear = () => {
    setSearchQuery('');
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div id="directory" className="space-y-6">
      {/* Header and Search Box */}
      <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
        {/* Main H1 - Single H1 on page */}
        <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#333333] tracking-tight mb-1.5">
          Compress, Resize &amp; Edit Pictures
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-normal">
          Free online tools to compress, resize, convert and edit images and PDF files.
        </p>

        {/* Global Desktop Ad Banner (728x90) */}
        <div className="hidden lg:flex w-full justify-center py-2 mb-4">
          <AdsterraAd dataKey="3bd154ece61c60859c2b8242ae85b927" width={728} height={90} />
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl">
          <label htmlFor="tool-search" className="sr-only">
            Search tools
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4 text-[#414FA8]" />
          </div>
          <input
            id="tool-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white text-xs sm:text-sm border border-[#9AA3C8] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#414FA8] focus:border-[#414FA8] text-gray-800 placeholder-gray-400 transition-all shadow-xs"
            autoComplete="off"
            spellCheck="false"
          />
          {isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 bg-gray-200 hover:bg-gray-300 rounded-full p-0.5" />
            </button>
          )}
        </div>

        {/* Govt Exam Quick Shortcut Bar */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              Govt Exams 2026
            </span>
            <span className="text-xs text-gray-700 font-semibold hidden sm:inline">
              Official Photo &amp; Signature Presets:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Link
              href="/exams/ssc-photo-signature-resizer"
              className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
            >
              SSC (CGL/GD)
            </Link>
            <Link
              href="/exams/upsc-photo-signature-resizer"
              className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
            >
              UPSC (Name &amp; Date)
            </Link>
            <Link
              href="/exams/delhi-police-photo-resizer"
              className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
            >
              Delhi Police
            </Link>
            <Link
              href="/exams/up-police-photo-resizer"
              className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
            >
              UP Police
            </Link>
            <Link
              href="/exams"
              className="px-2.5 py-1 rounded bg-[#414FA8] hover:bg-[#343f88] text-white font-semibold shadow-2xs transition-colors"
            >
              All Exams →
            </Link>
          </div>
        </div>
      </div>

      {/* Search Results View */}
      {isSearching ? (
        <section className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#333333]">
                Search Results
              </h2>
              <span className="text-xs bg-[#EEF1FB] text-[#414FA8] font-semibold px-2 py-0.5 rounded-full">
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-[#414FA8] hover:underline font-medium"
            >
              Clear filter
            </button>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {filteredTools.map((tool) => (
                <ToolButton key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No tools found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                We couldn&apos;t find any tool with that name. Try searching for keywords like &ldquo;resize&rdquo;, &ldquo;compress&rdquo;, &ldquo;crop&rdquo;, or &ldquo;pdf&rdquo;.
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-white bg-[#414FA8] rounded hover:bg-[#343f88] transition-colors"
              >
                Reset search
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Categorized Directory: Sections A to G in exact order */
        <div className="space-y-5">
          {categorizedTools.map(({ category, tools }) => (
            <section
              key={category.id}
              className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs"
              aria-labelledby={`category-heading-${category.id}`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3.5">
                <div className="flex items-center gap-2">
                  {category.id === 'A' && (
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  )}
                  <h2
                    id={`category-heading-${category.id}`}
                    className="text-sm sm:text-base font-bold text-[#333333] tracking-tight"
                  >
                    {category.title}
                  </h2>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {tools.length} Tools
                </span>
              </div>

              {/* Exact 2 columns on mobile, 3 columns on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                {tools.map((tool) => (
                  <ToolButton key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
