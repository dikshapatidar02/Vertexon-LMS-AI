import React, { useState } from 'react';
import { Flag, Trash2, CheckCircle2 } from 'lucide-react';

interface FlaggedPost {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
  reason: string;
}

const INITIAL_FLAGGED: FlaggedPost[] = [
  {
    id: 'dp-flag-1',
    user_name: 'SpamUser123',
    content: 'Buy cheap assignment solutions and exam answers at http://spam-essays.example!',
    created_at: '2026-09-24 11:20',
    reason: 'Unsolicited Commercial Spam / Academic Honesty Violation',
  },
  {
    id: 'dp-flag-2',
    user_name: 'AnonymousLearner',
    content: 'Duplicate post inquiring about Module 1 submission deadline.',
    created_at: '2026-09-25 09:15',
    reason: 'Duplicate Forum Thread',
  },
];

export const ContentModeration: React.FC = () => {
  const [posts, setPosts] = useState<FlaggedPost[]>(INITIAL_FLAGGED);

  const handleModerate = (postId: string, action: 'delete' | 'dismiss') => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="pb-2 border-b border-slate-200 dark:border-dark-800">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Flag className="w-5 h-5 text-amber-500" /> Forum Content Moderation
        </h1>
        <p className="text-xs text-slate-500">Audit community-reported content, spam links, and discussion violations.</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">No Flagged Posts</h3>
          <p className="text-xs text-slate-500">All reported community content has been audited.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  Reported User: <span className="font-mono text-brand-600">{p.user_name}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{p.created_at}</span>
              </div>

              <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                Reason: {p.reason}
              </div>

              <div className="p-3 bg-red-50/60 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/40 text-xs text-red-900 dark:text-red-200 font-mono">
                {p.content}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleModerate(p.id, 'dismiss')}
                  className="btn-secondary h-8 px-3 text-xs"
                >
                  Dismiss Flag
                </button>
                <button
                  onClick={() => handleModerate(p.id, 'delete')}
                  className="btn-danger h-8 px-3 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
