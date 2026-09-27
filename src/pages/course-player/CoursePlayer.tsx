import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  CheckCircle2,
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
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Send,
  ThumbsUp,
  Plus,
} from 'lucide-react';
import { INITIAL_COURSES } from '../../utils/demoData';
import { getCompletedLectures, toggleLectureCompleted, getDiscussions, createDiscussionThread } from '../../utils/storage';
import { useCourseStore } from '../../store/courseStore';

export const CoursePlayer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toggleAiDrawer } = useCourseStore();

  const courseId = searchParams.get('courseId') || 'c1';
  const requestedLectureId = searchParams.get('lectureId');

  const course = INITIAL_COURSES.find((c) => c.id === courseId) || INITIAL_COURSES[0];
  const allLectures = course.modules.flatMap((m) => m.lectures);

  const [activeLectureId, setActiveLectureId] = useState<string>(
    requestedLectureId || (allLectures[0] ? allLectures[0].id : 'c1-l1')
  );

  const activeLecture = allLectures.find((l) => l.id === activeLectureId) || allLectures[0];
  const activeModule = course.modules.find((m) => m.lectures.some((l) => l.id === activeLecture.id));

  const [completedList, setCompletedList] = useState<string[]>(getCompletedLectures());
  const isCompleted = completedList.includes(activeLecture.id);

  // Video controls state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 480; // 8 minutes demo video
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'transcript' | 'notes' | 'bookmarks' | 'resources' | 'discussion'>('transcript');
  const [notes, setNotes] = useState<{ id: string; timestamp: string; text: string }[]>([
    { id: 'n1', timestamp: '02:15', text: 'Quicksort uses divide-and-conquer strategy with pivot comparison.' },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  const [bookmarks, setBookmarks] = useState<{ id: string; timestamp: string }[]>([
    { id: 'b1', timestamp: '03:40' },
  ]);

  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (requestedLectureId && requestedLectureId !== activeLectureId) {
      setActiveLectureId(requestedLectureId);
    }
  }, [requestedLectureId]);

  const handleToggleComplete = () => {
    const res = toggleLectureCompleted(activeLecture.id);
    setCompletedList(res.allCompleted);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const ts = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    setNotes((prev) => [...prev, { id: `note-${Date.now()}`, timestamp: ts, text: newNoteText.trim() }]);
    setNewNoteText('');
  };

  const handleAddBookmark = () => {
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const ts = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    setBookmarks((prev) => [...prev, { id: `bm-${Date.now()}`, timestamp: ts }]);
  };

  const currentIdx = allLectures.findIndex((l) => l.id === activeLecture.id);
  const prevLecture = currentIdx > 0 ? allLectures[currentIdx - 1] : null;
  const nextLecture = currentIdx < allLectures.length - 1 ? allLectures[currentIdx + 1] : null;

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/catalog" className="hover:text-brand-600 font-medium">Courses</Link>
            <span>/</span>
            <Link to={`/courses/${course.id}`} className="hover:text-brand-600 font-medium">{course.title}</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{activeLecture.title}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {activeLecture.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAiDrawer(true)}
            className="btn-primary"
          >
            <Sparkles className="w-4 h-4" /> Ask AI Tutor
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video & Content Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Polished Video Player Placeholder UI */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-xl aspect-video border border-slate-800 flex flex-col justify-between p-6">
            <div className="flex justify-between items-center text-white/80 text-xs">
              <span className="font-mono bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                {course.title}
              </span>
              <span className="font-bold text-amber-400">Interactive Demo Player</span>
            </div>

            {/* Video Content Canvas Placeholder */}
            <div className="text-center space-y-3 my-auto">
              <div className="w-16 h-16 rounded-full bg-brand-600/90 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-600/30 cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white translate-x-0.5" />}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">{activeLecture.title}</h3>
                <p className="text-xs text-slate-300">Instructor: {course.instructor}</p>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="bg-slate-900/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 space-y-2 text-white text-xs">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div className="bg-brand-500 h-full w-1/3 rounded-full" />
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-brand-400">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} className="hover:text-brand-400">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-[10px] sm:text-[11px] text-slate-300">03:20 / {activeLecture.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleAddBookmark} className="px-2 py-0.5 sm:py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] sm:text-[11px] font-semibold flex items-center gap-1">
                    <Bookmark className="w-3 h-3" /> Bookmark
                  </button>
                  <div className="flex bg-white/10 rounded-lg p-0.5 text-[9px] sm:text-[10px] font-bold">
                    {[1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1 sm:px-1.5 py-0.5 rounded ${playbackSpeed === spd ? 'bg-brand-600 text-white' : 'text-slate-300'}`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row & Navigation */}
          <div className="bg-white dark:bg-dark-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {prevLecture && (
                <button
                  onClick={() => navigate(`/course-player?courseId=${course.id}&lectureId=${prevLecture.id}`)}
                  className="btn-secondary h-9 px-3 text-xs font-semibold flex-1 sm:flex-none justify-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </button>
              )}
              {nextLecture && (
                <button
                  onClick={() => navigate(`/course-player?courseId=${course.id}&lectureId=${nextLecture.id}`)}
                  className="btn-secondary h-9 px-3 text-xs font-semibold flex-1 sm:flex-none justify-center"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleToggleComplete}
              className={`h-9 px-4 text-xs font-bold w-full sm:w-auto justify-center ${isCompleted ? 'btn-secondary text-emerald-600' : 'btn-primary'}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-200 dark:border-dark-800 text-xs font-semibold bg-slate-50 dark:bg-dark-950 overflow-x-auto">
              {(['transcript', 'notes', 'bookmarks', 'resources', 'discussion'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 capitalize transition-colors shrink-0 ${
                    activeTab === tab
                      ? 'border-brand-600 text-brand-600 font-bold bg-white dark:bg-dark-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab} {tab === 'notes' ? `(${notes.length})` : tab === 'bookmarks' ? `(${bookmarks.length})` : ''}
                </button>
              ))}
            </div>

            <div className="p-5 text-xs text-slate-700 dark:text-slate-300">
              {activeTab === 'transcript' && (
                <p className="leading-relaxed whitespace-pre-wrap font-sans text-slate-600 dark:text-slate-300">
                  {activeLecture.transcript}
                </p>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a note for this lecture..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="form-input flex-1 text-xs"
                    />
                    <button type="submit" className="btn-primary h-9 px-3 text-xs shrink-0">
                      Save Note
                    </button>
                  </form>

                  <div className="space-y-2">
                    {notes.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 dark:bg-dark-800 rounded-lg border border-slate-200 dark:border-dark-700 flex items-start gap-3">
                        <span className="px-2 py-0.5 bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-mono font-bold text-[10px] rounded shrink-0">
                          {n.timestamp}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'bookmarks' && (
                <div className="space-y-2">
                  {bookmarks.map((bm) => (
                    <div key={bm.id} className="p-3 bg-slate-50 dark:bg-dark-800 rounded-lg border border-slate-200 dark:border-dark-700 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Bookmark saved at {bm.timestamp}</span>
                      <button className="btn-secondary h-7 text-[11px]">Jump to Time</button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-2">
                  {activeLecture.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 dark:bg-dark-800 rounded-lg border border-slate-200 dark:border-dark-700 flex items-center justify-between hover:border-brand-500 transition-colors"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-600" /> {res.title}
                      </span>
                      <Download className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">Ask a question or share thoughts about this specific lecture with fellow students.</p>
                  <Link to="/discussions" className="btn-primary inline-flex text-xs">
                    <MessageSquare className="w-4 h-4" /> Open Discussion Board
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Syllabus Navigation Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-dark-900 p-4 rounded-xl border border-slate-200 dark:border-dark-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-dark-800">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Course Curriculum
              </h3>
              <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">
                {course.modules.length} Modules
              </span>
            </div>

            <div className="space-y-2.5">
              {course.modules.map((mod, modIdx) => {
                const isCollapsed = collapsedModules[mod.id];
                return (
                  <div key={mod.id} className="border border-slate-200 dark:border-dark-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setCollapsedModules((prev) => ({ ...prev, [mod.id]: !prev[mod.id] }))}
                      className="w-full p-2.5 bg-slate-50 dark:bg-dark-800 flex items-center justify-between text-left text-xs font-bold text-slate-900 dark:text-slate-100"
                    >
                      <span>Module {modIdx + 1}: {mod.title}</span>
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>

                    {!isCollapsed && (
                      <div className="divide-y divide-slate-100 dark:divide-dark-800 bg-white dark:bg-dark-900">
                        {mod.lectures.map((lec) => {
                          const isCurrent = activeLecture.id === lec.id;
                          const isDone = completedList.includes(lec.id);
                          return (
                            <div
                              key={lec.id}
                              onClick={() => navigate(`/course-player?courseId=${course.id}&lectureId=${lec.id}`)}
                              className={`p-2.5 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                                isCurrent
                                  ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold'
                                  : 'hover:bg-slate-50 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                                )}
                                <span className="truncate">{lec.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono shrink-0">{lec.duration}</span>
                            </div>
                          );
                        })}
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
