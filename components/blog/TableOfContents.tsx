'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ htmlContent, isMobile = false }: { htmlContent: string; isMobile?: boolean }) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headingElements = Array.from(doc.querySelectorAll('h2, h3'));

    const items: TOCItem[] = [];
    headingElements.forEach((el, index) => {
      const text = el.textContent || '';
      const id = el.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `heading-${index}`;

      items.push({
        id,
        text,
        level: parseInt(el.tagName.substring(1), 10),
      });
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(items);
  }, [htmlContent]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (isMobile) setIsOpen(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${isMobile ? 'mb-8' : ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 font-bold text-gray-900 bg-gray-50/50 hover:bg-gray-50 transition-colors"
      >
        <span>Table of Contents</span>
        {isMobile && (
          isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 pt-2 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-3 relative">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-100 z-0"></div>
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={`relative z-10 text-sm transition-colors ${
                  heading.level === 3 ? 'ml-4' : ''
                }`}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleScroll(e, heading.id)}
                  className={`flex items-center gap-3 py-1 ${
                    activeId === heading.id
                      ? 'text-[#414FA8] font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    activeId === heading.id ? 'bg-[#414FA8] ring-4 ring-[#EEF1FB]' : 'bg-gray-300'
                  }`} style={{ marginLeft: heading.level === 2 ? '0.1875rem' : '0' }}></div>
                  <span className="line-clamp-2">{heading.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
