import { aiService } from './ai';

export const legacyAiService = {
  async sendMessage(sessionId: string, message: string, courseId?: string, mode: 'beginner' | 'intermediate' | 'advanced' = 'intermediate') {
    return aiService.sendMessage(message, { courseId, mode });
  },

  async summarizeLecture(lectureId: string, lectureTitle: string = 'Lecture', transcript?: string) {
    return aiService.summarizeLecture(lectureTitle, transcript);
  },

  async generateQuiz(lectureId: string, topic: string = 'Course Quiz') {
    return aiService.generateQuizQuestions(topic, 3);
  },

  async getFlashcards(moduleId: string, topic: string = 'Module Concepts') {
    return aiService.getFlashcards(topic, 4);
  },

  async generateStudyPlan(course_id: string, courseTitle: string = 'Academic Study Plan') {
    return aiService.generateStudyPlan(courseTitle);
  },
};

export { aiService };
