import { enrollInCourse, getEnrolledCourseIds, getCompletedLectures, markLectureCompleted } from '../utils/storage';
import { INITIAL_COURSES } from '../utils/demoData';

export const enrollmentService = {
  async enroll(courseId: string) {
    const updatedIds = enrollInCourse(courseId);
    return { enrolled_course_ids: updatedIds };
  },

  async getMyEnrollments() {
    const ids = getEnrolledCourseIds();
    const enrolled = INITIAL_COURSES.filter((c) => ids.includes(c.id));
    return { enrollments: enrolled };
  },

  async updateProgress(lectureId: string, watched_seconds: number, completed?: boolean) {
    if (completed) {
      markLectureCompleted(lectureId);
    }
    return { lecture_id: lectureId, watched_seconds, completed: Boolean(completed) };
  },

  async addNote(lectureId: string, content: string, timestamp_seconds?: number) {
    const note = {
      id: `note-${Date.now()}`,
      lectureId,
      content,
      timestamp_seconds: timestamp_seconds || 0,
      createdAt: new Date().toISOString(),
    };
    return { note };
  },

  async getNotes(lectureId: string) {
    return { notes: [] };
  },

  async addBookmark(lectureId: string, timestamp_seconds?: number) {
    const bookmark = {
      id: `bm-${Date.now()}`,
      lectureId,
      timestamp_seconds: timestamp_seconds || 0,
      createdAt: new Date().toISOString(),
    };
    return { bookmark };
  },

  async getBookmarks(lectureId: string) {
    return { bookmarks: [] };
  },
};
