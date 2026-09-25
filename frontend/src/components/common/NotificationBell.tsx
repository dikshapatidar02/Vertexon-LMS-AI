import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info } from 'lucide-react';
import { api } from '../../utils/api';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/me');
      setNotifications(res.data.notifications || []);
    } catch (e) {
      // Fallback notifications for demo
      setNotifications([
        {
          id: 'ntf-1',
          title: 'Assignment Graded',
          body: 'Your submission for Quicksort Benchmarks was graded: 92.5/100',
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: 'ntf-2',
          title: '7-Day Streak Badge Unlocked!',
          body: 'Congratulations! You earned the 7-Day Streak badge.',
          is_read: true,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-900" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-900 rounded-xl shadow-xl border border-gray-200 dark:border-dark-800 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-dark-800 flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Notifications</span>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-dark-800">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`p-3 text-xs cursor-pointer transition-colors ${
                    n.is_read ? 'bg-white dark:bg-dark-900 opacity-75' : 'bg-brand-50/50 dark:bg-brand-950/20'
                  } hover:bg-gray-50 dark:hover:bg-dark-800`}
                >
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{n.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-0.5">{n.body}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
