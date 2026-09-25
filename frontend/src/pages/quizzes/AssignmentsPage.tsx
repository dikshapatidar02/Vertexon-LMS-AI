import React, { useState, useEffect } from 'react';
import { FileCheck2, UploadCloud, Calendar, CheckCircle2, Clock, FileText } from 'lucide-react';
import { api } from '../../utils/api';

interface RubricItem {
  criteria: string;
  points: number;
}

interface Assignment {
  id: string;
  title: string;
  instructions: string;
  rubric: RubricItem[];
  due_date: string;
  submission?: {
    file_url: string;
    submitted_at: string;
    grade?: number;
    feedback?: string;
  };
}

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [fileUrlInput, setFileUrlInput] = useState('');
  const [selectedAsgId, setSelectedAsgId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments/course/crs-dsa-001');
      setAssignments(res.data.assignments || []);
    } catch (e) {
      setAssignments([
        {
          id: 'asg-001',
          title: 'Quicksort & Mergesort Benchmarking Assignment',
          instructions: 'Implement Quicksort with randomized pivot and Mergesort in Python or C++. Compare execution times for array sizes N=10^3, 10^5, and 10^7. Submit a ZIP file containing your code and PDF report.',
          rubric: [
            { criteria: 'Correct Implementation of Quicksort & Mergesort', points: 40 },
            { criteria: 'Benchmark Data & Performance Graphs', points: 30 },
            { criteria: 'Analysis of Pivot Strategies', points: 30 },
          ],
          due_date: '2026-10-15T23:59:59Z',
          submission: {
            file_url: 'https://example.com/submissions/ananya_dsa_benchmarks.zip',
            submitted_at: new Date('2026-03-10').toISOString(),
            grade: 92.5,
            feedback: 'Excellent pivot selection benchmarks! Good breakdown of memory overhead.',
          },
        },
      ]);
    }
  };

  const handleSubmit = async (asgId: string) => {
    if (!fileUrlInput.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post(`/assignments/${asgId}/submit`, {
        file_url: fileUrlInput.trim(),
      });
      fetchAssignments();
      setFileUrlInput('');
      setSelectedAsgId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Assignments</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Submit practical assignments, benchmark reports, and project files</p>
      </div>

      <div className="space-y-6">
        {assignments.map((asg) => (
          <div key={asg.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-dark-800">
              <div>
                <span className="badge-blue mb-1">
                  Benchmarking Project
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{asg.title}</h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-dark-800 px-3 py-1.5 rounded-lg shrink-0">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>Due: {new Date(asg.due_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Instructions:</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{asg.instructions}</p>
            </div>

            {/* Rubric Breakdown */}
            <div className="bg-slate-50 dark:bg-dark-800/60 p-4 rounded-lg space-y-2 border border-slate-200/60 dark:border-dark-700">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Grading Rubric (100 Points Total):</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {asg.rubric?.map((r, i) => (
                  <div key={i} className="bg-white dark:bg-dark-900 p-3 rounded-md border border-slate-200 dark:border-dark-700">
                    <span className="font-bold text-brand-600 dark:text-brand-400 block text-xs">{r.points} Pts</span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight block mt-0.5">{r.criteria}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Status */}
            {asg.submission ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Submitted on {new Date(asg.submission.submitted_at).toLocaleDateString()}
                  </span>
                  {asg.submission.grade !== undefined && (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-xs rounded-md">
                      Grade: {asg.submission.grade} / 100
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate">
                  URL: {asg.submission.file_url}
                </p>
                {asg.submission.feedback && (
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/40 text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Instructor Feedback:</span>
                    <p className="text-slate-600 dark:text-slate-300 italic mt-0.5">{asg.submission.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="border border-dashed border-slate-300 dark:border-dark-700 rounded-xl p-6 text-center space-y-3 bg-slate-50/50 dark:bg-dark-950/40">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Submit Your Assignment URL / Repository Link
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Provide a valid link to your ZIP archive, GitHub repo, or PDF report
                    </p>
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <input
                      type="text"
                      placeholder="https://github.com/username/project-repo"
                      value={selectedAsgId === asg.id ? fileUrlInput : ''}
                      onChange={(e) => {
                        setSelectedAsgId(asg.id);
                        setFileUrlInput(e.target.value);
                      }}
                      className="form-input"
                    />
                    <button
                      onClick={() => handleSubmit(asg.id)}
                      disabled={isSubmitting || !fileUrlInput.trim()}
                      className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all disabled:opacity-50"
                    >
                      Submit Assignment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

