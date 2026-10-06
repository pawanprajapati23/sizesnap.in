'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm mt-6">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold mb-1">Disclaimer</p>
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
