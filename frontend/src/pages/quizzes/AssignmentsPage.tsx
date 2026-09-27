import React, { useState } from 'react';
import { FileCheck2, UploadCloud, Calendar, CheckCircle2, Clock, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { INITIAL_ASSIGNMENTS } from '../../utils/demoData';
import { getAssignmentSubmissions, saveAssignmentSubmission, SavedAssignmentSubmission } from '../../utils/storage';

export const AssignmentsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SavedAssignmentSubmission[]>(getAssignmentSubmissions());
  const [activeAsgId, setActiveAsgId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSubmitFile = (asgId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!fileNameInput.trim()) return;

    const updated = saveAssignmentSubmission({
      assignmentId: asgId,
      submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileName: fileNameInput.trim(),
      fileSize: '3.1 MB',
      notes: notesInput.trim() || 'Submitted via Demo Assignment Portal',
      status: 'Submitted',
    });

    setSubmissions(updated);
    setActiveAsgId(null);
    setFileNameInput('');
    setNotesInput('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-dark-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-brand-600" /> Course Assignments & Submissions
          </h1>
          <p className="text-xs text-slate-500">Submit benchmark reports, code packages, and view faculty evaluation feedback.</p>
        </div>

        {uploadSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Assignment Submitted Successfully!
          </div>
        )}
      </div>

      <div className="space-y-6">
        {INITIAL_ASSIGNMENTS.map((asg) => {
          const userSub = submissions.find((s) => s.assignmentId === asg.id);
          const isModalOpen = activeAsgId === asg.id;

          return (
            <div key={asg.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-dark-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {asg.courseTitle}
                    </span>
                    {userSub ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {userSub.status}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        Pending Submission
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{asg.title}</h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-dark-800 px-3 py-1.5 rounded-lg shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" />
                  <span>Due: {asg.dueDate}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Instructions:</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{asg.instructions}</p>
              </div>

              {/* Rubric Breakdown */}
              <div className="bg-slate-50 dark:bg-dark-800/60 p-4 rounded-xl space-y-2 border border-slate-200/60 dark:border-dark-700">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Grading Rubric (Total {asg.totalPoints} Points):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {asg.rubric?.map((r, i) => (
                    <div key={i} className="bg-white dark:bg-dark-900 p-3 rounded-lg border border-slate-200 dark:border-dark-700">
                      <span className="font-bold text-brand-600 dark:text-brand-400 block text-xs">{r.points} Pts</span>
                      <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight block mt-0.5">{r.criteria}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission State or Form */}
              {userSub ? (
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Submission Recorded on {userSub.submittedAt}
                    </span>
                    {userSub.grade && (
                      <span className="px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-lg shadow-sm">
                        Grade: {userSub.grade}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p><span className="font-semibold">File Attached:</span> {userSub.fileName} ({userSub.fileSize})</p>
                    {userSub.notes && <p><span className="font-semibold">Student Notes:</span> {userSub.notes}</p>}
                  </div>
                  {userSub.feedback && (
                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/40 text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">Faculty Feedback:</span>
                      <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">{userSub.feedback}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {!isModalOpen ? (
                    <button
                      onClick={() => setActiveAsgId(asg.id)}
                      className="btn-primary w-full h-10 text-xs font-semibold"
                    >
                      <UploadCloud className="w-4 h-4" /> Open Submission Panel
                    </button>
                  ) : (
                    <form onSubmit={(e) => handleSubmitFile(asg.id, e)} className="p-4 bg-slate-50 dark:bg-dark-950 rounded-xl border border-slate-200 dark:border-dark-700 space-y-3">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-brand-600" /> Upload Demo Submission File
                      </h4>

                      <div className="space-y-1">
                        <label className="form-label">File Name / Repository URL</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. neural_network_analysis.pdf or github.com/user/repo"
                          value={fileNameInput}
                          onChange={(e) => setFileNameInput(e.target.value)}
                          className="form-input text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="form-label">Submission Notes (Optional)</label>
                        <textarea
                          rows={2}
                          placeholder="Add comments or instructions for the instructor..."
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          className="form-input text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveAsgId(null)}
                          className="btn-secondary h-8 px-3 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary h-8 px-3 text-xs"
                        >
                          Confirm & Submit File
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
