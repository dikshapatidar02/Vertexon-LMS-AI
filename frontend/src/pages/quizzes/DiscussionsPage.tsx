import React, { useState } from 'react';
import { MessageSquare, Plus, User, Send, ThumbsUp, Search, MessageCircle, Sparkles } from 'lucide-react';
import { getDiscussions, createDiscussionThread, addDiscussionReply, toggleDiscussionLike, SavedDiscussionThread } from '../../utils/storage';
import { useAuthStore } from '../../store/authStore';

export const DiscussionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [threads, setThreads] = useState<SavedDiscussionThread[]>(getDiscussions());
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || 'disc-1');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyText, setReplyText] = useState('');

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const filteredThreads = threads.filter(
    (t) =>
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const authorName = user?.full_name || 'Ananya Sharma';
    const authorRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student';

    const updated = createDiscussionThread(
      'c1',
      'Data Structures & Algorithms Masterclass',
      newTitle.trim(),
      newContent.trim(),
      authorName,
      authorRole
    );

    setThreads(updated);
    if (updated[0]) setSelectedThreadId(updated[0].id);
    setNewTitle('');
    setNewContent('');
    setIsCreatingModal(false);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    const authorName = user?.full_name || 'Ananya Sharma';
    const authorRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student';

    const updated = addDiscussionReply(selectedThread.id, replyText.trim(), authorName, authorRole);
    setThreads(updated);
    setReplyText('');
  };

  const handleToggleLike = (threadId: string) => {
    const updated = toggleDiscussionLike(threadId);
    setThreads(updated);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-dark-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-600" /> Academic Discussion Forum
          </h1>
          <p className="text-xs text-slate-500">Collaborative Q&A, peer discussions, and instructor explanations.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatingModal(!isCreatingModal)}
            className="btn-primary h-9 px-3 text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Start Discussion
          </button>
        </div>
      </div>

      {/* Create Modal Form */}
      {isCreatingModal && (
        <form onSubmit={handleCreateThread} className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-brand-500/40 space-y-3 shadow-md">
          <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600" /> Post New Discussion Topic
          </h3>
          <input
            type="text"
            required
            placeholder="Topic title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="form-input text-xs"
          />
          <textarea
            rows={3}
            required
            placeholder="Write your question, theory, or problem description..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="form-input text-xs"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingModal(false)}
              className="btn-secondary h-8 px-3 text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary h-8 px-3 text-xs">
              Publish Topic
            </button>
          </div>
        </form>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Thread List & Search */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-8 text-xs"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredThreads.map((t) => {
              const isSelected = selectedThread?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedThreadId(t.id)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-500 font-medium shadow-sm'
                      : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800'
                  }`}
                >
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 block truncate mb-1">
                    {t.courseTitle}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">{t.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>{t.authorName}</span>
                    <span className="flex items-center gap-1 font-semibold">
                      <MessageCircle className="w-3 h-3" /> {t.replies.length} replies
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Thread & Replies */}
        {selectedThread && (
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 p-5 space-y-4 shadow-sm">
              {/* Thread Post Header */}
              <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-dark-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={selectedThread.authorAvatar} alt={selectedThread.authorName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">{selectedThread.authorName}</h3>
                      <p className="text-[10px] text-slate-400">{selectedThread.authorRole} • {selectedThread.createdAt}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleLike(selectedThread.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
                      selectedThread.isLiked
                        ? 'bg-brand-50 text-brand-600 border-brand-300 dark:bg-brand-950 dark:text-brand-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-dark-800 dark:text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> {selectedThread.likesCount}
                  </button>
                </div>

                <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{selectedThread.title}</h2>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedThread.content}</p>
              </div>

              {/* Replies Stream */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Replies ({selectedThread.replies.length})
                </h4>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {selectedThread.replies.map((rep) => (
                    <div key={rep.id} className="p-3.5 bg-slate-50 dark:bg-dark-800/60 rounded-xl border border-slate-200/60 dark:border-dark-700 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={rep.authorAvatar} alt={rep.authorName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-slate-900 dark:text-slate-100">{rep.authorName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-dark-700 text-slate-600 dark:text-slate-300 font-semibold">
                            {rep.authorRole}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 pl-8">{rep.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleAddReply} className="pt-3 border-t border-slate-100 dark:border-dark-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="form-input flex-1 text-xs"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="btn-primary h-9 px-3.5 text-xs shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
