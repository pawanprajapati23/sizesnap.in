'use client';

import React, { useState, useEffect } from 'react';
import { Settings2, RefreshCw } from 'lucide-react';

export function UnixTimestampConverterTool() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const updateCurrentTime = () => {
    const now = Date.now();
    setTimestamp(timeUnit === 'ms' ? now.toString() : Math.floor(now / 1000).toString());
  };
  const [timeUnit, setTimeUnit] = useState<'sec' | 'ms'>('sec');


  let localTime = '';
  let utcTime = '';
  let relativeTime = '';



  if (timestamp && !isNaN(Number(timestamp))) {
    const ts = Number(timestamp);
    const date = new Date(timeUnit === 'ms' ? ts : ts * 1000);

    if (date.toString() === 'Invalid Date') {
      localTime = 'Invalid Date';
      utcTime = 'Invalid Date';
    } else {
      localTime = date.toLocaleString();
      utcTime = date.toUTCString();

      // Using the fixed state 'timestamp' to derive diffs ensures purity.
      const currentTs = timeUnit === 'ms' ? Number(timestamp) : Number(timestamp) * 1000;
      const diffMs = date.getTime() - currentTs;
      const isPast = diffMs < 0;
      const diffSecs = Math.abs(Math.floor(diffMs / 1000));

      if (diffSecs < 60) relativeTime = `${diffSecs} seconds ${isPast ? 'ago' : 'from now'}`;
      else if (diffSecs < 3600) relativeTime = `${Math.floor(diffSecs / 60)} minutes ${isPast ? 'ago' : 'from now'}`;
      else if (diffSecs < 86400) relativeTime = `${Math.floor(diffSecs / 3600)} hours ${isPast ? 'ago' : 'from now'}`;
      else relativeTime = `${Math.floor(diffSecs / 86400)} days ${isPast ? 'ago' : 'from now'}`;
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm max-w-2xl">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">Unix Timestamp</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded px-4 py-2 font-mono focus:outline-none focus:border-[#414FA8]"
            placeholder="Enter timestamp..."
          />
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
          >
            <option value="sec">Seconds (s)</option>
            <option value="ms">Milliseconds (ms)</option>
          </select>
          <button
            onClick={updateCurrentTime}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#414FA8] text-white rounded hover:bg-[#343f88] transition-colors text-sm font-medium whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" /> Current
          </button>
        </div>

        <div className="mt-8 space-y-4">
           <div className="grid grid-cols-[100px_1fr] gap-4 items-center border-b border-gray-100 pb-3">
             <span className="text-sm font-semibold text-gray-500">Local Time</span>
             <span className="font-mono text-gray-900 bg-gray-50 px-3 py-1.5 rounded">{localTime || '-'}</span>
           </div>
           <div className="grid grid-cols-[100px_1fr] gap-4 items-center border-b border-gray-100 pb-3">
             <span className="text-sm font-semibold text-gray-500">UTC Time</span>
             <span className="font-mono text-gray-900 bg-gray-50 px-3 py-1.5 rounded">{utcTime || '-'}</span>
           </div>
           <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
             <span className="text-sm font-semibold text-gray-500">Relative</span>
             <span className="font-mono text-[#414FA8] font-medium px-3 py-1.5">{relativeTime || '-'}</span>
           </div>
        </div>
      </div>
    </div>
  );
}
