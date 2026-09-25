import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, AlertCircle, LogIn, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const data = await authService.login({ email: email.trim(), password });
      setAuth(data.user, data.access_token);

      if (data.user.role === 'admin') {
        navigate('/admin-panel');
      } else if (data.user.role === 'instructor') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        (typeof err.response?.data?.error === 'string' ? err.response?.data?.error : null) ||
        'Invalid email or password.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Sign in to Vertexon LMS
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in to continue learning on Vertexon LMS-AI Platform.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-6 px-6 sm:px-8 shadow-sm rounded-xl space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-10"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Subtle Demo Accounts Section */}
          <div className="relative pt-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-dark-700" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
              <span className="bg-white dark:bg-dark-900 px-2.5 text-slate-400 dark:text-slate-500">
                Development Demo Accounts
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            {/* Student Demo Account */}
            <div className="p-2 bg-slate-50 dark:bg-dark-800/60 rounded-lg border border-slate-200 dark:border-dark-700 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <GraduationCap className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-slate-100">Student: </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">student@gmail.com</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemo('student@gmail.com', 'student123')}
                className="btn-secondary h-6 px-2 text-[10px] shrink-0"
              >
                Use Account
              </button>
            </div>

            {/* Instructor Demo Account */}
            <div className="p-2 bg-slate-50 dark:bg-dark-800/60 rounded-lg border border-slate-200 dark:border-dark-700 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-slate-100">Instructor: </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">instructor@gmail.com</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemo('instructor@gmail.com', 'instructor123')}
                className="btn-secondary h-6 px-2 text-[10px] shrink-0"
              >
                Use Account
              </button>
            </div>

            {/* Admin Demo Account */}
            <div className="p-2 bg-slate-50 dark:bg-dark-800/60 rounded-lg border border-slate-200 dark:border-dark-700 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-slate-100">Admin: </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">admin@gmail.com</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemo('admin@gmail.com', 'admin123')}
                className="btn-secondary h-6 px-2 text-[10px] shrink-0"
              >
                Use Account
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-dark-800">
            <span className="text-xs text-slate-500">Don't have an account? </span>
            <Link to="/register" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
