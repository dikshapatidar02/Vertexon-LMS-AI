import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  CheckCircle,
  Circle,
  Bookmark,
  FileText,
  Sparkles,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Maximize,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useCourseStore } from '../../store/courseStore';
import { api } from '../../utils/api';

export const CoursePlayer: React.FC = () => {
  const { activeCourse, activeLecture, setActiveLecture, toggleAiDrawer, setActiveCourse } = useCourseStore();
  const [activeTab, setActiveTab] = useState<'transcript' | 'notes' | 'bookmarks' | 'resources'>('transcript');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const [notes, setNotes] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [completedLecturesMap, setCompletedLecturesMap] = useState<Record<string, boolean>>({});

  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeCourse) {
      api.get('/courses/crs-dsa-001').then((res) => {
        setActiveCourse(res.data.course);
      });
    }
  }, []);

  useEffect(() => {
    if (activeLecture) {
      fetchNotesAndBookmarks(activeLecture.id);
    }
  }, [activeLecture?.id]);

  const fetchNotesAndBookmarks = async (lectureId: string) => {
    try {
      const [notesRes, bmRes] = await Promise.all([
        api.get(`/lectures/${lectureId}/notes`),
        api.get(`/lectures/${lectureId}/bookmarks`),
      ]);
      setNotes(notesRes.data.notes || []);
      setBookmarks(bmRes.data.bookmarks || []);
    } catch (e) {
      setNotes([
        { id: 'note-1', timestamp_seconds: 140, content: 'Pivot selection degrades to O(n^2) on sorted arrays.' },
      ]);
      setBookmarks([{ id: 'bm-1', timestamp_seconds: 210 }]);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleJumpToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeLecture) return;

    try {
      const secs = Math.floor(currentTime);
      const res = await api.post(`/lectures/${activeLecture.id}/notes`, {
        timestamp_seconds: secs,
        content: newNoteText.trim(),
      });
      setNotes((prev) => [...prev, res.data.note]);
      setNewNoteText('');
    } catch (e) {
      setNotes((prev) => [
        ...prev,
        { id: `note-${Date.now()}`, timestamp_seconds: Math.floor(currentTime), content: newNoteText.trim() },
      ]);
      setNewNoteText('');
    }
  };

  const handleAddBookmark = async () => {
    if (!activeLecture) return;
    const secs = Math.floor(currentTime);
    try {
      const res = await api.post(`/lectures/${activeLecture.id}/bookmarks`, {
        timestamp_seconds: secs,
      });
      setBookmarks((prev) => [...prev, res.data.bookmark]);
    } catch (e) {
      setBookmarks((prev) => [...prev, { id: `bm-${Date.now()}`, timestamp_seconds: secs }]);
    }
  };

  const handleToggleComplete = async (lectureId: string) => {
    const nextCompleted = !completedLecturesMap[lectureId];
    setCompletedLecturesMap((prev) => ({ ...prev, [lectureId]: nextCompleted }));

    try {
      await api.post(`/lectures/${lectureId}/progress`, {
        watched_seconds: Math.floor(currentTime),
        completed: nextCompleted,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleModuleCollapse = (moduleId: string) => {
    setCollapsedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {activeCourse?.category || 'Computer Science'}
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {activeCourse?.title || 'Advanced Data Structures & Algorithms'}
          </h1>
        </div>

        <button
          onClick={() => toggleAiDrawer(true)}
          className="btn-primary"
        >
          <Sparkles className="w-4 h-4" /> Ask AI Tutor
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video & Content Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dark Video Player */}
          <div className="relative bg-slate-950 rounded-xl overflow-hidden shadow-sm aspect-video border border-slate-800">
            <video
              ref={videoRef}
              src={activeLecture?.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => activeLecture && handleToggleComplete(activeLecture.id)}
              className="w-full h-full object-contain"
            />

            {/* Clean Video Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3.5 flex flex-col gap-2 text-white">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleJumpToTime(Number(e.target.value))}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={handlePlayPause} className="hover:text-brand-400 transition-colors">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }}
                    className="hover:text-brand-400"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-[11px] text-slate-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddBookmark}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" /> Bookmark
                  </button>

                  <div className="flex bg-white/10 rounded p-0.5 text-[10px] font-semibold">
                    {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`px-1.5 py-0.5 rounded transition-colors ${playbackSpeed === spd ? 'bg-brand-600 text-white' : 'hover:text-slate-200'}`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lecture Info Header */}
          <div className="flex items-center justify-between p-4 glass-card">
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {activeLecture?.title || 'Quicksort & Pivot Selection Strategies'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Duration: {Math.floor((activeLecture?.duration_seconds || 420) / 60)} minutes
              </p>
            </div>
            <button
              onClick={() => activeLecture && handleToggleComplete(activeLecture.id)}
              className={activeLecture && completedLecturesMap[activeLecture.id] ? 'btn-secondary text-emerald-600' : 'btn-primary'}
            >
              <CheckCircle className="w-4 h-4" />
              {activeLecture && completedLecturesMap[activeLecture.id] ? 'Completed' : 'Mark Complete'}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="glass-card overflow-hidden">
            <div className="flex border-b border-slate-200 dark:border-dark-800 text-xs font-semibold bg-slate-50 dark:bg-dark-950">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'transcript'
                    ? 'border-brand-600 text-brand-600 font-bold bg-white dark:bg-dark-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Transcript
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-brand-600 text-brand-600 font-bold bg-white dark:bg-dark-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'bookmarks'
                    ? 'border-brand-600 text-brand-600 font-bold bg-white dark:bg-dark-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Bookmarks ({bookmarks.length})
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-3 border-b-2 transition-colors ${
                  activeTab === 'resources'
                    ? 'border-brand-600 text-brand-600 font-bold bg-white dark:bg-dark-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Resources & Downloads
              </button>
            </div>

            <div className="p-4 text-xs text-slate-700 dark:text-slate-300">
              {activeTab === 'transcript' && (
                <p className="leading-relaxed whitespace-pre-wrap font-sans text-slate-600 dark:text-slate-400">
                  {activeLecture?.transcript || 'Welcome to this lecture on Quicksort algorithm. In this session we break down pivot selection tactics and time complexity analysis...'}
                </p>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Add note at ${formatTime(currentTime)}...`}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="form-input flex-1"
                    />
                    <button type="submit" className="btn-primary shrink-0">
                      Save Note
                    </button>
                  </form>

                  <div className="space-y-2">
                    {notes.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-dark-800/60 rounded-lg border border-slate-200 dark:border-dark-700"
                      >
                        <button
                          onClick={() => handleJumpToTime(n.timestamp_seconds)}
                          className="px-2 py-0.5 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono font-bold text-[10px] rounded hover:underline"
                        >
                          {formatTime(n.timestamp_seconds)}
                        </button>
                        <p className="flex-1 text-slate-800 dark:text-slate-200">{n.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="space-y-2">
                  {bookmarks.length === 0 ? (
                    <p className="text-slate-400">No bookmarks saved for this lecture yet.</p>
                  ) : (
                    bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-800/60 rounded-lg border border-slate-200 dark:border-dark-700"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Bookmark at {formatTime(bm.timestamp_seconds)}
                        </span>
                        <button
                          onClick={() => handleJumpToTime(bm.timestamp_seconds)}
                          className="btn-secondary h-7 text-[11px]"
                        >
                          Jump To Timestamp
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-2">
                  {(activeLecture?.resource_urls || ['https://example.com/slides.pdf', 'https://example.com/code.py']).map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-800/60 rounded-lg border border-slate-200 dark:border-dark-700 hover:border-brand-500/50 transition-colors"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-600" />
                        Lecture Resource #{i + 1} ({url.endsWith('.pdf') ? 'PDF Document' : 'Code File'})
                      </span>
                      <Download className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Syllabus Navigation Sidebar */}
        <div className="space-y-4">
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-dark-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Course Syllabus
              </h3>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">
                {activeCourse?.modules?.length || 1} Modules
              </span>
            </div>

            <div className="space-y-2.5">
              {(activeCourse?.modules || []).map((mod) => {
                const isCollapsed = collapsedModules[mod.id];
                return (
                  <div key={mod.id} className="border border-slate-200 dark:border-dark-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModuleCollapse(mod.id)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-dark-800 flex items-center justify-between text-left text-xs font-bold text-slate-900 dark:text-slate-100"
                    >
                      <span>{mod.title}</span>
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>

                    {!isCollapsed && (
                      <div className="divide-y divide-slate-100 dark:divide-dark-800">
                        {mod.lectures.map((lec) => {
                          const isCurrent = activeLecture?.id === lec.id;
                          const isDone = completedLecturesMap[lec.id];
                          return (
                            <div
                              key={lec.id}
                              onClick={() => setActiveLecture(lec)}
                              className={`p-2.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                                isCurrent
                                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                                  : 'hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isDone ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                                )}
                                <span className="line-clamp-1">{lec.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {Math.floor(lec.duration_seconds / 60)}m
                              </span>
                            </div>
                          );
                        })}

                        {mod.quizzes && mod.quizzes.length > 0 && (
                          <div className="p-2.5 bg-slate-50 dark:bg-dark-800/40 flex items-center justify-between text-xs">
                            <span className="font-semibold text-brand-600 flex items-center gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5" /> Module Quiz
                            </span>
                            <Link
                              to="/quizzes"
                              className="btn-primary h-6 px-2 text-[10px]"
                            >
                              Take Quiz
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
