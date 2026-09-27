import { BaseAIProvider } from './BaseAIProvider';
import { AIChatContext, AIRagSource, AIStudyPlan, AIFlashcard, AIQuizQuestionGen } from '../types';
import { LocalRagProvider } from './LocalRagProvider';

export class OpenAIProvider implements BaseAIProvider {
  private apiKey: string;
  private fallback: LocalRagProvider;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallback = new LocalRagProvider();
  }

  async sendMessage(
    userMessage: string,
    context: AIChatContext
  ): Promise<{ reply: string; sources: AIRagSource[] }> {
    if (!this.apiKey) {
      return this.fallback.sendMessage(userMessage, context);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert academic tutor for course "${context.courseTitle || 'LMS Course'}". Mode: ${context.mode || 'intermediate'}. Provide clear, educational, well-formatted markdown answers.`,
            },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.warn('OpenAI API request failed, falling back to Local RAG');
        return this.fallback.sendMessage(userMessage, context);
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || 'No response from OpenAI.';
      const fallbackResult = await this.fallback.sendMessage(userMessage, context);

      return {
        reply,
        sources: fallbackResult.sources,
      };
    } catch (e) {
      console.error('Error calling OpenAI API:', e);
      return this.fallback.sendMessage(userMessage, context);
    }
  }

  async summarizeLecture(lectureTitle: string, transcript?: string): Promise<string> {
    return this.fallback.summarizeLecture(lectureTitle, transcript);
  }

  async getFlashcards(topic: string, count?: number): Promise<AIFlashcard[]> {
    return this.fallback.getFlashcards(topic, count);
  }

  async generateStudyPlan(courseTitle: string, userProgress?: number): Promise<AIStudyPlan> {
    return this.fallback.generateStudyPlan(courseTitle, userProgress);
  }

  async generateQuizQuestions(topic: string, count?: number): Promise<AIQuizQuestionGen[]> {
    return this.fallback.generateQuizQuestions(topic, count);
  }
}
