import { api } from '../utils/api';

export const quizService = {
  async getQuizzes(moduleId: string) {
    const res = await api.get(`/quizzes/module/${moduleId}`);
    return res.data;
  },

  async getQuizById(quizId: string) {
    const res = await api.get(`/quizzes/${quizId}`);
    return res.data;
  },

  async startAttempt(quizId: string) {
    const res = await api.post(`/quizzes/${quizId}/attempt`);
    return res.data;
  },

  async submitAttempt(attemptId: string, answers: { question_id: string; selected_option_ids?: string[]; text_answer?: string }[]) {
    const res = await api.post(`/attempts/${attemptId}/submit`, { answers });
    return res.data;
  },

  async createQuiz(data: { module_id: string; title: string; is_ai_generated?: boolean; questions: any[] }) {
    const res = await api.post('/quizzes', data);
    return res.data;
  },
};
