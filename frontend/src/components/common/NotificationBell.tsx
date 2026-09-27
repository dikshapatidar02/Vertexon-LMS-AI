import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Info, Check, CheckCheck } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, SavedNotification } from '../../utils/storage';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<SavedNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = markNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-900" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-900 rounded-xl shadow-xl border border-slate-200 dark:border-dark-800 z-50 overflow-hidden">
          <div className="p-3 bg-slate-50 dark:bg-dark-950/50 border-b border-slate-100 dark:border-dark-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-dark-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No notifications yet</div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    handleMarkAsRead(n.id);
                    setIsOpen(false);
                    if (n.link) navigate(n.link);
                  }}
                  className={`p-3 text-xs cursor-pointer transition-colors ${
                    n.read ? 'bg-white dark:bg-dark-900 opacity-75' : 'bg-brand-50/40 dark:bg-brand-950/20 font-medium'
                  } hover:bg-slate-50 dark:hover:bg-dark-800`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5">
                      <Info className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-2 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-dark-800 text-center bg-slate-50 dark:bg-dark-950/50">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
