import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Flame,
  Award,
  PlayCircle,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Trophy,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { INITIAL_COURSES, INITIAL_ACHIEVEMENTS, INITIAL_ASSIGNMENTS, INITIAL_QUIZZES } from '../../utils/demoData';
import { getEnrolledCourseIds, getCompletedLectures, getQuizResults } from '../../utils/storage';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { setActiveCourse } = useCourseStore();
  const navigate = useNavigate();

  const enrolledIds = getEnrolledCourseIds();
  const completedLectures = getCompletedLectures();
  const quizResults = getQuizResults();

  const enrolledCourses = INITIAL_COURSES.filter((c) => enrolledIds.includes(c.id));
  const recommendedCourses = INITIAL_COURSES.filter((c) => !enrolledIds.includes(c.id));

  const streakDays = 7;
  const earnedBadgesCount = INITIAL_ACHIEVEMENTS.filter((a) => a.earned).length;

  const handleContinueCourse = (courseId: string) => {
    const course = INITIAL_COURSES.find((c) => c.id === courseId);
    if (course) setActiveCourse(course as any);
    navigate(`/course-player?courseId=${courseId}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, {user?.full_name || 'Ananya Sharma'} 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Here is your academic progress dashboard, active coursework, and upcoming assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {enrolledCourses.length > 0 && (
            <button
              onClick={() => handleContinueCourse(enrolledCourses[0].id)}
              className="btn-primary"
            >
              <PlayCircle className="w-4 h-4" /> Continue Learning
            </button>
          )}
          <Link to="/catalog" className="btn-secondary">
            Browse Course Catalog
          </Link>
        </div>
      </div>

      {/* Metric Blocks Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-900 p-4 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{enrolledCourses.length}</span>
            <span className="text-[11px] text-slate-500">active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-4 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Lectures</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{completedLectures.length}</span>
            <span className="text-[11px] text-slate-500">lectures</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-4 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{streakDays}</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Days active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-4 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Badges Unlocked</span>
            <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{earnedBadgesCount}</span>
            <span className="text-[11px] text-purple-600 font-semibold">earned</span>
          </div>
        </div>
      </div>

      {/* Courses in Progress Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Courses in Progress
          </h2>
          <Link to="/catalog" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All Courses <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => {
            const courseLectures = course.modules.flatMap((m) => m.lectures);
            const doneLectures = courseLectures.filter((l) => completedLectures.includes(l.id)).length;
            const totalLectures = courseLectures.length;
            const pct = Math.round((doneLectures / totalLectures) * 100) || 45;

            return (
              <div key={course.id} className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
                <div className="flex gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-24 h-24 rounded-lg object-cover border border-slate-200 dark:border-dark-800 shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Instructor: {course.instructor}
                    </p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Current Lesson: {course.modules[0]?.lectures[0]?.title || 'Module 1'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-dark-800">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Learning Progress</span>
                    <span className="text-brand-600 dark:text-brand-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-dark-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-slate-500">
                      {doneLectures} of {totalLectures} lectures completed
                    </span>
                    <button
                      onClick={() => handleContinueCourse(course.id)}
                      className="btn-primary h-8 px-3 text-xs"
                    >
                      Resume Lesson <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Upcoming Tasks & Recommended Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments & Quizzes */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Upcoming Assignments & Quizzes
            </h2>
            <Link to="/assignments" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 divide-y divide-slate-100 dark:divide-dark-800 shadow-sm overflow-hidden">
            {INITIAL_ASSIGNMENTS.map((asg) => (
              <div key={asg.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{asg.title}</div>
                    <div className="text-slate-500 text-[11px]">{asg.courseTitle} • Due: {asg.dueDate}</div>
                  </div>
                </div>
                <Link to="/assignments" className="btn-secondary h-8 px-3 text-xs shrink-0 font-semibold">
                  View Instructions
                </Link>
              </div>
            ))}

            {INITIAL_QUIZZES.map((qz) => (
              <div key={qz.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{qz.title}</div>
                    <div className="text-slate-500 text-[11px]">{qz.questions.length} questions • {qz.timeLimitMinutes} min limit</div>
                  </div>
                </div>
                <Link to="/quizzes" className="btn-primary h-8 px-3 text-xs shrink-0 font-semibold">
                  Take Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="space-y-3.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Recommended for You
          </h2>

          <div className="space-y-3">
            {recommendedCourses.map((rc) => (
              <div key={rc.id} className="bg-white dark:bg-dark-900 p-4 rounded-xl border border-slate-200 dark:border-dark-800 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{rc.category}</span>
                  <span className="text-xs text-amber-500 font-bold">★ {rc.rating}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{rc.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{rc.description}</p>
                <Link to={`/courses/${rc.id}`} className="btn-secondary w-full h-8 text-xs font-semibold block text-center pt-1.5">
                  View Course Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
