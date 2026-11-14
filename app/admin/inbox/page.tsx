'use client';

import React, { useEffect, useState } from 'react';
import { fetchAllFeedback, deleteFeedback, FeedbackData } from '@/lib/firebase';
import { RefreshCw, Trash2, ArrowUpRight, AlertCircle } from 'lucide-react';

type FeedbackWithId = FeedbackData & { id: string };

const FILTER_TABS = [
  { id: 'all', label: 'All Messages' },
  { id: 'bug', label: 'Bug Reports' },
  { id: 'suggestion', label: 'Suggestions' },
  { id: 'download_feedback', label: 'Download Feedback' },
];

export default function InboxPage() {
  const [messages, setMessages] = useState<FeedbackWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      const data = await fetchAllFeedback();
      setMessages(data);
      setErrorMsg(null);
    } catch {
      setErrorMsg('Failed to load feedback messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setErrorMsg(null);
    try {
      await deleteFeedback(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setConfirmId(null);
    } catch {
      setErrorMsg('Failed to delete feedback item. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = messages.filter((m) => filter === 'all' || m.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            User Feedback Inbox
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review bug reports, feature requests, and tool feedback submitted by visitors
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setErrorMsg(null);
            loadMessages();
          }}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="font-semibold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex p-1 rounded-lg bg-slate-200/70">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            No feedback messages in this category.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
                    <span
                      className={`font-semibold capitalize ${
                        msg.type === 'bug'
                          ? 'text-rose-600'
                          : msg.type === 'suggestion'
                          ? 'text-indigo-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {msg.type.replace('_', ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{new Date(msg.timestamp).toLocaleString('en-IN')}</span>
                    {msg.url && (
                      <>
                        <span aria-hidden="true">·</span>
                        <a
                          href={msg.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline inline-flex items-center gap-0.5 font-medium"
                        >
                          <span>Source Page</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>

                  <div>
                    {confirmId === msg.id ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          disabled={deletingId === msg.id}
                          onClick={() => handleDelete(msg.id)}
                          className="px-2.5 py-1 rounded bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-700 cursor-pointer"
                        >
                          {deletingId === msg.id ? 'Deleting...' : 'Confirm Delete'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="px-2 py-1 rounded border border-slate-200 text-slate-600 text-[11px] hover:bg-slate-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmId(msg.id)}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
