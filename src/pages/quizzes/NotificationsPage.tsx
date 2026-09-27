import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Info, CheckCheck, Filter, ArrowRight } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, SavedNotification } from '../../utils/storage';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<SavedNotification[]>(getNotifications());
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const handleMarkRead = (id: string) => {
    const updated = markNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-dark-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-600" /> Notifications & Announcements
          </h1>
          <p className="text-xs text-slate-500">Stay updated on course deadlines, quiz evaluations, certificates, and system updates.</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary h-9 px-3 text-xs flex items-center gap-1.5 font-semibold"
            >
              <CheckCheck className="w-4 h-4 text-brand-600" /> Mark All Read
            </button>
          )}

          <div className="flex bg-slate-100 dark:bg-dark-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'all' ? 'bg-white dark:bg-dark-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md transition-colors ${
                filter === 'unread' ? 'bg-white dark:bg-dark-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 divide-y divide-slate-100 dark:divide-dark-800 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No notifications found</p>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                handleMarkRead(n.id);
                if (n.link) navigate(n.link);
              }}
              className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                n.read ? 'bg-white dark:bg-dark-900 opacity-75' : 'bg-brand-50/40 dark:bg-brand-950/20'
              } hover:bg-slate-50 dark:hover:bg-dark-800/60`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300 shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">{n.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-dark-700">
                      {n.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
                  <p className="text-[10px] text-slate-400">{n.timestamp}</p>
                </div>
              </div>

              {n.link && (
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 shrink-0">
                  View <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
