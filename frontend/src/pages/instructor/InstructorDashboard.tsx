import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Plus,
  BarChart2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { api } from '../../utils/api';

export const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.courses || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Analytics Chart Data
  const dropOffData = [
    { lecture: 'Lec 1: Quicksort', completionRate: 98 },
    { lecture: 'Lec 2: Mergesort', completionRate: 85 },
    { lecture: 'Lec 3: Dijkstra', completionRate: 72 },
    { lecture: 'Lec 4: DP Trees', completionRate: 64 },
  ];

  const quizPerformanceData = [
    { module: 'Mod 1: Sorting', avgScore: 92 },
    { module: 'Mod 2: Graphs', avgScore: 84 },
    { module: 'Mod 3: Trees', avgScore: 78 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Instructor Workspace</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Course authoring, learner drop-off analytics, and assignment review</p>
        </div>
        <Link
          to="/create-course"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Author New Course
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">1,240</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Enrolled Students</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/40">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{courses.length || 3}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Published Courses</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">86.4%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Avg Completion Rate</span>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">4.2 Hrs</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Avg Time-on-Task</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lecture Drop-off Rate Chart */}
        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Per-Lecture Learner Retained Percentage
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">% Active Completion</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dropOffData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="lecture" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="completionRate" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quiz Performance Chart */}
        <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-800 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Per-Module Average Quiz Performance
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Avg Score %</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="module" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[50, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Courses List Table */}
      <div className="bg-white dark:bg-dark-900 p-5 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">My Authoring Portfolio</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-200 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Course Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{c.title}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3 font-medium">${c.price}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        c.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-3 py-1 bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-300 font-semibold rounded hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors">
                      Manage Modules
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

