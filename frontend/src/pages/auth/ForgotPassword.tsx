import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());
      setSubmitted(true);
      if (res.dev_reset_url) {
        setDevResetUrl(res.dev_reset_url);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to process password reset.');
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
          Reset Your Password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your registered account email to receive a password reset link
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

          {submitted ? (
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-lg text-center space-y-3">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-200">Reset Request Processed</h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Instructions have been issued for <span className="font-medium">{email}</span>.
              </p>

              {devResetUrl && (
                <div className="p-3 bg-white dark:bg-dark-900 border border-emerald-300 dark:border-emerald-700 rounded-lg text-left space-y-1 mt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Dev Link (Generated):</span>
                  <Link
                    to={devResetUrl}
                    className="text-xs font-mono font-medium text-brand-600 dark:text-brand-400 break-all hover:underline block"
                  >
                    Click here to reset password
                  </Link>
                </div>
              )}

              <div className="pt-2">
                <Link to="/login" className="inline-block text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? 'Generating Link...' : 'Send Reset Instructions'}
              </button>
            </form>
          )}

          <div className="text-center pt-3 border-t border-slate-100 dark:border-dark-800">
            <Link to="/login" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

