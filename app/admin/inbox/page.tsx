'use client';
import { useEffect, useState } from 'react';
import { fetchAllFeedback, FeedbackData } from '@/lib/firebase';

type FeedbackWithId = FeedbackData & { id: string };

export default function InboxPage() {
  const [messages, setMessages] = useState<FeedbackWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAllFeedback();
      setMessages(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredMessages = messages.filter(m => filter === 'all' || m.type === filter);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800 border-red-200';
      case 'suggestion': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📥 User Inbox</h1>
          <p className="text-sm text-gray-500 mt-1">Manage bug reports and feature suggestions from users.</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-[#414FA8] focus:border-[#414FA8]"
        >
          <option value="all">All Messages</option>
          <option value="suggestion">Suggestions</option>
          <option value="bug">Bug Reports</option>
          <option value="other">Other Feedback</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-[#414FA8] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="font-medium text-gray-900">No messages found</p>
            <p className="text-sm mt-1">When users submit feedback, it will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getBadgeColor(msg.type)}`}>
                      {msg.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <a 
                    href={msg.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-[#414FA8] hover:underline flex items-center gap-1"
                  >
                    View Source Page
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.message}</p>
                <div className="mt-3 text-xs text-gray-400 font-mono truncate">
                  URL: {msg.url}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
