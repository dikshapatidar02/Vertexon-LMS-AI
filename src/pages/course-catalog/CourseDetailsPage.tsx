import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  PlayCircle,
  CheckCircle2,
  Star,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  FileText,
  Lock,
} from 'lucide-react';
import { INITIAL_COURSES } from '../../utils/demoData';
import { getEnrolledCourseIds, enrollInCourse, getCompletedLectures } from '../../utils/storage';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const course = INITIAL_COURSES.find((c) => c.id === id) || INITIAL_COURSES[0];
  const [enrolledIds, setEnrolledIds] = useState<string[]>(getEnrolledCourseIds());
  const isEnrolled = enrolledIds.includes(course.id);
  const completedLectures = getCompletedLectures();

  const handleEnrollToggle = () => {
    if (!isEnrolled) {
      const updated = enrollInCourse(course.id);
      setEnrolledIds(updated);
    } else {
      navigate(`/course-player?courseId=${course.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/catalog" className="hover:text-brand-600 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Course Catalog
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{course.title}</span>
      </div>

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl relative overflow-hidden bg-gradient-to-br from-brand-900 via-slate-900 to-dark-950 text-white shadow-xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                {course.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                {course.difficulty}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
              {course.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-6 h-6 rounded-full ring-1 ring-white/30 object-cover"
                />
                <span className="font-medium text-white">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">({course.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{course.studentsEnrolled.toLocaleString()} students enrolled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>

          {/* Action Card Preview */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 space-y-4 text-white">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/15 bg-slate-900 group">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-lg" />
              </div>
            </div>

            <button
              onClick={handleEnrollToggle}
              className="w-full h-11 btn-primary text-sm font-bold shadow-lg"
            >
              {isEnrolled ? (
                <>
                  <PlayCircle className="w-4 h-4" /> Continue Learning
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Enroll in Demo Course
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-300 font-medium">
              ✓ Full Lifetime Access &nbsp;•&nbsp; Certificate of Completion included
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Objectives & Curriculum */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Objectives */}
          <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" /> What You Will Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              {course.learningObjectives.map((obj, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Accordion / List */}
          <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Course Curriculum</h2>
                <p className="text-xs text-slate-500">
                  {course.modules.length} Modules &nbsp;•&nbsp; {course.lecturesCount} Lectures &nbsp;•&nbsp; {course.duration} Total
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="border border-slate-200 dark:border-dark-700 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-dark-800/80 p-3.5 flex items-center justify-between border-b border-slate-200 dark:border-dark-700">
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        Module {modIdx + 1}: {mod.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{mod.description}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white dark:bg-dark-900 px-2 py-0.5 rounded border border-slate-200 dark:border-dark-700">
                      {mod.lectures.length} lectures
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-dark-800 bg-white dark:bg-dark-900">
                    {mod.lectures.map((lec) => {
                      const isCompleted = completedLectures.includes(lec.id);
                      return (
                        <div
                          key={lec.id}
                          onClick={() => navigate(`/course-player?courseId=${course.id}&lectureId=${lec.id}`)}
                          className="p-3 hover:bg-slate-50 dark:hover:bg-dark-800/50 flex items-center justify-between cursor-pointer transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                            )}
                            <span className={`font-medium truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                              {lec.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
                            <span>{lec.duration}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Instructor & Requirements */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Instructor</h3>
            <div className="flex items-center gap-3">
              <img
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{course.instructor}</h4>
                <p className="text-xs text-slate-500">Senior Academic AI Researcher & Lecturer</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Specialist in machine learning algorithms, scalable system architectures, and neural network optimization with over 10 years of industry experience.
            </p>
          </div>

          <div className="bg-white dark:bg-dark-900 p-6 rounded-xl border border-slate-200 dark:border-dark-800 space-y-3 shadow-sm text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">Course Requirements</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">• Basic understanding of programming concepts</li>
              <li className="flex items-center gap-2">• Computer with web browser</li>
              <li className="flex items-center gap-2">• Willingness to solve practice exercises</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
