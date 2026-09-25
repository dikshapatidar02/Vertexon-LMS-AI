import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, User, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { useCourseStore } from '../../store/courseStore';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url: string;
  price: number;
  instructor_name: string;
  total_modules: number;
  total_lectures: number;
  enrolled_count: number;
}

export const CourseCatalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledMap, setEnrolledMap] = useState<Record<string, boolean>>({});

  const { setActiveCourse } = useCourseStore();
  const navigate = useNavigate();

  const categories = ['All', 'Computer Science', 'Artificial Intelligence', 'Software Engineering', 'Emerging Tech'];

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
      if (searchQuery) params.q = searchQuery;

      const res = await api.get('/courses', { params });
      setCourses(res.data.courses || []);

      const enrRes = await api.get('/enrollments/me');
      const map: Record<string, boolean> = {};
      (enrRes.data.enrollments || []).forEach((e: any) => {
        map[e.course_id] = true;
      });
      setEnrolledMap(map);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setEnrolledMap((prev) => ({ ...prev, [courseId]: true }));
      const courseRes = await api.get(`/courses/${courseId}`);
      setActiveCourse(courseRes.data.course);
      navigate('/course-player');
    } catch (e) {
      navigate('/course-player');
    }
  };

  const handleOpenCourse = async (courseId: string) => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setActiveCourse(res.data.course);
      navigate('/course-player');
    } catch (e) {
      navigate('/course-player');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-dark-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Course Catalog
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
            className="form-input pl-8"
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
            className="h-8 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-800 rounded-lg px-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="All">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-200 dark:bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">No Courses Found</h3>
          <p className="text-xs text-slate-500">No courses match your selected search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isEnrolled = enrolledMap[course.id];
            return (
              <div
                key={course.id}
                className="glass-card overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <img
                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'}
                      alt={course.title}
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="badge badge-gray capitalize">
                        {course.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> {course.instructor_name || 'Faculty Member'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-slate-100 dark:border-dark-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.total_lectures || 4} Lectures
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => handleOpenCourse(course.id)}
                      className="btn-secondary w-full h-9"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resume Course
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="btn-primary w-full h-9"
                    >
                      Enroll Now <ArrowRight className="w-3.5 h-3.5" />
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
