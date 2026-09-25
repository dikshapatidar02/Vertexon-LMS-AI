import { api } from '../utils/api';

export const enrollmentService = {
  async enroll(courseId: string) {
    const res = await api.post(`/courses/${courseId}/enroll`);
    return res.data;
  },

  async getMyEnrollments() {
    const res = await api.get('/enrollments/me');
    return res.data;
  },

  async updateProgress(lectureId: string, watched_seconds: number, completed?: boolean) {
    const res = await api.post(`/lectures/${lectureId}/progress`, { watched_seconds, completed });
    return res.data;
  },

  async addNote(lectureId: string, content: string, timestamp_seconds?: number) {
    const res = await api.post(`/lectures/${lectureId}/notes`, { content, timestamp_seconds });
    return res.data;
  },

  async getNotes(lectureId: string) {
    const res = await api.get(`/lectures/${lectureId}/notes`);
    return res.data;
  },

  async addBookmark(lectureId: string, timestamp_seconds?: number) {
    const res = await api.post(`/lectures/${lectureId}/bookmarks`, { timestamp_seconds });
    return res.data;
  },

  async getBookmarks(lectureId: string) {
    const res = await api.get(`/lectures/${lectureId}/bookmarks`);
    return res.data;
  },
};
