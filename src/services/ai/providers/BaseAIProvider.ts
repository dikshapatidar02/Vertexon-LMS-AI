import { AIChatContext, AIChatMessage, AIRagSource, AIStudyPlan, AIFlashcard, AIQuizQuestionGen } from '../types';

export interface BaseAIProvider {
  sendMessage(
    userMessage: string,
    context: AIChatContext
  ): Promise<{ reply: string; sources: AIRagSource[] }>;

  summarizeLecture(lectureTitle: string, transcript?: string): Promise<string>;

  getFlashcards(topic: string, count?: number): Promise<AIFlashcard[]>;

  generateStudyPlan(courseTitle: string, userProgress?: number): Promise<AIStudyPlan>;

  generateQuizQuestions(topic: string, count?: number): Promise<AIQuizQuestionGen[]>;
}
