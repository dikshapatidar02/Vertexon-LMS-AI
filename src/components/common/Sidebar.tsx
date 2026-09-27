import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlaySquare,
  HelpCircle,
  FileCheck2,
  Award,
  MessageSquare,
  PlusCircle,
  BarChart3,
  Users,
  ShieldCheck,
  Flag,
  Flame,
  Sparkles,
  User,
  LogOut,
  Bell,
  Settings,
  Trophy,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleAiDrawer } = useCourseStore();
  const navigate = useNavigate();
  const role = user?.role || 'student';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold border-l-2 border-brand-600 dark:border-brand-500 pl-2.5'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
    }`;

  return (
    <aside className="w-60 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)] p-3">
      <div className="space-y-4">

        {/* STUDENT WORKSPACE NAV */}
        {role === 'student' && (
          <>
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Learning
              </div>
              <NavLink to="/dashboard" className={navClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/catalog" className={navClass}>
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>My Courses & Catalog</span>
              </NavLink>
              <NavLink to="/course-player" className={navClass}>
                <PlaySquare className="w-4 h-4 shrink-0" />
                <span>Lecture Player</span>
              </NavLink>
              <NavLink to="/assignments" className={navClass}>
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>Assignments</span>
              </NavLink>
              <NavLink to="/quizzes" className={navClass}>
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Quizzes</span>
              </NavLink>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Achievements & Tools
              </div>
              <NavLink to="/certificates" className={navClass}>
                <Award className="w-4 h-4 shrink-0" />
                <span>Certificates</span>
              </NavLink>
              <NavLink to="/achievements" className={navClass}>
                <Trophy className="w-4 h-4 shrink-0" />
                <span>Achievements</span>
              </NavLink>
              <button
                type="button"
                onClick={() => toggleAiDrawer(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>AI Tutor</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Demo
                </span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Community & Inbox
              </div>
              <NavLink to="/discussions" className={navClass}>
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Discussions</span>
              </NavLink>
              <NavLink to="/notifications" className={navClass}>
                <Bell className="w-4 h-4 shrink-0" />
                <span>Notifications</span>
              </NavLink>
            </div>
          </>
        )}

        {/* INSTRUCTOR WORKSPACE NAV */}
        {role === 'instructor' && (
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
              Instructor Portal
            </div>
            <NavLink to="/instructor-dashboard" className={navClass}>
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Instructor Dashboard</span>
            </NavLink>
            <NavLink to="/catalog" className={navClass}>
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Course Catalog & Content</span>
            </NavLink>
            <NavLink to="/create-course" className={navClass}>
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Create Course</span>
            </NavLink>
            <NavLink to="/assignments" className={navClass}>
              <FileCheck2 className="w-4 h-4 shrink-0" />
              <span>Assignments</span>
            </NavLink>
            <NavLink to="/quizzes" className={navClass}>
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>Quizzes</span>
            </NavLink>
            <NavLink to="/admin-users" className={navClass}>
              <Users className="w-4 h-4 shrink-0" />
              <span>Students</span>
            </NavLink>
            <NavLink to="/discussions" className={navClass}>
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Discussions</span>
            </NavLink>
            <NavLink to="/notifications" className={navClass}>
              <Bell className="w-4 h-4 shrink-0" />
              <span>Announcements</span>
            </NavLink>
          </div>
        )}

        {/* ADMIN WORKSPACE NAV */}
        {role === 'admin' && (
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-red-600 dark:text-red-400 uppercase">
              Admin Governance
            </div>
            <NavLink to="/admin-panel" className={navClass}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Admin Dashboard</span>
            </NavLink>
            <NavLink to="/admin-users" className={navClass}>
              <Users className="w-4 h-4 shrink-0" />
              <span>User Management</span>
            </NavLink>
            <NavLink to="/catalog" className={navClass}>
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Courses</span>
            </NavLink>
            <NavLink to="/admin-approvals" className={navClass}>
              <Award className="w-4 h-4 shrink-0" />
              <span>Course Approvals</span>
            </NavLink>
            <NavLink to="/admin-moderation" className={navClass}>
              <Flag className="w-4 h-4 shrink-0" />
              <span>Content & Moderation</span>
            </NavLink>
            <NavLink to="/discussions" className={navClass}>
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>Discussions</span>
            </NavLink>
            <NavLink to="/notifications" className={navClass}>
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
            </NavLink>
          </div>
        )}

        {/* ACCOUNT / FOOTER NAV */}
        <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-dark-800">
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Account
          </div>
          <NavLink to="/profile" className={navClass}>
            <User className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Gamification Subtle Streak Badge */}
      {role === 'student' && (
        <div className="mt-4 p-2.5 bg-slate-50 dark:bg-dark-800 rounded-lg border border-slate-200 dark:border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">7-Day Streak</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Keep learning daily</p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded border border-amber-500/20">
            Active
          </span>
        </div>
      )}
    </aside>
  );
};
