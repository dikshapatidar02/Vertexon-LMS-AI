import { BaseAIProvider } from './BaseAIProvider';
import { AIChatContext, AIRagSource, AIStudyPlan, AIFlashcard, AIQuizQuestionGen } from '../types';
import { LocalRagProvider } from './LocalRagProvider';

export class AnthropicProvider implements BaseAIProvider {
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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          system: `You are an expert AI Tutor for "${context.courseTitle || 'LMS Course'}". Mode: ${context.mode || 'intermediate'}. Provide educational, structured markdown responses.`,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!response.ok) {
        console.warn('Anthropic API request failed, falling back to Local RAG');
        return this.fallback.sendMessage(userMessage, context);
      }

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'No response from Anthropic.';
      const fallbackResult = await this.fallback.sendMessage(userMessage, context);

      return {
        reply,
        sources: fallbackResult.sources,
      };
    } catch (e) {
      console.error('Error calling Anthropic API:', e);
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
