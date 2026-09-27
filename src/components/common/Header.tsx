import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Sparkles, UserCheck, ShieldCheck, GraduationCap, LogOut, User, Search, Settings, Lock, ChevronRight, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { NotificationBell } from './NotificationBell';

export const Header: React.FC = () => {
  const { user, darkMode, toggleDarkMode, logout } = useAuthStore();
  const { toggleAiDrawer, toggleMobileMenu } = useCourseStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Compute breadcrumb/title from pathname
  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/catalog')) return 'Course Catalog';
    if (path.includes('/course-player')) return 'Course Player';
    if (path.includes('/quizzes')) return 'Quizzes';
    if (path.includes('/assignments')) return 'Assignments';
    if (path.includes('/certificates')) return 'Certificates & Badges';
    if (path.includes('/discussions')) return 'Discussions';
    if (path.includes('/profile')) return 'Account Settings';
    if (path.includes('/instructor-dashboard')) return 'Instructor Analytics';
    if (path.includes('/create-course')) return 'Course Authoring';
    if (path.includes('/admin-panel')) return 'Platform Governance';
    if (path.includes('/admin-users')) return 'User Management';
    if (path.includes('/admin-approvals')) return 'Course Approvals';
    if (path.includes('/admin-moderation')) return 'Content Moderation';
    return 'LMS Workspace';
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return <span className="badge badge-red"><ShieldCheck className="w-3 h-3" /> Admin</span>;
      case 'instructor':
        return <span className="badge badge-amber"><UserCheck className="w-3 h-3" /> Instructor</span>;
      default:
        return <span className="badge badge-blue"><GraduationCap className="w-3 h-3" /> Student</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-dark-800 px-2.5 sm:px-4 py-2.5 flex items-center justify-between min-w-0">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-1.5 sm:gap-6 min-w-0">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => toggleMobileMenu()}
          className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg transition-colors shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-slate-100 truncate">
            <span className="hidden xs:inline">Vertexon </span><span className="text-brand-600 dark:text-brand-400 font-medium text-xs">LMS-AI</span>
          </span>
        </Link>

        {/* Divider & Page Breadcrumb & Demo Mode Badge */}
        <div className="hidden md:flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-dark-800 pl-4">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Vertexon</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{getBreadcrumbTitle()}</span>
          
          <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Demo Mode ({user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Guest'})
          </span>
        </div>
      </div>

      {/* Center Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center max-w-xs w-full relative">
        <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search courses, lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-8 pl-8 pr-3 bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-dark-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white dark:focus:bg-dark-900 transition-colors"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg transition-colors shrink-0"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Ask AI Tutor Button */}
        <button
          onClick={() => toggleAiDrawer(true)}
          className="btn-primary h-8 px-2.5 sm:px-3 text-xs shrink-0"
          title="Open AI Tutor Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask AI Tutor</span>
          <span className="sm:hidden text-[11px]">AI</span>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Profile Dropdown */}
        <div className="relative pl-1.5 border-l border-slate-200 dark:border-dark-800">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={user?.full_name}
              className="w-7 h-7 rounded-full ring-1 ring-slate-300 dark:ring-dark-700 object-cover"
            />
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">{user?.full_name}</span>
                {getRoleBadge(user?.role)}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-900 rounded-xl shadow-lg border border-slate-200 dark:border-dark-800 py-1.5 z-50">
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-dark-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user?.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-800 flex items-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-500" /> Profile
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-800 flex items-center gap-2 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" /> Settings
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-800 flex items-center gap-2 transition-colors border-b border-slate-100 dark:border-dark-800 pb-2"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" /> Change Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition-colors pt-2"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
