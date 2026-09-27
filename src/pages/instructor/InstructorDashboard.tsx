import React from 'react';
import { Users, BookOpen, TrendingUp, Clock, Plus, BarChart2, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { INITIAL_COURSES } from '../../utils/demoData';

export const InstructorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const courses = INITIAL_COURSES;

  const dropOffData = [
    { lecture: 'Lec 1.1: Quicksort', completionRate: 98 },
    { lecture: 'Lec 1.2: Mergesort', completionRate: 88 },
    { lecture: 'Lec 2.1: Transformers', completionRate: 76 },
    { lecture: 'Lec 2.2: RAG Vector Search', completionRate: 70 },
  ];

  const quizPerformanceData = [
    { module: 'Module 1: Sorting', avgScore: 92 },
    { module: 'Module 2: AI Embeddings', avgScore: 86 },
    { module: 'Module 3: Neural Nets', avgScore: 81 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Instructor Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Demo Mode</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Faculty Instructor Analytics & Authoring
          </h1>
        </div>

        <Link
          to="/create-course"
          className="btn-primary h-9 px-4 text-xs font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" /> Create & Author New Course
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">1,240</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Total Active Learners</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/40">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{courses.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Authored Courses</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">86.4%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Course Completion</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">88.5%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Average Quiz Score</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-brand-600" /> Lecture Retention Rate (%)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Completion Trend</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dropOffData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="lecture" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completionRate" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-600" /> Module Quiz Accuracy Average
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Score Average</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="module" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[50, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Authored Courses Table */}
      <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">Course Portfolio Management</h3>
          <Link to="/create-course" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            + Author Course
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-200 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Course Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Enrolled Learners</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{c.title}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3 font-semibold">{c.studentsEnrolled.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Approved & Live
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => navigate(`/courses/${c.id}`)}
                      className="btn-secondary h-7 px-2.5 text-[11px] font-semibold"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
