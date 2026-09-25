import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, User, Send, ChevronRight } from 'lucide-react';
import { api } from '../../utils/api';

interface Thread {
  id: string;
  title: string;
  created_by_name: string;
  created_at: string;
  post_count: number;
}

interface Post {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
  is_flagged: boolean;
}

export const DiscussionsPage: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isCreatingThread, setIsCreatingThread] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (selectedThreadId) {
      fetchPosts(selectedThreadId);
    }
  }, [selectedThreadId]);

  const fetchThreads = async () => {
    try {
      const res = await api.get('/discussions/course/crs-dsa-001');
      const list = res.data.threads || [];
      setThreads(list);
      if (list.length > 0 && !selectedThreadId) {
        setSelectedThreadId(list[0].id);
      }
    } catch (e) {
      setThreads([
        {
          id: 'dt-001',
          title: 'Is Randomized Quicksort guaranteed to run in O(n log n) time in all cases?',
          created_by_name: 'Ananya Sharma',
          created_at: new Date('2026-03-03').toISOString(),
          post_count: 2,
        },
      ]);
      setSelectedThreadId('dt-001');
    }
  };

  const fetchPosts = async (threadId: string) => {
    try {
      const res = await api.get(`/discussions/${threadId}/posts`);
      setPosts(res.data.posts || []);
    } catch (e) {
      setPosts([
        {
          id: 'dp-001',
          user_name: 'Ananya Sharma',
          content: 'I know randomized pivot reduces worst case probability, but mathematically is it impossible to hit O(n^2)?',
          created_at: new Date('2026-03-03T10:00:00Z').toISOString(),
          is_flagged: false,
        },
        {
          id: 'dp-002',
          user_name: 'Rohit Verma (Instructor)',
          content: 'Great question Ananya! Mathematically, the worst case O(n^2) still has a non-zero probability (1 / n!), but the expected runtime across all randomized choices is strictly O(n log n). For practical engineering purposes, the probability of hitting worst case is negligible.',
          created_at: new Date('2026-03-03T11:30:00Z').toISOString(),
          is_flagged: false,
        },
      ]);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    try {
      const res = await api.post('/discussions', {
        course_id: 'crs-dsa-001',
        title: newThreadTitle.trim(),
        initial_post: newThreadContent.trim(),
      });
      fetchThreads();
      setSelectedThreadId(res.data.thread.id);
      setNewThreadTitle('');
      setNewThreadContent('');
      setIsCreatingThread(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedThreadId) return;

    try {
      const res = await api.post(`/discussions/${selectedThreadId}/posts`, {
        content: replyContent.trim(),
      });
      setPosts((prev) => [...prev, res.data.post]);
      setReplyContent('');
    } catch (e) {
      setPosts((prev) => [
        ...prev,
        {
          id: `dp-${Date.now()}`,
          user_name: 'Ananya Sharma',
          content: replyContent.trim(),
          created_at: new Date().toISOString(),
          is_flagged: false,
        },
      ]);
      setReplyContent('');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-dark-800 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Discussion Forum</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Collaborative Q&A, academic threads, and course discussion</p>
        </div>
        <button
          onClick={() => setIsCreatingThread(!isCreatingThread)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg inline-flex items-center gap-1.5 shadow-sm shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" /> Start Discussion Thread
        </button>
      </div>

      {isCreatingThread && (
        <form onSubmit={handleCreateThread} className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-brand-500/40 space-y-3.5 shadow-sm">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Create Discussion Topic</h3>
          <input
            type="text"
            placeholder="Topic title..."
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            className="form-input"
          />
          <textarea
            rows={3}
            placeholder="Write your question or discussion description..."
            value={newThreadContent}
            onChange={(e) => setNewThreadContent(e.target.value)}
            className="form-input resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingThread(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition-colors">
              Publish Thread
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Threads Sidebar */}
        <div className="space-y-2">
          <h3 className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Discussion Topics</h3>
          <div className="space-y-2">
            {threads.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedThreadId(t.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedThreadId === t.id
                    ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-500 font-medium'
                    : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800'
                }`}
              >
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">{t.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                  <span>{t.created_by_name}</span>
                  <span>{t.post_count || 1} replies</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thread Posts Area */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Discussion Stream</h3>
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 p-5 space-y-4 min-h-[420px] flex flex-col justify-between shadow-sm">
            <div className="space-y-3.5 overflow-y-auto max-h-[500px] pr-1">
              {posts.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 dark:bg-dark-800/60 rounded-lg border border-slate-200/60 dark:border-dark-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> {p.user_name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{p.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Bar */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-200 dark:border-dark-800 flex gap-2">
              <input
                type="text"
                placeholder="Write a response..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="form-input flex-1"
              />
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="bg-brand-600 hover:bg-brand-700 text-white px-3.5 rounded-lg disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

