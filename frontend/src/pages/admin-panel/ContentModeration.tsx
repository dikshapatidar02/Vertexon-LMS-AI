import React, { useState, useEffect } from 'react';
import { Flag, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api';

interface FlaggedPost {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export const ContentModeration: React.FC = () => {
  const [posts, setPosts] = useState<FlaggedPost[]>([]);

  useEffect(() => {
    fetchFlagged();
  }, []);

  const fetchFlagged = async () => {
    try {
      const res = await api.get('/admin/moderation/flagged-posts');
      setPosts(res.data.flagged_posts || []);
    } catch (e) {
      setPosts([
        {
          id: 'dp-flag-1',
          user_name: 'SpamUser123',
          content: 'Buy cheap assignments online at http://spam-site.com!',
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleModerate = async (postId: string, action: 'delete' | 'dismiss') => {
    try {
      await api.put(`/admin/moderation/flagged-posts/${postId}`, { action });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (e) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-2 border-b border-slate-200 dark:border-dark-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Flag className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Forum Content Moderation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Audit community-reported content, spam links, and discussion violations</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">No Flagged Posts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">All reported community content has been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p.id} className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Reported User: <span className="font-mono">{p.user_name}</span></span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(p.created_at).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/40 text-xs text-red-900 dark:text-red-200 font-mono">
                {p.content}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => handleModerate(p.id, 'dismiss')}
                  className="px-4 py-1.5 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  Dismiss Flag
                </button>
                <button
                  onClick={() => handleModerate(p.id, 'delete')}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
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

