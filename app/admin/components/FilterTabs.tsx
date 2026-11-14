'use client';

import React from 'react';

export type TimeRange = '24h' | '7d' | '30d' | '3m';

interface Props {
  active: TimeRange;
  setActive: (range: TimeRange) => void;
}

export default function FilterTabs({ active, setActive }: Props) {
  const tabs: { key: TimeRange; label: string }[] = [
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '90 Days' },
  ];

  return (
    <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => setActive(t.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
            active === t.key
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
