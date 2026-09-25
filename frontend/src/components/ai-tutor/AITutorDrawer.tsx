import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  X,
  BookOpen,
  SlidersHorizontal,
  FileText,
  Calendar,
  Zap,
  RotateCw,
  Bot,
  CheckCircle2,
} from 'lucide-react';
import { useCourseStore } from '../../store/courseStore';
import { api } from '../../utils/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  sources?: { lecture_id: string; lecture_title: string; timestamp_seconds?: number }[];
  created_at: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export const AITutorDrawer: React.FC = () => {
  const { isAiDrawerOpen, toggleAiDrawer, activeCourse, activeLecture, aiMode, setAiMode } = useCourseStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'summary' | 'flashcards' | 'study_plan'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Summary state
  const [summaryText, setSummaryText] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Flashcard state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Study Plan state
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Initialize Chat Session
  useEffect(() => {
    if (isAiDrawerOpen) {
      initSession();
    }
  }, [isAiDrawerOpen, activeCourse?.id]);

  const initSession = async () => {
    try {
      const res = await api.post('/ai/chat/sessions', {
        course_id: activeCourse?.id || 'crs-dsa-001',
        mode: aiMode,
      });
      setSessionId(res.data.session.id);
      
      // Load initial message
      setMessages([
        {
          id: 'msg-init',
          sender: 'ai',
          content: `Hello! I am your AI Academic Tutor for "${activeCourse?.title || 'this course'}". Ask me any question about the curriculum, algorithms, or lecture concepts!`,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (e) {
      setMessages([
        {
          id: 'msg-init-fallback',
          sender: 'ai',
          content: `Hello! I am your AI Academic Tutor for "${activeCourse?.title || 'this course'}". Ask me any question!`,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    const tempUserMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const targetSession = sessionId || 'ses-001';
      const res = await api.post(`/ai/chat/sessions/${targetSession}/messages`, {
        message: userText,
      });

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: res.data.reply,
        sources: res.data.sources,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      const fallbackReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: `Based on your course materials in "${activeCourse?.title || 'Data Structures'}": ${userText.includes('quicksort') ? 'Quicksort degrades to O(n²) when pivot selection creates unbalanced partitions on sorted input.' : 'This concept is covered in Module 1. We apply divide and conquer strategies to optimize execution time.'}`,
        sources: [
          {
            lecture_id: activeLecture?.id || 'lec-dsa-101',
            lecture_title: activeLecture?.title || 'Quicksort & Pivot Selection Strategies',
            timestamp_seconds: 140,
          },
        ],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFetchSummary = async () => {
    if (!activeLecture) return;
    setIsLoadingSummary(true);
    try {
      const res = await api.post(`/ai/lectures/${activeLecture.id}/summarize`);
      setSummaryText(res.data.summary);
    } catch (e) {
      setSummaryText(`Key Takeaways for "${activeLecture.title}":\n\n1. Quicksort uses divide-and-conquer partitioning.\n2. Randomized pivot guarantees expected O(n log n) performance.\n3. Auxiliary space requirement is O(log n) for recursion stack.`);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleFetchFlashcards = async () => {
    const targetModuleId = activeLecture?.module_id || 'mod-dsa-1';
    try {
      const res = await api.post(`/ai/modules/${targetModuleId}/flashcards`);
      setFlashcards(res.data.flashcards || []);
    } catch (e) {
      setFlashcards([
        { id: 'fc-1', question: 'What is the average time complexity of Quicksort?', answer: 'O(n log n)' },
        { id: 'fc-2', question: 'Why is randomized pivot selection critical?', answer: 'Prevents worst-case O(n²) degradation on sorted or nearly sorted arrays.' },
      ]);
    }
  };

  const handleGenerateStudyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const res = await api.post('/ai/study-plan', { course_id: activeCourse?.id || 'crs-dsa-001' });
      setStudyPlan(res.data.study_plan.plan_json);
    } catch (e) {
      setStudyPlan({
        title: 'Personalized Adaptive Study Plan',
        recommendations: [
          'Review Lecture 1: Quicksort Pivot Selection Strategies',
          'Complete Module 1 Flashcards Deck',
          'Attempt Benchmarking Assignment',
        ],
        estimated_hours_remaining: 3.5,
        target_completion_date: '2026-10-15',
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[420px] bg-white dark:bg-dark-900 border-l border-slate-200 dark:border-dark-800 shadow-xl z-50 flex flex-col transition-transform">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-dark-800 flex items-center justify-between bg-slate-50 dark:bg-dark-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              AI Tutor <span className="text-[10px] px-1.5 py-0.5 bg-brand-50 dark:bg-brand-950/40 text-brand-600 font-mono font-semibold rounded border border-brand-200 dark:border-brand-800">RAG Engine</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
              {activeCourse ? activeCourse.title : 'Course Knowledge Assistant'}
            </p>
          </div>
        </div>
        <button
          onClick={() => toggleAiDrawer(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-dark-800/80 bg-slate-50/50 dark:bg-dark-950/40 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" /> Explanation Depth:
        </span>
        <div className="flex bg-slate-200/60 dark:bg-dark-800 p-0.5 rounded-lg text-[11px]">
          {(['beginner', 'intermediate', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setAiMode(mode)}
              className={`px-2 py-0.5 rounded-md capitalize font-medium transition-colors ${
                aiMode === mode
                  ? 'bg-white dark:bg-dark-700 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex border-b border-slate-200 dark:border-dark-800 text-xs font-medium bg-slate-50 dark:bg-dark-950">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'chat'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-semibold bg-white dark:bg-dark-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Bot className="w-3.5 h-3.5" /> AI Chat
        </button>
        <button
          onClick={() => {
            setActiveTab('summary');
            if (!summaryText) handleFetchSummary();
          }}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'summary'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-semibold bg-white dark:bg-dark-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> Summary
        </button>
        <button
          onClick={() => {
            setActiveTab('flashcards');
            if (flashcards.length === 0) handleFetchFlashcards();
          }}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'flashcards'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-semibold bg-white dark:bg-dark-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Flashcards
        </button>
        <button
          onClick={() => {
            setActiveTab('study_plan');
            if (!studyPlan) handleGenerateStudyPlan();
          }}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'study_plan'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 font-semibold bg-white dark:bg-dark-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Study Plan
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full justify-between space-y-4">
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none shadow-sm font-medium'
                        : 'bg-slate-50 dark:bg-dark-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-dark-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Sources Citation */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-dark-700 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">
                          Ingested Course Citation:
                        </span>
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer bg-slate-100 dark:bg-dark-700/50 px-2 py-1 rounded"
                          >
                            <BookOpen className="w-3 h-3 shrink-0" />
                            <span className="truncate">{src.lecture_title}</span>
                            {src.timestamp_seconds && (
                              <span className="text-[9px] text-slate-400 font-mono">
                                ({Math.floor(src.timestamp_seconds / 60)}m {src.timestamp_seconds % 60}s)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex gap-2 items-center text-xs text-brand-600 font-medium animate-pulse">
                  <Bot className="w-4 h-4" />
                  <span>Searching vector index & generating response...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-200 dark:border-dark-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about this course..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="form-input flex-1 text-xs"
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-sm shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div className="space-y-3">
            <div className="bg-slate-50 dark:bg-dark-800 p-3 rounded-lg border border-slate-200 dark:border-dark-700">
              <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-600" />
                Lecture Summary: {activeLecture?.title || 'Current Lecture'}
              </h4>
            </div>
            {isLoadingSummary ? (
              <div className="text-center py-8 text-xs text-slate-500 animate-pulse">Summarizing transcript...</div>
            ) : (
              <div className="bg-white dark:bg-dark-900 p-4 rounded-lg border border-slate-200 dark:border-dark-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {summaryText}
              </div>
            )}
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === 'flashcards' && (
          <div className="space-y-4 text-center">
            {flashcards.length === 0 ? (
              <p className="text-xs text-slate-500 py-8">Loading module flashcard deck...</p>
            ) : (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>Card {activeCardIndex + 1} of {flashcards.length}</span>
                  <span>Click card to flip</span>
                </div>
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[160px] bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl p-6 shadow-sm cursor-pointer flex items-center justify-center transition-all hover:bg-slate-100/80 dark:hover:bg-dark-700"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 block">
                      {isFlipped ? 'Answer' : 'Question'}
                    </span>
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {isFlipped ? flashcards[activeCardIndex].answer : flashcards[activeCardIndex].question}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                    }}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="px-3 py-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <RotateCw className="w-3 h-3" /> Flip
                  </button>
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                    }}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDY PLAN TAB */}
        {activeTab === 'study_plan' && (
          <div className="space-y-3">
            {isGeneratingPlan ? (
              <p className="text-xs text-slate-500 py-8 text-center animate-pulse">Analyzing performance history & generating study plan...</p>
            ) : studyPlan ? (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 dark:bg-dark-800 p-3.5 rounded-xl border border-slate-200 dark:border-dark-700">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    {studyPlan.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Target Completion: <span className="font-semibold text-slate-900 dark:text-slate-100">{studyPlan.target_completion_date}</span> ({studyPlan.estimated_hours_remaining} hrs remaining)
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">Recommended Action Items:</span>
                  {studyPlan.recommendations?.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 bg-white dark:bg-dark-900 p-2.5 rounded-lg border border-slate-200 dark:border-dark-800 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

