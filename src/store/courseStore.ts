import { create } from 'zustand';

export interface Lecture {
  id: string;
  module_id: string;
  title: string;
  video_url: string;
  transcript: string;
  duration_seconds: number;
  order_index: number;
  resource_urls: string[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lectures: Lecture[];
  quizzes?: any[];
}

export interface CourseDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url: string;
  instructor_name: string;
  modules: Module[];
}

interface CourseState {
  activeCourse: CourseDetail | null;
  activeLecture: Lecture | null;
  isAiDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  aiMode: 'beginner' | 'intermediate' | 'advanced';
  setActiveCourse: (course: CourseDetail) => void;
  setActiveLecture: (lecture: Lecture) => void;
  toggleAiDrawer: (open?: boolean) => void;
  toggleMobileMenu: (open?: boolean) => void;
  setAiMode: (mode: 'beginner' | 'intermediate' | 'advanced') => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  activeCourse: null,
  activeLecture: null,
  isAiDrawerOpen: false,
  isMobileMenuOpen: false,
  aiMode: 'intermediate',

  setActiveCourse: (course) => {
    let firstLecture: Lecture | null = null;
    if (course.modules && course.modules.length > 0 && course.modules[0].lectures.length > 0) {
      firstLecture = course.modules[0].lectures[0];
    }
    set({ activeCourse: course, activeLecture: firstLecture });
  },

  setActiveLecture: (lecture) => set({ activeLecture: lecture }),
  toggleAiDrawer: (open) => set((state) => ({ isAiDrawerOpen: open !== undefined ? open : !state.isAiDrawerOpen })),
  toggleMobileMenu: (open) => set((state) => ({ isMobileMenuOpen: open !== undefined ? open : !state.isMobileMenuOpen })),
  setAiMode: (aiMode) => set({ aiMode }),
}));
