'use client';

import React, { useState, useEffect } from 'react';

export function ExamCountdownTool() {
  const [examName, setExamName] = useState('Final Exams');
  const [examDate, setExamDate] = useState('');

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    if (!examDate) {
      setDays(0); setHours(0); setMinutes(0); setIsPast(false);
      return;
    }

    const updateCountdown = () => {
      // Create date safely in local time as midnight
      const target = new Date(examDate + 'T00:00:00');
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setIsPast(true);
        setDays(0); setHours(0); setMinutes(0);
      } else {
        setIsPast(false);
        setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((diff / 1000 / 60) % 60));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, [examDate]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-6">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Exam Name</label>
             <input type="text" value={examName} onChange={e => setExamName(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. UPSC Prelims" />
          </div>
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Exam Date</label>
             <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
        </div>

        {examDate ? (
          <div className="text-center pt-2">
            <h2 className="text-xl font-bold text-gray-800 mb-6">{isPast ? 'Exam passed:' : 'Countdown to'} {examName || 'Exam'}</h2>

            <div className="flex items-center justify-center gap-3 sm:gap-6">
               <div className="flex flex-col items-center justify-center bg-indigo-50 border border-[#414FA8] text-[#414FA8] rounded-xl w-20 h-20 sm:w-28 sm:h-28 shadow-sm">
                 <span className="text-3xl sm:text-5xl font-bold font-mono">{days}</span>
                 <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Days</span>
               </div>
               <div className="text-2xl sm:text-4xl font-light text-gray-300">:</div>
               <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 text-gray-700 rounded-xl w-20 h-20 sm:w-28 sm:h-28 shadow-sm">
                 <span className="text-3xl sm:text-5xl font-bold font-mono">{hours}</span>
                 <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Hours</span>
               </div>
               <div className="text-2xl sm:text-4xl font-light text-gray-300">:</div>
               <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 text-gray-700 rounded-xl w-20 h-20 sm:w-28 sm:h-28 shadow-sm">
                 <span className="text-3xl sm:text-5xl font-bold font-mono">{minutes}</span>
                 <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Mins</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 italic">Select an exam date to start the countdown.</div>
        )}
      </div>
    </div>
  );
}
