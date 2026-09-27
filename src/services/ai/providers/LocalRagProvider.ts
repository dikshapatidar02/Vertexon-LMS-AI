import { BaseAIProvider } from './BaseAIProvider';
import { AIChatContext, AIRagSource, AIStudyPlan, AIFlashcard, AIQuizQuestionGen } from '../types';
import { INITIAL_COURSES } from '../../../utils/demoData';

export class LocalRagProvider implements BaseAIProvider {
  async sendMessage(
    userMessage: string,
    context: AIChatContext
  ): Promise<{ reply: string; sources: AIRagSource[] }> {
    const textLower = userMessage.toLowerCase();
    const mode = context.mode || 'intermediate';

    // Find course or default to first demo course
    const course = INITIAL_COURSES.find((c) => c.id === context.courseId) || INITIAL_COURSES[0];

    // Simple TF-IDF style keyword search over course modules & lectures
    let bestMatchLecture: any = null;
    let matchScore = 0;

    course.modules.forEach((mod) => {
      mod.lectures.forEach((lec) => {
        let score = 0;
        const words = userMessage.toLowerCase().split(/\W+/);
        words.forEach((w) => {
          if (w.length > 3) {
            if (lec.title.toLowerCase().includes(w)) score += 3;
            if (lec.transcript.toLowerCase().includes(w)) score += 1;
          }
        });
        if (score > matchScore) {
          matchScore = score;
          bestMatchLecture = lec;
        }
      });
    });

    if (!bestMatchLecture) {
      bestMatchLecture = course.modules[0]?.lectures[0] || {
        id: 'lec-default',
        title: 'Core Curriculum & Foundations',
        transcript: 'Comprehensive overview of core academic concepts.',
      };
    }

    const sources: AIRagSource[] = [
      {
        lecture_id: bestMatchLecture.id,
        lecture_title: bestMatchLecture.title,
        timestamp_seconds: 140,
        snippet: bestMatchLecture.transcript.slice(0, 120) + '...',
      },
    ];

    let reply = '';

    if (textLower.includes('quicksort') || textLower.includes('sort') || textLower.includes('complexity')) {
      if (mode === 'beginner') {
        reply = `**[Beginner Explanation] Quicksort & Sorting Mechanics**\n\nThink of Quicksort like picking a card from a deck (the pivot), then dividing the rest of the cards into two piles: cards smaller than your pivot on the left, and larger cards on the right. You repeat this for each pile until everything is sorted!\n\n• **Time Needed:** Usually very fast ($O(n \\log n)$ time).\n• **Pro Tip:** Picking a random pivot ensures your piles stay balanced.`;
      } else if (mode === 'advanced') {
        reply = `**[Advanced Analysis] Asymptotic Bounds & Partitioning Dynamics**\n\n1. **Recurrence Relation:**\n   $$T(n) = T(k) + T(n-k-1) + \\Theta(n)$$\n   - Worst-case $O(n^2)$ occurs when $k=0$ or $k=n-1$ at every recursion depth (e.g. deterministic first-element pivot on monotonic arrays).\n   - Expected runtime under randomized pivot selection is bounded by $E[T(n)] = 2n \\ln n + O(n) \\approx 1.39 n \\log_2 n$.\n\n2. **In-Place Memory Bound:**\n   Auxiliary stack space is bounded to $O(\\log n)$ by recursively sorting the smaller partition first.`;
      } else {
        reply = `**[Intermediate Breakdown] Quicksort Principles & Performance**\n\nQuicksort relies on the Divide-and-Conquer strategy:\n\n1. **Pivot Selection:** Pick an element $p$ from the array.\n2. **Partitioning:** Rearrange elements so values $< p$ precede $p$ and values $> p$ follow it.\n3. **Recursion:** Recursively apply Quicksort to sub-arrays.\n\n• **Average Time Complexity:** $O(n \\log n)$\n• **Worst-Case Time Complexity:** $O(n^2)$ (Mitigated via randomized pivot or median-of-three heuristic).`;
      }
    } else if (textLower.includes('vector') || textLower.includes('embedding') || textLower.includes('rag')) {
      reply = `**Vector Embeddings & Semantic Search in RAG Systems:**\n\nVector embeddings project textual tokens into high-dimensional geometric spaces (e.g. 1536 dimensions). Similarity is measured using Cosine Distance:\n\n$$\\text{Cosine Similarity} = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$$\n\nIn our LMS RAG pipeline, student questions are converted into query vectors to retrieve the most relevant transcript segments before generating responses!`;
      sources.push({
        lecture_id: 'lec-rag-101',
        lecture_title: 'Vector Databases, Embeddings & RAG Architectures',
        timestamp_seconds: 320,
      });
    } else if (textLower.includes('transformer') || textLower.includes('attention')) {
      reply = `**Transformer Self-Attention Mechanism:**\n\nTransformers process token sequences in parallel using Query ($Q$), Key ($K$), and Value ($V$) projections:\n\n$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\nMulti-head attention enables the model to jointly attend to information from different representation subspaces.`;
    } else {
      reply = `Grounded in your course material for **"${course.title}"** (Lecture: *${bestMatchLecture.title}*):\n\nKey Concept Summary:\n1. **Core Principle:** ${bestMatchLecture.transcript.slice(0, 180)}...\n2. **Academic Takeaway:** Review the lecture video at 02:20 to see practical code implementations.\n3. **Next Step:** Attempt the module practice quiz to test your mastery!`;
    }

    return { reply, sources };
  }

  async summarizeLecture(lectureTitle: string, transcript?: string): Promise<string> {
    return (
      `**Executive Academic Summary for "${lectureTitle}":**\n\n` +
      `1. **Primary Concept:** ${transcript ? transcript.slice(0, 120) : 'Core principles and theoretical framework covered in this lecture segment.'}\n` +
      `2. **Key Takeaway:** Understanding runtime bounds, space trade-offs, and algorithmic efficiency.\n` +
      `3. **Practical Application:** Applied in production software architectures and high-performance computing pipelines.`
    );
  }

  async getFlashcards(topic: string, count: number = 3): Promise<AIFlashcard[]> {
    return [
      {
        id: 'fc-1',
        question: `What is the primary objective of ${topic || 'Quicksort'}?`,
        answer: 'Efficiently partition and sort elements with average O(n log n) runtime.',
      },
      {
        id: 'fc-2',
        question: 'Why is randomized pivot selection important?',
        answer: 'It prevents worst-case O(n²) time complexity on pre-sorted data.',
      },
      {
        id: 'fc-3',
        question: 'What space complexity constraint applies to in-place Quicksort?',
        answer: 'O(log n) auxiliary call stack space when sorting smaller sub-arrays first.',
      },
    ].slice(0, count);
  }

  async generateStudyPlan(courseTitle: string, userProgress: number = 25): Promise<AIStudyPlan> {
    return {
      title: `Adaptive AI Study Plan: ${courseTitle}`,
      recommendations: [
        `Review foundational lecture notes for Module 1 (${userProgress}% completed).`,
        'Complete practice quiz on Vector Embeddings & Algorithmic Complexity.',
        'Submit module programming assignment for instructor evaluation.',
      ],
      estimated_hours_remaining: Math.max(1, Math.round((100 - userProgress) * 0.1)),
      target_completion_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
  }

  async generateQuizQuestions(topic: string, count: number = 2): Promise<AIQuizQuestionGen[]> {
    return [
      {
        question_text: `Which pivot selection strategy best guards against worst-case $O(n^2)$ behavior in ${topic}?`,
        question_type: 'single_choice' as const,
        options: [
          { option_text: 'Randomized Pivot or Median-of-Three', is_correct: true },
          { option_text: 'Always selecting the first element', is_correct: false },
          { option_text: 'Always selecting the last element', is_correct: false },
          { option_text: 'Linear search for minimum element', is_correct: false },
        ],
        explanation: 'Randomized pivot selection breaks structured monotonic input patterns, ensuring expected O(n log n) runtime.',
      },
      {
        question_text: `What is the vector dimension used in typical modern OpenAI embedding models?`,
        question_type: 'single_choice' as const,
        options: [
          { option_text: '1536', is_correct: true },
          { option_text: '64', is_correct: false },
          { option_text: '512', is_correct: false },
          { option_text: '4096', is_correct: false },
        ],
        explanation: 'OpenAI text-embedding-3-small and text-embedding-ada-002 output 1536-dimensional dense vectors.',
      },
    ].slice(0, count);
  }
}
