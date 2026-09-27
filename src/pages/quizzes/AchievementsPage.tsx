import React from 'react';
import { Award, Flame, CheckCircle2, Lock, Zap, BookOpen, Trophy, Star, ShieldCheck } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS } from '../../utils/demoData';

export const AchievementsPage: React.FC = () => {
  const earnedCount = INITIAL_ACHIEVEMENTS.filter((a) => a.earned).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" /> Gamification & Achievements
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your Badges & Learning Milestones</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Track your continuous learning streak, earned badges, quiz masteries, and verified course certificates.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
          <div className="text-center px-3">
            <p className="text-2xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" /> 7
            </p>
            <p className="text-[10px] uppercase font-bold text-slate-300">Day Streak</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center px-3">
            <p className="text-2xl font-extrabold text-emerald-400">{earnedCount}/{INITIAL_ACHIEVEMENTS.length}</p>
            <p className="text-[10px] uppercase font-bold text-slate-300">Badges Unlocked</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-600" /> All Platform Achievements
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-xl border transition-all ${
                ach.earned
                  ? 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-800 shadow-sm hover:shadow-md'
                  : 'bg-slate-50/70 dark:bg-dark-950/40 border-slate-200/60 dark:border-dark-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    ach.earned
                      ? 'bg-amber-100 dark:bg-amber-950/50 border border-amber-300/40 shadow-sm'
                      : 'bg-slate-200 dark:bg-dark-800 border border-slate-300 dark:border-dark-700 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{ach.title}</h3>
                    {ach.earned ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-dark-800 dark:text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{ach.description}</p>
                  <p className="text-[10px] font-semibold text-slate-400 pt-1">
                    {ach.earned ? `Earned on ${ach.unlockedAt}` : `Category: ${ach.category}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
