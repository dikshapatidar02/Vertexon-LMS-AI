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
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleAiDrawer, isMobileMenuOpen, toggleMobileMenu } = useCourseStore();
  const navigate = useNavigate();
  const role = user?.role || 'student';

  const handleLogout = () => {
    logout();
    toggleMobileMenu(false);
    navigate('/login', { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold border-l-2 border-brand-600 dark:border-brand-500 pl-2.5'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
    }`;

  const handleNavClick = () => {
    toggleMobileMenu(false);
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-3 overflow-y-auto">
      <div className="space-y-4">
        {/* Mobile Sidebar Close Button */}
        <div className="flex md:hidden items-center justify-between pb-2 border-b border-slate-200 dark:border-dark-800">
          <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">Navigation Menu</span>
          <button
            onClick={() => toggleMobileMenu(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STUDENT WORKSPACE NAV */}
        {role === 'student' && (
          <>
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Learning
              </div>
              <NavLink to="/dashboard" className={navClass} onClick={handleNavClick}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/catalog" className={navClass} onClick={handleNavClick}>
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>My Courses & Catalog</span>
              </NavLink>
              <NavLink to="/course-player" className={navClass} onClick={handleNavClick}>
                <PlaySquare className="w-4 h-4 shrink-0" />
                <span>Lecture Player</span>
              </NavLink>
              <NavLink to="/assignments" className={navClass} onClick={handleNavClick}>
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>Assignments</span>
              </NavLink>
              <NavLink to="/quizzes" className={navClass} onClick={handleNavClick}>
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Quizzes</span>
              </NavLink>
            </div>

            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Achievements & Tools
              </div>
              <NavLink to="/certificates" className={navClass} onClick={handleNavClick}>
                <Award className="w-4 h-4 shrink-0" />
                <span>Certificates</span>
              </NavLink>
              <NavLink to="/achievements" className={navClass} onClick={handleNavClick}>
                <Trophy className="w-4 h-4 shrink-0" />
                <span>Achievements</span>
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  toggleMobileMenu(false);
                  toggleAiDrawer(true);
                }}
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
              <NavLink to="/discussions" className={navClass} onClick={handleNavClick}>
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Discussions</span>
              </NavLink>
            </div>
          </>
        )}

        {/* INSTRUCTOR WORKSPACE NAV */}
        {role === 'instructor' && (
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Instructor Portal
            </div>
            <NavLink to="/instructor-dashboard" className={navClass} onClick={handleNavClick}>
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Instructor Analytics</span>
            </NavLink>
            <NavLink to="/create-course" className={navClass} onClick={handleNavClick}>
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Course Authoring</span>
            </NavLink>
            <NavLink to="/catalog" className={navClass} onClick={handleNavClick}>
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Course Catalog</span>
            </NavLink>
            <NavLink to="/assignments" className={navClass} onClick={handleNavClick}>
              <FileCheck2 className="w-4 h-4 shrink-0" />
              <span>Assignment Grading</span>
            </NavLink>
          </div>
        )}

        {/* ADMIN WORKSPACE NAV */}
        {role === 'admin' && (
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Platform Governance
            </div>
            <NavLink to="/admin-panel" className={navClass} onClick={handleNavClick}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Governance Overview</span>
            </NavLink>
            <NavLink to="/admin-users" className={navClass} onClick={handleNavClick}>
              <Users className="w-4 h-4 shrink-0" />
              <span>User Management</span>
            </NavLink>
            <NavLink to="/admin-approvals" className={navClass} onClick={handleNavClick}>
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Course Approvals</span>
            </NavLink>
            <NavLink to="/admin-moderation" className={navClass} onClick={handleNavClick}>
              <Flag className="w-4 h-4 shrink-0" />
              <span>Content Moderation</span>
            </NavLink>
          </div>
        )}

        {/* ACCOUNT SECTION */}
        <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-dark-800">
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Account
          </div>
          <NavLink to="/profile" className={navClass} onClick={handleNavClick}>
            <User className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/settings" className={navClass} onClick={handleNavClick}>
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
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-800 flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-Over */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => toggleMobileMenu(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 max-w-[85vw] bg-white dark:bg-dark-900 z-50 md:hidden shadow-2xl flex flex-col justify-between border-r border-slate-200 dark:border-dark-800">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};
