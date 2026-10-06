'use client';

import React, { useState, useEffect } from 'react';

// Common reliable IANA timezones
const COMMON_ZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney'
];

export function TimeZoneConverterTool() {
  // Safe initialization avoiding hydration mismatch
  const [sourceZone, setSourceZone] = useState('Asia/Kolkata');
  const [targetZone, setTargetZone] = useState('UTC');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');

  const [converted, setConverted] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!date || !time) return;
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('');
      // Parse local input as if it belongs to sourceZone
      // Note: JavaScript Date doesn't easily parse arbitrary strings into arbitrary timezones securely.
      // So we parse it as local, get the UTC epoch offset, and then format it.
      // Actually, standard Intl.DateTimeFormat can format a given timestamp into a timezone, but going backwards
      // (parsing a string in a specific timezone) requires tricky math.
      // Approach: Treat input as UTC, find offset diff.

      const isoStr = `${date}T${time}:00.000Z`;
      const baseDate = new Date(isoStr);

      // Get offset of baseDate in sourceZone
      const srcStr = new Intl.DateTimeFormat('en-US', { timeZone: sourceZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(baseDate);

      // Get offset of baseDate in UTC
      const utcStr = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(baseDate);

      const srcDateObj = new Date(srcStr);
      const utcDateObj = new Date(utcStr);

      const sourceOffsetMs = srcDateObj.getTime() - utcDateObj.getTime();

      // Real UTC time for the input date/time in sourceZone
      const realUtcTimestamp = baseDate.getTime() - sourceOffsetMs;
      const realUtcDate = new Date(realUtcTimestamp);

      // Format to Target Zone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'long'
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConverted(formatter.format(realUtcDate));
    } catch (e: any) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Error converting timezone.');
    }
  }, [date, time, sourceZone, targetZone]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</label>
             <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</label>
             <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Source Timezone</label>
             <select value={sourceZone} onChange={e => setSourceZone(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
                {COMMON_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
             </select>
          </div>
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Target Timezone</label>
             <select value={targetZone} onChange={e => setTargetZone(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
                {COMMON_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
             </select>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-2">
           <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Converted Time</label>
           {error ? (
              <p className="text-red-500 text-sm">{error}</p>
           ) : (
              <div className="p-4 bg-indigo-50 border border-[#414FA8] rounded text-[#414FA8] font-semibold text-lg sm:text-xl">
                 {converted || '-'}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
