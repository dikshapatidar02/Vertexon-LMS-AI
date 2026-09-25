import { api } from '../utils/api';

export const assignmentService = {
  async getAssignments(courseId: string) {
    const res = await api.get(`/assignments/course/${courseId}`);
    return res.data;
  },

  async submitAssignment(assignmentId: string, file_url: string) {
    const res = await api.post(`/assignments/${assignmentId}/submit`, { file_url });
    return res.data;
  },

  async createAssignment(data: { course_id: string; title: string; instructions: string; rubric?: any[]; due_date?: string }) {
    const res = await api.post('/assignments', data);
    return res.data;
  },

  async getSubmissions(assignmentId: string) {
    const res = await api.get(`/assignments/${assignmentId}/submissions`);
    return res.data;
  },

  async gradeSubmission(submissionId: string, grade: number, feedback?: string) {
    const res = await api.put(`/submissions/${submissionId}/grade`, { grade, feedback });
    return res.data;
  },
};
