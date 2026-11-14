'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles } from 'lucide-react';
import { ALL_TOOLS, TOOL_CATEGORIES, type ToolItem } from '@/data/tools';
import { TOOL_REDIRECT_MAP } from '@/data/tool-redirects';
import { ToolButton } from '@/components/ToolButton';

const CANONICAL_PRODUCTION_TOOLS = ALL_TOOLS.filter(
  (t) => !TOOL_REDIRECT_MAP[t.slug] && t.status !== 'draft' && t.status !== 'deprecated'
);

export function ToolDirectory({
  topTools = [],
  hideHeroHeading = false,
}: {
  topTools?: string[];
  hideHeroHeading?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) {
      queueMicrotask(() => setSearchQuery(q));
    }
  }, []);

  // Filter tools client-side dynamically across name, category, description, keywords, aliases
  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return CANONICAL_PRODUCTION_TOOLS;
    return CANONICAL_PRODUCTION_TOOLS.filter((tool) => {
      if (tool.name.toLowerCase().includes(query)) return true;
      if (tool.categoryTitle.toLowerCase().includes(query)) return true;
      if (tool.shortDescription?.toLowerCase().includes(query)) return true;
      if (tool.keywords?.some((kw) => kw.toLowerCase().includes(query))) return true;
      if (tool.aliases?.some((al) => al.toLowerCase().includes(query))) return true;
      return false;
    });
  }, [searchQuery]);

  // Prioritize core high-intent money tools followed by top trending tools
  const popularTools = useMemo(() => {
    const pinnedSlugs = [
      'compress-pdf-140kb',
      'signature-resizer-10kb-to-20kb',
      'id-card-front-back-merger',
      'postcard-size-photo-maker',
      'compress-pdf',
      'jpg-to-pdf-under-150kb',
      'merge-pdf',
      '14kb-photo-size',
      'passport-photo-maker',
      'image-to-pdf',
      'compress-pdf-200kb',
      'compress-pdf-100kb',
      'pan-card-photo-resizer',
      '20kb-photo-size',
      '50kb-photo-size',
      'compress-image-to-12kb',
      'compress-image-to-13kb',
      '100kb-photo-size',
      'compress-image-to-20kb',
      'compress-image-to-50kb',
      'resize-image-3-5cm-4-5cm',
      'add-name-and-date-on-photo',
      'white-background-passport-photo',
    ];

    const slugSet = new Set<string>();
    const result: ToolItem[] = [];

    // First add pinned high-intent tools
    for (const slug of pinnedSlugs) {
      const tool = CANONICAL_PRODUCTION_TOOLS.find((t) => t.slug === slug);
      if (tool && !slugSet.has(tool.slug)) {
        slugSet.add(tool.slug);
        result.push(tool);
      }
    }

    // Then append any extra topTools from Firebase
    for (const slug of topTools) {
      if (!slugSet.has(slug)) {
        const tool = CANONICAL_PRODUCTION_TOOLS.find((t) => t.slug === slug);
        if (tool) {
          slugSet.add(tool.slug);
          result.push(tool);
        }
      }
    }

    return result.slice(0, 12);
  }, [topTools]);

  // Group tools by category matching TOOL_CATEGORIES ids
  const categorizedTools = useMemo(() => {
    const curatedCategoryIds = [
      'image',
      'pdf',
      'exam-tools',
      'student-tools',
      'ecommerce',
      'calculator',
      'developer',
      'seo',
      'writing',
      'text',
    ];
    return TOOL_CATEGORIES.filter((c) => curatedCategoryIds.includes(c.id))
      .map((category) => {
        const matchingTools = CANONICAL_PRODUCTION_TOOLS.filter((t) => {
          if (category.id === 'exam-tools') return t.categoryId === 'exam-tools' || t.categoryId === 'exam';
          if (category.id === 'student-tools') return t.categoryId === 'student-tools' || t.categoryId === 'student';
          return t.categoryId === category.id;
        }).sort((a, b) => {
          const scoreA = (a.popular ? 2 : 0) + (a.seoPriority === 'High' ? 1 : 0);
          const scoreB = (b.popular ? 2 : 0) + (b.seoPriority === 'High' ? 1 : 0);
          return scoreB - scoreA;
        });

        return {
          category,
          totalCount: matchingTools.length,
          // Take at most 6 curated canonical tools per category to keep the homepage fast & scannable
          tools: matchingTools.slice(0, 6),
        };
      })
      .filter((group) => group.tools.length > 0);
  }, []);

  const handleClear = () => {
    setSearchQuery('');
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div id="directory" className="space-y-6">
      {/* Header and Search Box */}
      <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
        {!hideHeroHeading ? (
          <>
            {/* Main H1 - Single H1 on homepage */}
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#333333] tracking-tight mb-1.5">
              Free Online Image Compressor, Exact KB Photo Resizer &amp; PDF Tools
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-normal">
              Compress photos to 10KB, 20KB, 50KB or 140KB PDFs, resize passport &amp; govt exam documents, and convert files 100% locally in your browser.
            </p>
          </>
        ) : (
          <h2 className="text-base sm:text-lg font-bold text-[#333333] tracking-tight mb-3">
            Search &amp; Filter All Tools
          </h2>
        )}

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

        {/* Fast-Track SEO & Navigation Bars */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2.5">
          {/* Row 1: Govt Exam Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Govt Exams 2026
              </span>
              <span className="text-xs text-gray-700 font-semibold hidden sm:inline">
                Live Recruitment Forms:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <Link
                href="/exams/ssc-photo-signature-resizer"
                className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
              >
                SSC (GD / CGL)
              </Link>
              <Link
                href="/exams/rrb-railway-photo-signature-resizer"
                className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
              >
                Railway RRB (30-70KB)
              </Link>
              <Link
                href="/exams/upsc-photo-signature-resizer"
                className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
              >
                UPSC (OTR / CSE)
              </Link>
              <Link
                href="/exams/up-police-photo-resizer"
                className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
              >
                UP Police (20-50KB)
              </Link>
              <Link
                href="/exams/neet-jee-photo-signature-resizer"
                className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
              >
                NEET &amp; JEE
              </Link>
              <Link
                href="/tools/photo-and-signature-joiner"
                className="px-2.5 py-1 rounded bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] font-medium border border-[#9AA3C8]/40 transition-colors"
              >
                Photo &amp; Signature Joiner
              </Link>
              <Link
                href="/exams"
                className="px-2.5 py-1 rounded bg-[#414FA8] hover:bg-[#343f88] text-white font-semibold shadow-2xs transition-colors"
              >
                All Exams →
              </Link>
            </div>
          </div>

          {/* Row 2: Exact KB & Dimensions Quick Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                ⚡ Exact KB
              </span>
              <span className="text-xs text-gray-700 font-semibold hidden sm:inline">
                Target Size &amp; Crop:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <Link
                href="/tools/compress-pdf-140kb"
                className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 transition-colors"
              >
                140 KB PDF
              </Link>
              <Link
                href="/tools/jpg-to-pdf-under-150kb"
                className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 transition-colors"
              >
                150 KB PDF
              </Link>
              <Link
                href="/tools/14kb-photo-size"
                className="px-2.5 py-1 rounded bg-indigo-50/80 hover:bg-indigo-100 text-[#414FA8] font-bold border border-[#414FA8]/30 transition-colors"
              >
                14 KB Signature
              </Link>
              <Link
                href="/tools/compress-image-to-12kb"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                12 KB Photo
              </Link>
              <Link
                href="/tools/compress-image-to-13kb"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                13 KB Photo
              </Link>
              <Link
                href="/tools/20kb-photo-size"
                className="px-2.5 py-1 rounded bg-indigo-50/70 hover:bg-indigo-100/80 text-[#414FA8] font-bold border border-[#414FA8]/30 transition-colors"
              >
                20 KB Photo
              </Link>
              <Link
                href="/tools/50kb-photo-size"
                className="px-2.5 py-1 rounded bg-indigo-50/70 hover:bg-indigo-100/80 text-[#414FA8] font-bold border border-[#414FA8]/30 transition-colors"
              >
                50 KB Photo
              </Link>
              <Link
                href="/tools/100kb-photo-size"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                100 KB Photo
              </Link>
              <Link
                href="/tools/pan-card-photo-resizer"
                className="px-2.5 py-1 rounded bg-indigo-50/70 hover:bg-indigo-100/80 text-[#414FA8] font-bold border border-[#414FA8]/30 transition-colors"
              >
                PAN Card (213×213)
              </Link>
              <Link
                href="/tools/200-dpi-converter"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                200 DPI Scan
              </Link>
              <Link
                href="/tools/resize-image-3-5cm-4-5cm"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                3.5 × 4.5 cm
              </Link>
              <Link
                href="/tools/add-name-and-date-on-photo"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                Name &amp; Date (DOP)
              </Link>
              <Link
                href="/tools/white-background-passport-photo"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                White BG Photo
              </Link>
              <Link
                href="/tools/compress-pdf-100kb"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                100 KB PDF
              </Link>
              <Link
                href="/tools/compress-pdf-200kb"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                200 KB PDF
              </Link>
              <Link
                href="/tools/110kb-photo-size"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                110 KB Photo
              </Link>
              <Link
                href="/tools/60kb-photo-size"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                60 KB Photo
              </Link>
              <Link
                href="/tools/remove-shadow-from-document"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                Remove Shadow
              </Link>
              <Link
                href="/tools/reduce-image-size-in-kb"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                Reduce in KB
              </Link>
              <Link
                href="/tools/jpg-to-pdf-under-200kb"
                className="px-2.5 py-1 rounded bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-medium border border-gray-200 hover:border-emerald-300 transition-colors"
              >
                PDF Under 200KB
              </Link>
            </div>
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
          {/* ⭐ Popular Tools / Featured Tools Section */}
          <section
            className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs"
            aria-labelledby="category-heading-popular"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <h2
                  id="category-heading-popular"
                  className="text-sm sm:text-base font-bold text-[#333333] tracking-tight"
                >
                  {topTools.length > 0 ? '⭐ Popular Tools' : 'Featured Tools'}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {popularTools.map((tool) => (
                <ToolButton key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {categorizedTools.map(({ category, tools }) => {
            const categoryHref = category.id.endsWith('-tools') ? `/${category.id}` : `/${category.id}-tools`;
            return (
              <section
                key={category.id}
                className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs"
                aria-labelledby={`category-heading-${category.id}`}
                style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}
              >
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3.5">
                <div className="flex items-center gap-2">
                  {category.id === 'image' && (
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
              <div className="mt-3 text-right">
                <Link href={categoryHref} className="text-xs font-semibold text-[#414FA8] hover:underline">
                  View All {category.title} →
                </Link>
              </div>
            </section>
          );
        })}
        </div>
      )}
    </div>
  );
}
