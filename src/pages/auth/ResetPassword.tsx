import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await authService.resetPassword({ token, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Password reset failed. Token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-brand-600 text-white shadow-sm mx-auto mb-2">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Create New Password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Set a secure password to regain access to your Vertexon account
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-900 py-8 px-6 sm:px-8 shadow-sm rounded-xl border border-slate-200 dark:border-dark-800 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-200">Password Updated Successfully</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Your password has been changed. Redirecting to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input pl-9"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="text-center pt-3 border-t border-slate-100 dark:border-dark-800">
            <Link to="/login" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

