import React, { useState } from 'react';
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
  LogOut,
  Award,
  BookOpen,
  Trophy,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getCompletedLectures, getEnrolledCourseIds } from '../../utils/storage';
import { INITIAL_COURSES, INITIAL_CERTIFICATES, INITIAL_ACHIEVEMENTS } from '../../utils/demoData';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.full_name || user?.name || 'Ananya Sharma');
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const completedLectures = getCompletedLectures();
  const enrolledIds = getEnrolledCourseIds();
  const earnedBadgesCount = INITIAL_ACHIEVEMENTS.filter((a) => a.earned).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFullName.trim()) return;

    updateUser({
      full_name: editFullName.trim(),
      name: editFullName.trim(),
      avatar_url: editAvatarUrl.trim() || user?.avatar_url,
    });

    setSaveSuccess(true);
    setIsEditingProfile(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const role = user?.role || 'student';
  const roleBadge = () => {
    switch (role) {
      case 'admin':
        return <span className="badge badge-red"><ShieldCheck className="w-3 h-3" /> System Admin</span>;
      case 'instructor':
        return <span className="badge badge-amber"><UserCheck className="w-3 h-3" /> Course Faculty</span>;
      default:
        return <span className="badge badge-blue"><GraduationCap className="w-3 h-3" /> Student Learner</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            User Profile & Learning Credentials
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of account details, verified certificates, and academic statistics.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile Updated
          </div>
        )}
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-dark-800">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.full_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500/20 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{user?.full_name || 'Ananya Sharma'}</h2>
                {roleBadge()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{user?.email || 'student@gmail.com'}</p>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                ✓ Demo Session Active &nbsp;•&nbsp; Account Status: Verified Active
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(true)}
            className="btn-secondary h-9 px-3 text-xs font-semibold shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>

        {/* Academic Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-dark-950 p-3.5 rounded-xl border border-slate-200 dark:border-dark-800">
            <span className="text-slate-400 font-medium block text-[11px]">Enrolled Courses</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{enrolledIds.length}</span>
          </div>

          <div className="bg-slate-50 dark:bg-dark-950 p-3.5 rounded-xl border border-slate-200 dark:border-dark-800">
            <span className="text-slate-400 font-medium block text-[11px]">Lectures Completed</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{completedLectures.length}</span>
          </div>

          <div className="bg-slate-50 dark:bg-dark-950 p-3.5 rounded-xl border border-slate-200 dark:border-dark-800">
            <span className="text-slate-400 font-medium block text-[11px]">Certificates</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{INITIAL_CERTIFICATES.length}</span>
          </div>

          <div className="bg-slate-50 dark:bg-dark-950 p-3.5 rounded-xl border border-slate-200 dark:border-dark-800">
            <span className="text-slate-400 font-medium block text-[11px]">Badges Unlocked</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{earnedBadgesCount}</span>
          </div>
        </div>
      </div>

      {/* Verified Certificates List */}
      <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Earned Certificates
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-dark-800 text-xs">
          {INITIAL_CERTIFICATES.map((cert) => (
            <div key={cert.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{cert.courseTitle}</h4>
                <p className="text-slate-500 text-[11px]">Issued by {cert.instructor} on {cert.issueDate}</p>
              </div>
              <button onClick={() => navigate('/certificates')} className="btn-secondary h-7 px-2.5 text-[11px]">
                View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center justify-between shadow-sm text-xs">
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">Sign Out of Demo Session</span>
          <span className="text-slate-500">Clears current session and returns to login page.</span>
        </div>
        <button onClick={handleLogout} className="btn-danger h-9 px-4 font-semibold">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 rounded-2xl border border-slate-200 dark:border-dark-800 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-dark-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
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
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary h-8 text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary h-8 text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
