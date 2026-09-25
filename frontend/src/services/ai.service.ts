import { api } from '../utils/api';

export const aiService = {
  async startSession(course_id: string, mode: 'beginner' | 'intermediate' | 'advanced' = 'intermediate') {
    const res = await api.post('/ai/chat/sessions', { course_id, mode });
    return res.data;
  },

  async sendMessage(sessionId: string, message: string) {
    const res = await api.post(`/ai/chat/sessions/${sessionId}/messages`, { message });
    return res.data;
  },

  async getMessages(sessionId: string) {
    const res = await api.get(`/ai/chat/sessions/${sessionId}/messages`);
    return res.data;
  },

  async switchMode(sessionId: string, mode: 'beginner' | 'intermediate' | 'advanced') {
    const res = await api.put(`/ai/chat/sessions/${sessionId}/mode`, { mode });
    return res.data;
  },

  async summarizeLecture(lectureId: string) {
    const res = await api.post(`/ai/lectures/${lectureId}/summarize`);
    return res.data;
  },

  async generateQuiz(lectureId: string) {
    const res = await api.post(`/ai/lectures/${lectureId}/generate-quiz`);
    return res.data;
  },

  async getFlashcards(moduleId: string) {
    const res = await api.post(`/ai/modules/${moduleId}/flashcards`);
    return res.data;
  },

  async generateStudyPlan(course_id: string) {
    const res = await api.post('/ai/study-plan', { course_id });
    return res.data;
  },
};
