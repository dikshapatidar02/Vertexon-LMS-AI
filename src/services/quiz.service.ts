import { INITIAL_QUIZZES } from '../utils/demoData';
import { getQuizResults, saveQuizResult } from '../utils/storage';

export const quizService = {
  async getQuizzes(moduleId: string) {
    const quizzes = INITIAL_QUIZZES.filter((q: any) => q.courseId === moduleId || q.id === moduleId);
    return { quizzes: quizzes.length > 0 ? quizzes : INITIAL_QUIZZES };
  },

  async getQuizById(quizId: string) {
    const quiz = INITIAL_QUIZZES.find((q: any) => q.id === quizId) || INITIAL_QUIZZES[0];
    return { quiz };
  },

  async startAttempt(quizId: string) {
    return { attempt_id: `att-${Date.now()}`, started_at: new Date().toISOString() };
  },

  async submitAttempt(attemptId: string, answers: { question_id: string; selected_option_ids?: string[]; text_answer?: string }[]) {
    const score = 85;
    saveQuizResult({
      quizId: attemptId,
      score,
      totalQuestions: answers.length || 5,
      percentage: score,
      completedAt: new Date().toISOString(),
      passed: true,
      userAnswers: answers,
    });
    return { score, percentage: score, passed: true };
  },

  async createQuiz(data: { module_id: string; title: string; is_ai_generated?: boolean; questions: any[] }) {
    const newQuiz = {
      id: `q-${Date.now()}`,
      module_id: data.module_id,
      title: data.title,
      is_ai_generated: data.is_ai_generated || false,
      questions: data.questions,
    };
    return { quiz: newQuiz };
  },
};
