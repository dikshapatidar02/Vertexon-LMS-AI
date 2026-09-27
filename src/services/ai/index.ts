import { BaseAIProvider } from './providers/BaseAIProvider';
import { LocalRagProvider } from './providers/LocalRagProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { AnthropicProvider } from './providers/AnthropicProvider';
import { AIChatContext, AIRagSource, AIStudyPlan, AIFlashcard, AIQuizQuestionGen } from './types';

/**
 * AI Service Manager
 * 
 * Production Security Design:
 * - Default: LocalRagProvider (No external API calls, zero key dependencies, 100% grounded in local course data).
 * - Development Testing: Direct browser API calls via OpenAI/Anthropic are strictly optional and only active if 
 *   a developer manually provides a key in browser localStorage ('vertexon_dev_openai_key' or 'vertexon_dev_anthropic_key').
 * - Future Serverless / Backend Integration: Architecture is prepared for secure proxy calls (/api/v1/ai/chat).
 */
class AIServiceManager {
  private activeProvider: BaseAIProvider;

  constructor() {
    this.activeProvider = this.initProvider();
  }

  private initProvider(): BaseAIProvider {
    // Only check user-configured local dev keys stored explicitly in browser localStorage
    const devOpenAIKey = typeof window !== 'undefined' ? localStorage.getItem('vertexon_dev_openai_key') : null;
    const devAnthropicKey = typeof window !== 'undefined' ? localStorage.getItem('vertexon_dev_anthropic_key') : null;

    if (devOpenAIKey) {
      return new OpenAIProvider(devOpenAIKey);
    } else if (devAnthropicKey) {
      return new AnthropicProvider(devAnthropicKey);
    }

    // Default to zero-dependency grounded Local RAG Engine
    return new LocalRagProvider();
  }

  public reinitialize() {
    this.activeProvider = this.initProvider();
  }

  public async sendMessage(userMessage: string, context: AIChatContext): Promise<{ reply: string; sources: AIRagSource[] }> {
    return this.activeProvider.sendMessage(userMessage, context);
  }

  public async summarizeLecture(lectureTitle: string, transcript?: string): Promise<string> {
    return this.activeProvider.summarizeLecture(lectureTitle, transcript);
  }

  public async getFlashcards(topic: string, count: number = 3): Promise<AIFlashcard[]> {
    return this.activeProvider.getFlashcards(topic, count);
  }

  public async generateStudyPlan(courseTitle: string, userProgress: number = 25): Promise<AIStudyPlan> {
    return this.activeProvider.generateStudyPlan(courseTitle, userProgress);
  }

  public async generateQuizQuestions(topic: string, count: number = 2): Promise<AIQuizQuestionGen[]> {
    return this.activeProvider.generateQuizQuestions(topic, count);
  }
}

export const aiService = new AIServiceManager();
export * from './types';
