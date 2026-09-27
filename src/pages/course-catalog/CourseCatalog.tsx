import React, { useState } from 'react';
import { Search, BookOpen, User, Clock, CheckCircle2, Sparkles, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_COURSES } from '../../utils/demoData';
import { getEnrolledCourseIds, enrollInCourse } from '../../utils/storage';
import { useCourseStore } from '../../store/courseStore';

export const CourseCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [enrolledIds, setEnrolledIds] = useState<string[]>(getEnrolledCourseIds());

  const { setActiveCourse } = useCourseStore();
  const navigate = useNavigate();

  const categories = ['All', 'Computer Science', 'Artificial Intelligence', 'Software Engineering', 'Cloud & DevOps'];

  const filteredCourses = INITIAL_COURSES.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const handleEnroll = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = enrollInCourse(courseId);
    setEnrolledIds(updated);
    const c = INITIAL_COURSES.find((item) => item.id === courseId);
    if (c) setActiveCourse(c as any);
    navigate(`/course-player?courseId=${courseId}`);
  };

  const handleOpenDetails = (courseId: string) => {
    const c = INITIAL_COURSES.find((item) => item.id === courseId);
    if (c) setActiveCourse(c as any);
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Course Catalog & Curriculum
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Academic & enterprise curriculum with embedded RAG AI Tutor grounding.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-8 text-xs"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'bg-white dark:bg-dark-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-dark-800 hover:bg-slate-50 dark:hover:bg-dark-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="h-8 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-lg px-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 font-medium"
          >
            <option value="All">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white dark:bg-dark-900 p-12 text-center rounded-xl border border-slate-200 dark:border-dark-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">No Courses Found</h3>
          <p className="text-xs text-slate-500">No courses match your selected search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <div
                key={course.id}
                onClick={() => handleOpenDetails(course.id)}
                className="bg-white dark:bg-dark-900 rounded-xl border border-slate-200 dark:border-dark-800 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
              >
                <div>
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm">
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                        {course.instructor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-slate-100 dark:border-dark-800 space-y-3 bg-slate-50/50 dark:bg-dark-950/40">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.lecturesCount} Lectures ({course.duration})
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-player?courseId=${course.id}`);
                      }}
                      className="btn-secondary w-full h-9 text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleEnroll(course.id, e)}
                      className="btn-primary w-full h-9 text-xs font-semibold"
                    >
                      Enroll in Demo <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
