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
  Trash2,
  HelpCircle,
  BookMarked,
} from 'lucide-react';
import { useCourseStore } from '../../store/courseStore';

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
  
  // Context selector
  const [selectedContext, setSelectedContext] = useState<string>('course');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
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

  // Suggested prompt chips
  const SUGGESTED_QUESTIONS = [
    'Explain Quicksort average vs worst case time complexity',
    'What are vector embeddings in AI systems?',
    'How do attention mechanisms in Transformers work?',
    'What is the submission deadline for Module 1?',
  ];

  // Initialize Chat Session
  useEffect(() => {
    if (isAiDrawerOpen && messages.length === 0) {
      setMessages([
        {
          id: 'msg-init',
          sender: 'ai',
          content: `Hello! I am your AI Academic Tutor (Demo Mode). I am grounded in the content of "${activeCourse?.title || 'Data Structures & Algorithms Masterclass'}". Ask me any question about your curriculum, lectures, or code assignments!`,
          sources: [
            {
              lecture_id: activeLecture?.id || 'lec-dsa-101',
              lecture_title: activeLecture?.title || 'Lecture 1.1: Quicksort & Pivot Selection',
              timestamp_seconds: 140,
            },
          ],
          created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isAiDrawerOpen, activeCourse?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateDemoAiResponse = (userText: string): { reply: string; sources: any[] } => {
    const textLower = userText.toLowerCase();

    if (textLower.includes('quicksort') || textLower.includes('complexity') || textLower.includes('sort')) {
      return {
        reply: `**Quicksort Analysis & Complexity:**\n\n1. **Average & Best Case: O(n log n)**\n   Partitioning splits the array roughly in half at each step, yielding log(n) levels with n comparisons per level.\n\n2. **Worst Case: O(n²)**\n   Occurs when the pivot is consistently the smallest or largest element (e.g., sorted array with first element as pivot).\n\n3. **Mitigation Strategy:**\n   Use randomized pivot selection or the median-of-three heuristic to guarantee expected O(n log n) runtime.`,
        sources: [
          {
            lecture_id: 'l1',
            lecture_title: 'Quicksort & Pivot Selection Strategies',
            timestamp_seconds: 185,
          },
        ],
      };
    }

    if (textLower.includes('vector') || textLower.includes('embedding') || textLower.includes('rag')) {
      return {
        reply: `**Vector Embeddings & RAG Architecture:**\n\nVector embeddings convert unstructured text into high-dimensional mathematical dense vectors (e.g., 768 or 1536 dimensions). In our LMS, when you ask a question, we compute the cosine similarity between your query vector and stored transcript chunks to retrieve relevant course context!`,
        sources: [
          {
            lecture_id: 'l3',
            lecture_title: 'Vector Databases, Embeddings & RAG Pipelines',
            timestamp_seconds: 320,
          },
        ],
      };
    }

    if (textLower.includes('transformer') || textLower.includes('attention')) {
      return {
        reply: `**Transformer Multi-Head Self-Attention:**\n\nTransformers process tokens in parallel using Query (Q), Key (K), and Value (V) projections. The attention score matrix is computed as:\n\n\`Attention(Q,K,V) = softmax(Q·K^T / √d_k) · V\`\n\nMulti-head attention allows the model to attend to information from different representation subspaces simultaneously.`,
        sources: [
          {
            lecture_id: 'l2',
            lecture_title: 'Transformer Architecture & Self-Attention',
            timestamp_seconds: 410,
          },
        ],
      };
    }

    return {
      reply: `Based on your course materials in "${activeCourse?.title || 'Vertexon LMS'}":\n\nKey Concept Breakdown:\n• Focus on core principles covered in Module 1 & Module 2.\n• Review interactive flashcards and attempt the benchmarking assignment to reinforce your understanding.\n• Keep practicing with hands-on code examples!`,
      sources: [
        {
          lecture_id: activeLecture?.id || 'l1',
          lecture_title: activeLecture?.title || 'Core Lecture Concepts & Applications',
          timestamp_seconds: 90,
        },
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isSending) return;

    const userText = query.trim();
    if (!textToSend) setInputMessage('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: userText,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    setTimeout(() => {
      const responseData = generateDemoAiResponse(userText);
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: responseData.reply,
        sources: responseData.sources,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsSending(false);
    }, 600);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-init-reset',
        sender: 'ai',
        content: 'Conversation history cleared. Ask me any new question!',
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleFetchSummary = () => {
    setIsLoadingSummary(true);
    setTimeout(() => {
      setSummaryText(
        `Key Academic Takeaways:\n\n1. Quicksort uses divide-and-conquer partitioning with pivot comparison.\n2. Randomized pivot selection guarantees expected O(n log n) execution time.\n3. RAG pipelines convert course lectures into searchable semantic embeddings.\n4. Memory auxiliary complexity stays bounded to O(log n) stack depth.`
      );
      setIsLoadingSummary(false);
    }, 400);
  };

  const handleFetchFlashcards = () => {
    setFlashcards([
      { id: 'fc-1', question: 'What is the average time complexity of Quicksort?', answer: 'O(n log n)' },
      { id: 'fc-2', question: 'Why is randomized pivot selection critical?', answer: 'Prevents worst-case O(n²) degradation on pre-sorted arrays.' },
      { id: 'fc-3', question: 'What is Query-Key-Value projection in Attention?', answer: 'Linear matrix transformations mapping inputs to attention weights.' },
    ]);
  };

  const handleGenerateStudyPlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setStudyPlan({
        title: 'Adaptive AI Study Plan',
        recommendations: [
          'Review Lecture 1.1: Quicksort Pivot Selection Strategies',
          'Complete Module 1 Practice Quiz',
          'Submit Vector Embedding Analysis Assignment',
        ],
        estimated_hours_remaining: 3.5,
        target_completion_date: '2026-10-15',
      });
      setIsGeneratingPlan(false);
    }, 500);
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
              AI Tutor — <span className="text-brand-600 dark:text-brand-400">Demo</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              {activeCourse ? activeCourse.title : 'Course Knowledge Assistant'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-200/50 dark:hover:bg-dark-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleAiDrawer(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Context Selector & Depth Controls */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-dark-800/80 bg-slate-50/50 dark:bg-dark-950/40 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Context:</span>
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value)}
            className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-slate-200 text-[11px] rounded px-2 py-0.5 font-medium"
          >
            <option value="course">Full Course Curriculum</option>
            <option value="lecture">Current Active Lecture</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-brand-600" /> Explanation Depth:
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
                          Grounded Source Citation:
                        </span>
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-[11px] font-medium text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-dark-700/50 px-2 py-1 rounded"
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
                  <span>Searching course vector index & generating response...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Suggested Demo Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-700 transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="pt-2 border-t border-slate-200 dark:border-dark-800 flex gap-2"
            >
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
                Lecture Summary: {activeLecture?.title || 'Quicksort & Pivot Selection'}
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
              <p className="text-xs text-slate-500 py-8">Loading module flashcards...</p>
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
              <p className="text-xs text-slate-500 py-8 text-center animate-pulse">Generating personalized study plan...</p>
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
