import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Globe, Video, CheckCircle2, Save } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getUserSettings, saveUserSettings, UserSettingsData } from '../../utils/storage';

export const SettingsPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useAuthStore();
  const [settings, setSettings] = useState<UserSettingsData>(getUserSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (key: keyof UserSettingsData, val: any) => {
    const updated = saveUserSettings({ [key]: val });
    setSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="border-b border-slate-200 dark:border-dark-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" /> Platform Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500">Customize appearance, notification delivery, language, and course video playback.</p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings Saved Locally
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />} Appearance Mode
          </h2>
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Dark Theme</p>
              <p className="text-slate-500">Switch between sleek dark mode and bright clean theme.</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg font-bold border transition-colors ${
                darkMode
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" /> Notification Preferences
          </h2>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Email Notifications</p>
                <p className="text-slate-500">Receive weekly learning digest and certificate notifications.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100 dark:border-dark-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Assignment Reminders</p>
                <p className="text-slate-500">Get alerts 24 hours before assignment deadlines.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.assignmentReminders}
                onChange={(e) => handleChange('assignmentReminders', e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100 dark:border-dark-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Discussion Updates</p>
                <p className="text-slate-500">Notify when someone replies to your discussion threads.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.discussionUpdates}
                onChange={(e) => handleChange('discussionUpdates', e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Video & Playback */}
        <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-600" /> Playback & Language
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="form-label">Language Preference</label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="form-input"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="form-label">Default Video Resolution</label>
              <select
                value={settings.defaultVideoQuality}
                onChange={(e) => handleChange('defaultVideoQuality', e.target.value)}
                className="form-input"
              >
                <option value="1080p (HD)">1080p Full HD</option>
                <option value="720p (HD)">720p HD</option>
                <option value="480p">480p Standard</option>
                <option value="Auto">Auto Adaptive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
