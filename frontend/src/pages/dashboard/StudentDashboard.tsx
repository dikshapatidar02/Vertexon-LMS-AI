import React, { useState, useEffect } from 'react';
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
  MessageSquare,
  FileCheck2,
  Calendar,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { courseService } from '../../services/course.service';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import { AITutorDrawer } from '../../components/ai-tutor/AITutorDrawer';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { setActiveCourse, toggleAiDrawer, setAiMode, aiMode } = useCourseStore();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, bdgRes] = await Promise.all([
        dashboardService.getStudentDashboard(),
        dashboardService.getBadges(),
      ]);
      setDashboardData(dashRes);
      setBadges(bdgRes.badges || []);
    } catch (e) {
      console.error('Error fetching dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueCourse = async (courseId: string) => {
    try {
      const res = await courseService.getCourseById(courseId);
      setActiveCourse(res.course);
      navigate('/course-player');
    } catch (e) {
      navigate('/course-player');
    }
  };

  const metrics = dashboardData?.metrics || {
    enrolled_courses_count: 0,
    current_streak: 7,
    badges_earned_count: 0,
    avg_quiz_accuracy: 0,
    overall_completion_percent: 0,
  };

  const enrollments = dashboardData?.enrollments || [];
  const recommendations = dashboardData?.recommendations || [];

  const completedCount = enrollments.filter((e: any) => e.progress_percent === 100).length;
  const inProgressCount = enrollments.length - completedCount;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, {user?.full_name || 'Learner'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Here is an overview of your active coursework, upcoming deadlines, and academic performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {enrollments.length > 0 && (
            <button
              onClick={() => handleContinueCourse(enrollments[0].course_id)}
              className="btn-primary"
            >
              <PlayCircle className="w-4 h-4" /> Resume Learning
            </button>
          )}
          <Link to="/catalog" className="btn-secondary">
            Browse Catalog
          </Link>
        </div>
      </div>

      {/* Metric Blocks Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Courses In Progress</span>
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{inProgressCount || metrics.enrolled_courses_count}</span>
            <span className="text-[11px] text-slate-500">active</span>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completed Courses</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{completedCount}</span>
            <span className="text-[11px] text-slate-500">finished</span>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.overall_completion_percent}%</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Average completion</span>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.current_streak}</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Days active</span>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Continue Learning
          </h2>
          <Link to="/catalog" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All Courses <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-slate-200 dark:bg-dark-800 rounded-xl animate-pulse" />
            <div className="h-32 bg-slate-200 dark:bg-dark-800 rounded-xl animate-pulse" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">No Active Enrollments</h3>
              <p className="text-xs text-slate-500 mt-1">Explore available courses in the catalog and begin your learning path.</p>
            </div>
            <Link to="/catalog" className="btn-primary">
              Browse Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrollments.map((enr: any) => (
              <div key={enr.id} className="glass-card p-4 flex flex-col justify-between space-y-3">
                <div className="flex gap-3.5">
                  <img
                    src={enr.course?.thumbnail_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'}
                    alt={enr.course?.title}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-dark-800"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="badge badge-blue">
                      {enr.course?.category || 'Computer Science'}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {enr.course?.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Instructor: {enr.course?.instructor_name || 'Faculty Member'}
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      Current Lesson: Lecture {enr.completed_lectures + 1 || 1}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-dark-800">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="text-brand-600 dark:text-brand-400">{enr.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-dark-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${enr.progress_percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[11px] text-slate-400">
                      {enr.completed_lectures} of {enr.total_lectures} lectures completed
                    </span>
                    <button
                      onClick={() => handleContinueCourse(enr.course_id)}
                      className="btn-primary h-7 px-2.5 text-[11px]"
                    >
                      Continue <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Upcoming Tasks & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming / Tasks Section */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Upcoming Assessments & Tasks
            </h2>
            <Link to="/assignments" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="glass-card divide-y divide-slate-100 dark:divide-dark-800">
            <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-slate-900 dark:text-slate-100">Module 2 Quiz: Trees & Recursion</div>
                  <div className="text-[11px] text-slate-500">Data Structures & Algorithms • Due in 2 days</div>
                </div>
              </div>
              <Link to="/quizzes" className="btn-secondary h-7 text-[11px]">
                Start Quiz
              </Link>
            </div>

            <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-slate-900 dark:text-slate-100">Assignment: Implement Vector Search Pipeline</div>
                  <div className="text-[11px] text-slate-500">Machine Learning RAG Systems • Due next week</div>
                </div>
              </div>
              <Link to="/assignments" className="btn-secondary h-7 text-[11px]">
                Submit File
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended For You Section */}
        <div className="space-y-3.5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Recommended for You
          </h2>

          <div className="glass-card p-4 space-y-3">
            {recommendations.length > 0 ? (
              <div className="space-y-2">
                <span className="badge badge-blue">Adaptive Recommendation</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {recommendations[0].course?.title || 'Cloud-Native Architecture'}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {recommendations[0].reason}
                </p>
                <Link to="/catalog" className="btn-primary w-full h-8 text-[11px] mt-2">
                  Explore Course
                </Link>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-brand-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">System Architecture & Microservices</p>
                <p className="text-[11px] text-slate-500">Recommended based on your recent coursework completion.</p>
                <Link to="/catalog" className="btn-secondary w-full h-8 text-[11px] mt-2">
                  Browse Catalog
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Drawer Integration */}
      <AITutorDrawer />
    </div>
  );
};
