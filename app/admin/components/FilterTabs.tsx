// app/admin/components/FilterTabs.tsx
'use client';

import React from 'react';

export type TimeRange = '24h' | '7d' | '30d' | '3m';

interface Props {
  active: TimeRange;
  setActive: (range: TimeRange) => void;
}

export default function FilterTabs({ active, setActive }: Props) {
  const tabs: { key: TimeRange; label: string }[] = [
    { key: '24h', label: 'Last 24 h' },
    { key: '7d', label: 'Last 7 d' },
    { key: '30d', label: 'Last 30 d' },
    { key: '3m', label: 'Last 3 mo' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setActive(t.key)}
          className={`px-4 py-2 rounded ${active === t.key ? 'bg-[#414FA8] text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
