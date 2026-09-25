import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';
import { api } from '../../utils/api';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor_name: string;
  price: number;
  created_at: string;
}

export const CourseApprovalQueue: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/admin/courses/pending');
      setCourses(res.data.courses || []);
    } catch (e) {
      setCourses([
        {
          id: 'crs-pending-004',
          title: 'Quantum Computing Fundamentals & Qiskit',
          description: 'Introduction to qubits, superposition, quantum entanglement, and algorithm simulation.',
          category: 'Emerging Tech',
          instructor_name: 'Rohit Verma',
          price: 39.99,
          created_at: '2026-03-20',
        },
      ]);
    }
  };

  const handleDecision = async (courseId: string, decision: 'approved' | 'rejected') => {
    try {
      await api.post(`/courses/${courseId}/approve`, {
        decision,
        comment: decision === 'rejected' ? rejectReason : undefined,
      });
      fetchPending();
      setSelectedCourseId(null);
      setRejectReason('');
    } catch (e) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setSelectedCourseId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-2 border-b border-slate-200 dark:border-dark-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Approval Queue</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Review newly submitted instructor courses before catalog publication</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Approval Queue Empty</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">All submitted courses have been thoroughly audited.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="badge-blue mb-1">
                    {c.category}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.title}</h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Instructor: {c.instructor_name}</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold text-xs rounded-md self-start sm:self-center">
                  Pending Review
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.description}</p>

              {selectedCourseId === c.id ? (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg space-y-3">
                  <label className="text-xs font-semibold text-red-900 dark:text-red-200">Rejection Audit Note:</label>
                  <textarea
                    rows={2}
                    placeholder="Provide constructive feedback or state why this course was rejected..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="form-input text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedCourseId(null)}
                      className="px-3.5 py-1.5 bg-slate-100 dark:bg-dark-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDecision(c.id, 'rejected')}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex justify-end gap-2.5">
                  <button
                    onClick={() => setSelectedCourseId(c.id)}
                    className="px-4 py-2 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition-colors"
                  >
                    Reject Course
                  </button>
                  <button
                    onClick={() => handleDecision(c.id, 'approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

