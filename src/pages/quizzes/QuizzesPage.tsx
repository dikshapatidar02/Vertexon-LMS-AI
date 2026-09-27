import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, Clock, Award, RotateCcw, ArrowRight, XCircle, ChevronRight } from 'lucide-react';
import { INITIAL_QUIZZES } from '../../utils/demoData';
import { saveQuizResult, getQuizResults, QuizResultRecord } from '../../utils/storage';

export const QuizzesPage: React.FC = () => {
  const quizzes = INITIAL_QUIZZES;
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0].id);
  const activeQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];

  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [result, setResult] = useState<QuizResultRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pastResults = getQuizResults();

  const handleSelectMCQ = (qId: number, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleToggleMultiSelect = (qId: number, optIdx: number) => {
    const current = (userAnswers[qId] as number[]) || [];
    const updated = current.includes(optIdx) ? current.filter((i) => i !== optIdx) : [...current, optIdx];
    setUserAnswers((prev) => ({ ...prev, [qId]: updated }));
  };

  const handleTextAnswer = (qId: number, text: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      let correct = 0;
      activeQuiz.questions.forEach((q) => {
        const uAns = userAnswers[q.id];
        if (q.type === 'mcq') {
          if (uAns === q.correctAnswer) correct += 1;
        } else if (q.type === 'multi_select') {
          if (Array.isArray(uAns) && Array.isArray(q.correctAnswers)) {
            const match = uAns.length === q.correctAnswers.length && uAns.every((val) => q.correctAnswers?.includes(val));
            if (match) correct += 1;
          }
        } else if (q.type === 'short_answer') {
          if (typeof uAns === 'string' && uAns.trim().length > 3) {
            correct += 1;
          }
        }
      });

      const total = activeQuiz.questions.length;
      const pct = Math.round((correct / total) * 100);
      const resRecord: QuizResultRecord = {
        quizId: activeQuiz.id,
        score: correct,
        totalQuestions: total,
        percentage: pct,
        completedAt: new Date().toLocaleDateString(),
        passed: pct >= 70,
        userAnswers: userAnswers,
      };

      saveQuizResult(resRecord);
      setResult(resRecord);
      setIsSubmitting(false);
    }, 400);
  };

  const handleRetry = () => {
    setUserAnswers({});
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-dark-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-brand-600" /> Interactive Knowledge Quizzes
          </h1>
          <p className="text-xs text-slate-500">Test your mastery with instant automated evaluation and detailed answer reviews.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Select Quiz:</label>
          <select
            value={selectedQuizId}
            onChange={(e) => {
              setSelectedQuizId(e.target.value);
              setUserAnswers({});
              setResult(null);
            }}
            className="form-input text-xs font-semibold"
          >
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result ? (
        /* Results View */
        <div className="bg-white dark:bg-dark-900 p-8 rounded-xl border border-slate-200 dark:border-dark-800 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Quiz Completed!</h2>
            <p className="text-xs text-slate-500">Your score has been evaluated and recorded locally.</p>
          </div>

          <div className="inline-block p-6 bg-slate-50 dark:bg-dark-800/80 rounded-2xl border border-slate-200 dark:border-dark-700 min-w-[240px]">
            <span className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">
              {result.percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mt-1">
              ({result.score} of {result.totalQuestions} Questions Correct)
            </span>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleRetry}
              className="btn-primary h-10 px-5 text-xs font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retry Quiz
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Questions List */
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-dark-950/60 p-4 rounded-xl border border-slate-200 dark:border-dark-800 flex items-center justify-between text-xs">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{activeQuiz.title}</h2>
              <p className="text-slate-500">{activeQuiz.courseTitle} &nbsp;•&nbsp; {activeQuiz.questions.length} Questions</p>
            </div>
            <span className="px-3 py-1 bg-white dark:bg-dark-900 font-bold border border-slate-200 dark:border-dark-700 rounded-lg text-slate-700 dark:text-slate-300">
              Time Limit: {activeQuiz.timeLimitMinutes} Mins
            </span>
          </div>

          <div className="space-y-5">
            {activeQuiz.questions.map((q, idx) => (
              <div key={q.id} className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{q.prompt}</h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 dark:bg-dark-800 text-slate-500 rounded border border-slate-200 dark:border-dark-700 shrink-0">
                        {q.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multiple Choice Options */}
                {q.type === 'mcq' && (
                  <div className="space-y-2 pl-9">
                    {q.options?.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectMCQ(q.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-900 dark:text-brand-200 font-semibold shadow-sm'
                              : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-800'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300 dark:border-dark-600'}`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Multiple Select Options */}
                {q.type === 'multi_select' && (
                  <div className="space-y-2 pl-9">
                    {q.options?.map((opt, optIdx) => {
                      const currentArr = (userAnswers[q.id] as number[]) || [];
                      const isSelected = currentArr.includes(optIdx);
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleToggleMultiSelect(q.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-900 dark:text-brand-200 font-semibold shadow-sm'
                              : 'bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-800'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-300 dark:border-dark-600'}`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Short Answer Input */}
                {q.type === 'short_answer' && (
                  <div className="pl-9">
                    <input
                      type="text"
                      placeholder="Type your answer explanation..."
                      value={userAnswers[q.id] || ''}
                      onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                      className="form-input text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="btn-primary h-11 px-6 text-xs font-bold"
            >
              {isSubmitting ? 'Evaluating Score...' : 'Submit Assessment'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
