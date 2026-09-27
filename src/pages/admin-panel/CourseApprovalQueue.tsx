import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';

interface PendingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor_name: string;
  price: number;
  submittedAt: string;
}

const INITIAL_PENDING: PendingCourse[] = [
  {
    id: 'crs-pending-004',
    title: 'Quantum Computing Fundamentals & Qiskit',
    description: 'Introduction to qubits, superposition, quantum entanglement, and algorithm simulation.',
    category: 'Emerging Tech',
    instructor_name: 'Dr. Michael Vance',
    price: 39.99,
    submittedAt: '2026-03-20',
  },
  {
    id: 'crs-pending-005',
    title: 'Microservice Design Patterns with Go & gRPC',
    description: 'Build scalable distributed systems using Go concurrency primitives, protocol buffers, and circuit breakers.',
    category: 'Software Engineering',
    instructor_name: 'Rohit Verma',
    price: 49.99,
    submittedAt: '2026-03-22',
  },
];

export const CourseApprovalQueue: React.FC = () => {
  const [courses, setCourses] = useState<PendingCourse[]>(INITIAL_PENDING);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleDecision = (courseId: string, decision: 'approved' | 'rejected') => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setSelectedCourseId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="pb-2 border-b border-slate-200 dark:border-dark-800">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-600" /> Course Approval & Governance Queue
        </h1>
        <p className="text-xs text-slate-500">Review newly submitted instructor courses before publishing to the catalog.</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 shadow-sm space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Approval Queue Empty</h3>
          <p className="text-xs text-slate-500">All pending course submissions have been reviewed and processed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-1 inline-block">
                    {c.category}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.title}</h2>
                  <span className="text-xs text-slate-500">Instructor: {c.instructor_name} &nbsp;•&nbsp; Submitted {c.submittedAt}</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-xs rounded-lg self-start sm:self-center">
                  Pending Review
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.description}</p>

              {selectedCourseId === c.id ? (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl space-y-3">
                  <label className="text-xs font-bold text-red-900 dark:text-red-200">Rejection Feedback Note:</label>
                  <textarea
                    rows={2}
                    placeholder="Provide constructive feedback for the instructor..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="form-input text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedCourseId(null)}
                      className="btn-secondary h-8 px-3 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDecision(c.id, 'rejected')}
                      className="btn-danger h-8 px-3 text-xs"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex flex-col xs:flex-row justify-end gap-2.5">
                  <button
                    onClick={() => setSelectedCourseId(c.id)}
                    className="btn-secondary h-9 px-4 text-xs font-semibold w-full xs:w-auto"
                  >
                    Reject Course
                  </button>
                  <button
                    onClick={() => handleDecision(c.id, 'approved')}
                    className="btn-primary h-9 px-4 text-xs font-semibold w-full xs:w-auto"
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
