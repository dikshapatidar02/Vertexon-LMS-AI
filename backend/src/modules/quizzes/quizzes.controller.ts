import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../db/store';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const createQuiz = async (req: AuthenticatedRequest, res: Response) => {
  const { module_id, title, is_ai_generated = false, questions = [] } = req.body;

  if (!module_id || !title) {
    throw new AppError('module_id and title are required', 400, 'VALIDATION_ERROR');
  }

  const quizId = `qz-${uuidv4().slice(0, 8)}`;
  const formattedQuestions = questions.map((q: any, idx: number) => {
    const questionId = `q-${uuidv4().slice(0, 8)}`;
    const options = (q.options || []).map((opt: any) => ({
      id: `opt-${uuidv4().slice(0, 8)}`,
      question_id: questionId,
      option_text: opt.option_text,
      is_correct: Boolean(opt.is_correct),
    }));

    return {
      id: questionId,
      quiz_id: quizId,
      question_text: q.question_text,
      question_type: q.question_type || 'mcq',
      order_index: idx + 1,
      options,
    };
  });

  const newQuiz = {
    id: quizId,
    module_id,
    title,
    is_ai_generated,
    questions: formattedQuestions,
  };

  dbStore.quizzes.push(newQuiz);
  res.status(201).json({ quiz: newQuiz });
};

export const getQuizzesByModule = async (req: AuthenticatedRequest, res: Response) => {
  const { moduleId } = req.params;
  const moduleQuizzes = dbStore.quizzes.filter((q) => q.module_id === moduleId);

  const enriched = moduleQuizzes.map((quiz) => {
    const lastAttempt = dbStore.quizAttempts
      .filter((a) => a.quiz_id === quiz.id && a.user_id === req.user!.id)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())[0];

    return {
      ...quiz,
      last_attempt: lastAttempt || null,
    };
  });

  res.json({ quizzes: enriched });
};

export const getQuizById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const quiz = dbStore.quizzes.find((q) => q.id === id);

  if (!quiz) {
    throw new AppError('Quiz not found', 404, 'NOT_FOUND');
  }

  // Strip is_correct flag for student taking the quiz
  const isStudent = req.user?.role === 'student';
  const sanitizedQuestions = (quiz.questions || []).map((q) => ({
    ...q,
    options: (q.options || []).map((opt) => ({
      id: opt.id,
      question_id: opt.question_id,
      option_text: opt.option_text,
      ...(isStudent ? {} : { is_correct: opt.is_correct }),
    })),
  }));

  res.json({
    quiz: {
      ...quiz,
      questions: sanitizedQuestions,
    },
  });
};

export const startQuizAttempt = async (req: AuthenticatedRequest, res: Response) => {
  const { id: quiz_id } = req.params;
  const quiz = dbStore.quizzes.find((q) => q.id === quiz_id);

  if (!quiz) {
    throw new AppError('Quiz not found', 404, 'NOT_FOUND');
  }

  const attempt = {
    id: `qa-${uuidv4().slice(0, 8)}`,
    quiz_id,
    user_id: req.user!.id,
    score: 0,
    started_at: new Date().toISOString(),
    submitted_at: '',
  };

  dbStore.quizAttempts.push(attempt);
  res.status(201).json({ attempt });
};

export const submitQuizAttempt = async (req: AuthenticatedRequest, res: Response) => {
  const { id: attempt_id } = req.params;
  const { answers = [] } = req.body; // Array of { question_id, selected_option_ids, text_answer }

  const attempt = dbStore.quizAttempts.find((a) => a.id === attempt_id);
  if (!attempt) {
    throw new AppError('Attempt not found', 404, 'NOT_FOUND');
  }

  const quiz = dbStore.quizzes.find((q) => q.id === attempt.quiz_id);
  if (!quiz || !quiz.questions) {
    throw new AppError('Associated quiz questions not found', 404, 'NOT_FOUND');
  }

  let totalQuestions = quiz.questions.length;
  let correctCount = 0;

  const evaluatedAnswers = answers.map((ans: any) => {
    const question = quiz.questions?.find((q) => q.id === ans.question_id);
    let isCorrect = false;

    if (question) {
      if (question.question_type === 'mcq' || question.question_type === 'multi_select') {
        const correctOptIds = (question.options || [])
          .filter((opt) => opt.is_correct)
          .map((opt) => opt.id)
          .sort();
        const userOptIds = (ans.selected_option_ids || []).sort();

        isCorrect =
          correctOptIds.length === userOptIds.length &&
          correctOptIds.every((val, index) => val === userOptIds[index]);
      } else if (question.question_type === 'short_answer') {
        // Short answer objective matching (non-empty string check)
        isCorrect = Boolean(ans.text_answer && ans.text_answer.trim().length > 0);
      }
    }

    if (isCorrect) correctCount += 1;

    return {
      question_id: ans.question_id,
      selected_option_ids: ans.selected_option_ids || [],
      text_answer: ans.text_answer || '',
      is_correct: isCorrect,
    };
  });

  const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  attempt.score = finalScore;
  attempt.submitted_at = new Date().toISOString();

  // Award Quiz Master badge if perfect score
  if (finalScore === 100) {
    const hasBadge = dbStore.userBadges.some((ub) => ub.user_id === req.user!.id && ub.badge_id === 3);
    if (!hasBadge) {
      dbStore.userBadges.push({
        user_id: req.user!.id,
        badge_id: 3,
        earned_at: new Date().toISOString(),
      });
    }
  }

  res.json({
    attempt: {
      ...attempt,
      evaluated_answers: evaluatedAnswers,
    },
    total_questions: totalQuestions,
    correct_answers: correctCount,
    score: finalScore,
  });
};
