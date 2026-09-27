import { DEMO_USERS, INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_QUIZZES, INITIAL_NOTIFICATIONS, INITIAL_DISCUSSIONS, INITIAL_ACHIEVEMENTS } from './demoData';

export interface SavedAssignmentSubmission {
  id: string;
  assignmentId: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  notes: string;
  status: 'Submitted' | 'Graded';
  grade?: string;
  feedback?: string;
}

export interface QuizResultRecord {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  passed: boolean;
  userAnswers: Record<string, any>;
}

export interface SavedDiscussionThread {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies: {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorRole: string;
    createdAt: string;
    content: string;
    likesCount: number;
  }[];
}

export interface SavedNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'assignment' | 'course' | 'quiz' | 'certificate' | 'announcement';
  read: boolean;
  link?: string;
}

export interface UserSettingsData {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  assignmentReminders: boolean;
  discussionUpdates: boolean;
  announcementAlerts: boolean;
  language: string;
  autoPlayNextLecture: boolean;
  defaultVideoQuality: string;
}

const STORAGE_KEYS = {
  ENROLLED_COURSES: 'vertexon_enrolled_courses',
  COMPLETED_LECTURES: 'vertexon_completed_lectures',
  COURSE_PROGRESS: 'vertexon_course_progress',
  QUIZ_RESULTS: 'vertexon_quiz_results',
  ASSIGNMENT_SUBMISSIONS: 'vertexon_assignment_submissions',
  NOTIFICATIONS: 'vertexon_notifications',
  DISCUSSIONS: 'vertexon_discussions',
  USER_SETTINGS: 'vertexon_user_settings',
  PROFILE_EDITS: 'vertexon_profile_edits',
};

// --- Enrolled Courses ---
export const getEnrolledCourseIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENROLLED_COURSES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading enrolled courses', e);
  }
  return ['c1', 'c2']; // default enrolled
};

export const enrollInCourse = (courseId: string): string[] => {
  const current = getEnrolledCourseIds();
  if (!current.includes(courseId)) {
    const updated = [...current, courseId];
    localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(updated));
    return updated;
  }
  return current;
};

// --- Completed Lectures ---
export const getCompletedLectures = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_LECTURES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading completed lectures', e);
  }
  return ['c1-l1', 'c1-l2', 'c1-l3'];
};

export const toggleLectureCompleted = (lectureId: string): { completed: boolean; allCompleted: string[] } => {
  const current = getCompletedLectures();
  let updated: string[];
  let isNowCompleted = false;

  if (current.includes(lectureId)) {
    updated = current.filter((id) => id !== lectureId);
  } else {
    updated = [...current, lectureId];
    isNowCompleted = true;
  }

  localStorage.setItem(STORAGE_KEYS.COMPLETED_LECTURES, JSON.stringify(updated));
  return { completed: isNowCompleted, allCompleted: updated };
};

// --- Quiz Results ---
export const getQuizResults = (): Record<string, QuizResultRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading quiz results', e);
  }
  return {
    q1: {
      quizId: 'q1',
      score: 3,
      totalQuestions: 3,
      percentage: 100,
      completedAt: '2026-09-20',
      passed: true,
      userAnswers: { 1: 0, 2: [0, 1, 2], 3: 'Machine learning uses data...' },
    },
  };
};

export const saveQuizResult = (result: QuizResultRecord) => {
  const current = getQuizResults();
  current[result.quizId] = result;
  localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(current));
  return current;
};

// --- Assignment Submissions ---
export const getAssignmentSubmissions = (): SavedAssignmentSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading assignment submissions', e);
  }
  return [
    {
      id: 'sub-1',
      assignmentId: 'a1',
      submittedAt: '2026-09-24 14:30',
      fileName: 'neural_network_arch_analysis.pdf',
      fileSize: '2.4 MB',
      notes: 'Completed all required components and extra credit visualization.',
      status: 'Graded',
      grade: '98/100',
      feedback: 'Excellent work on the vector diagram and multi-head attention trade-off evaluation!',
    },
  ];
};

export const saveAssignmentSubmission = (submission: Omit<SavedAssignmentSubmission, 'id'>): SavedAssignmentSubmission[] => {
  const current = getAssignmentSubmissions();
  const newSub: SavedAssignmentSubmission = {
    ...submission,
    id: `sub-${Date.now()}`,
  };
  const filtered = current.filter((s) => s.assignmentId !== submission.assignmentId);
  const updated = [newSub, ...filtered];
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENT_SUBMISSIONS, JSON.stringify(updated));
  return updated;
};

// --- Notifications ---
export const getNotifications = (): SavedNotification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading notifications', e);
  }
  return INITIAL_NOTIFICATIONS;
};

export const markNotificationRead = (id: string): SavedNotification[] => {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  return updated;
};

export const markAllNotificationsRead = (): SavedNotification[] => {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  return updated;
};

// --- Discussions ---
export const getDiscussions = (): SavedDiscussionThread[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading discussions', e);
  }
  return INITIAL_DISCUSSIONS;
};

export const createDiscussionThread = (
  courseId: string,
  courseTitle: string,
  title: string,
  content: string,
  authorName: string,
  authorRole: string
): SavedDiscussionThread[] => {
  const current = getDiscussions();
  const newThread: SavedDiscussionThread = {
    id: `disc-${Date.now()}`,
    courseId,
    courseTitle,
    title,
    content,
    authorName,
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    authorRole,
    createdAt: 'Just now',
    likesCount: 0,
    isLiked: false,
    replies: [],
  };
  const updated = [newThread, ...current];
  localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(updated));
  return updated;
};

export const addDiscussionReply = (
  threadId: string,
  content: string,
  authorName: string,
  authorRole: string
): SavedDiscussionThread[] => {
  const current = getDiscussions();
  const updated = current.map((t) => {
    if (t.id === threadId) {
      return {
        ...t,
        replies: [
          ...t.replies,
          {
            id: `rep-${Date.now()}`,
            authorName,
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            authorRole,
            createdAt: 'Just now',
            content,
            likesCount: 0,
          },
        ],
      };
    }
    return t;
  });
  localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(updated));
  return updated;
};

export const toggleDiscussionLike = (threadId: string): SavedDiscussionThread[] => {
  const current = getDiscussions();
  const updated = current.map((t) => {
    if (t.id === threadId) {
      const isLiked = !t.isLiked;
      return {
        ...t,
        isLiked,
        likesCount: isLiked ? t.likesCount + 1 : t.likesCount - 1,
      };
    }
    return t;
  });
  localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(updated));
  return updated;
};

// --- Settings ---
export const DEFAULT_USER_SETTINGS: UserSettingsData = {
  theme: 'system',
  emailNotifications: true,
  assignmentReminders: true,
  discussionUpdates: true,
  announcementAlerts: true,
  language: 'English (US)',
  autoPlayNextLecture: true,
  defaultVideoQuality: '1080p (HD)',
};

export const getUserSettings = (): UserSettingsData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (raw) return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading user settings', e);
  }
  return DEFAULT_USER_SETTINGS;
};

export const saveUserSettings = (settings: Partial<UserSettingsData>): UserSettingsData => {
  const current = getUserSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
  return updated;
};
