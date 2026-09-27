export interface AIRagSource {
  lecture_id: string;
  lecture_title: string;
  timestamp_seconds?: number;
  snippet?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  sources?: AIRagSource[];
  created_at: string;
}

export interface AIChatContext {
  courseId?: string;
  courseTitle?: string;
  lectureId?: string;
  lectureTitle?: string;
  mode?: 'beginner' | 'intermediate' | 'advanced';
  history?: AIChatMessage[];
}

export interface AIStudyPlan {
  title: string;
  recommendations: string[];
  estimated_hours_remaining: number;
  target_completion_date: string;
}

export interface AIFlashcard {
  id: string;
  question: string;
  answer: string;
}

export interface AIQuizQuestionGen {
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'short_answer';
  options: { option_text: string; is_correct: boolean }[];
  explanation: string;
}

export interface AIProviderConfig {
  provider: 'local' | 'openai' | 'anthropic';
  apiKey?: string;
}
