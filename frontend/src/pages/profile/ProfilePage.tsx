import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Edit3,
  Camera,
  Save,
  X,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Lock,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
];

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState<any>(user);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileSuccess, setEditProfileSuccess] = useState<string | null>(null);
  const [editProfileError, setEditProfileError] = useState<string | null>(null);

  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fetchLatestProfile = async () => {
    try {
      setRefreshing(true);
      const res = await authService.me();
      if (res) {
        const fetchedUser = res.user || res;
        setProfileData(fetchedUser);
        updateUser(fetchedUser);
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestProfile();
  }, []);

  const handleOpenEditModal = () => {
    setEditFullName(profileData?.full_name || profileData?.name || '');
    setEditAvatarUrl(profileData?.avatar_url || '');
    setEditProfileError(null);
    setEditProfileSuccess(null);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditProfileError(null);
    setEditProfileSuccess(null);

    if (!editFullName.trim()) {
      setEditProfileError('Full name cannot be empty.');
      return;
    }

    try {
      setEditProfileLoading(true);
      const res = await authService.updateProfile({
        full_name: editFullName.trim(),
        avatar_url: editAvatarUrl.trim(),
      });

      const updated = res.user || res;
      setProfileData((prev: any) => ({ ...prev, ...updated }));
      updateUser(updated);
      setEditProfileSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsEditingProfile(false);
        setEditProfileSuccess(null);
      }, 1000);
    } catch (err: any) {
      const errMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Failed to update profile.';
      setEditProfileError(errMsg);
    } finally {
      setEditProfileLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setPasswordSuccess(res.message || 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err: any) {
      const errMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Current password is incorrect.';
      setPasswordError(errMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return 'Active now';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const displayName = profileData?.full_name || profileData?.name || user?.full_name || 'User Account';
  const displayEmail = profileData?.email || user?.email || '';
  const displayRole = profileData?.role || user?.role || 'student';
  const displayAvatar = profileData?.avatar_url || user?.avatar_url || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150`;
  const displayCreatedAt = profileData?.created_at || profileData?.createdAt;
  const displayLastLogin = profileData?.last_login_at || profileData?.lastLoginAt;
  const displayStatus = profileData?.status || (profileData?.is_active !== false ? 'Active' : 'Inactive');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Profile & Account Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your account information, security credentials, and preferences.
          </p>
        </div>

        <button
          onClick={fetchLatestProfile}
          disabled={refreshing}
          className="btn-secondary h-8 px-3 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
        </button>
      </div>

      {/* Personal Information Section */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Personal Information
          </h2>
          <button onClick={handleOpenEditModal} className="btn-secondary h-8 px-3 text-xs">
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-dark-700"
            />
            <button
              onClick={handleOpenEditModal}
              className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-brand-600 text-white shadow-sm hover:bg-brand-700 transition-colors"
              title="Change Avatar"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Full Name</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{displayName}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Email Address</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{displayEmail}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Assigned Role</span>
              <span className="badge badge-blue capitalize">{displayRole}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Member Since</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(displayCreatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Security & Authentication
          </h2>
          <span className="badge badge-green">Bcrypt Encrypted</span>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-dark-800 rounded-lg border border-slate-200 dark:border-dark-700 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Password</span>
            <span className="text-slate-400 font-mono tracking-widest text-xs">••••••••••••</span>
          </div>
          <button
            onClick={() => {
              setIsChangingPassword(!isChangingPassword);
              setPasswordError(null);
              setPasswordSuccess(null);
            }}
            className="btn-secondary h-8 text-xs"
          >
            <Key className="w-3.5 h-3.5" />
            {isChangingPassword ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {/* Change Password Form */}
        {isChangingPassword && (
          <form onSubmit={handleChangePasswordSubmit} className="p-4 bg-slate-50 dark:bg-dark-950 rounded-lg border border-slate-200 dark:border-dark-700 space-y-3.5 text-xs">
            {passwordError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="space-y-1">
              <label className="form-label">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="form-input"
              />
            </div>

            <div className="space-y-1">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="btn-secondary h-8"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={passwordLoading}
                className="btn-primary h-8"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Status & Logout Section */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Account Activity & Actions
          </h2>
          <span className="badge badge-green">Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Account Status</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{displayStatus}</span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Last Active Session</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatTimestamp(displayLastLogin)}</span>
          </div>

          <div className="sm:text-right">
            <button
              onClick={handleLogout}
              className="btn-danger h-8"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out of Account
            </button>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-dark-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Edit Profile Information
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {editProfileError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{editProfileError}</span>
                </div>
              )}

              {editProfileSuccess && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 rounded-lg text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{editProfileSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={displayEmail}
                  className="form-input opacity-70 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="form-label">Avatar URL</label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-dark-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn-secondary h-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editProfileLoading}
                  className="btn-primary h-8"
                >
                  {editProfileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
