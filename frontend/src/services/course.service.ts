import { api } from '../utils/api';

export const courseService = {
  async getCourses(params?: { category?: string; difficulty?: string; q?: string; status?: string }) {
    const res = await api.get('/courses', { params });
    return res.data;
  },

  async getCourseById(id: string) {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  async createCourse(data: {
    title: string;
    description: string;
    category: string;
    difficulty?: string;
    price?: number;
    thumbnail_url?: string;
  }) {
    const res = await api.post('/courses', data);
    return res.data;
  },

  async addModule(courseId: string, title: string) {
    const res = await api.post(`/courses/${courseId}/modules`, { title });
    return res.data;
  },

  async addLecture(moduleId: string, data: { title: string; video_url?: string; transcript?: string; resource_urls?: string[] }) {
    const res = await api.post(`/modules/${moduleId}/lectures`, data);
    return res.data;
  },

  async approveCourse(courseId: string, decision: 'approved' | 'rejected', comment?: string) {
    const res = await api.post(`/courses/${courseId}/approve`, { decision, comment });
    return res.data;
  },
};
