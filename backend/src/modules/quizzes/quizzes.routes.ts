import { Router } from 'express';
import {
  createQuiz,
  getQuizzesByModule,
  getQuizById,
  startQuizAttempt,
  submitQuizAttempt,
} from './quizzes.controller';
import { authenticateJWT, requireRole } from '../../middleware/auth';

const router = Router();

router.post('/quizzes', authenticateJWT, requireRole('instructor', 'admin'), createQuiz);
router.get('/quizzes/module/:moduleId', authenticateJWT, getQuizzesByModule);
router.get('/quizzes/:id', authenticateJWT, getQuizById);

router.post('/quizzes/:id/attempt', authenticateJWT, requireRole('student'), startQuizAttempt);
router.post('/attempts/:id/submit', authenticateJWT, requireRole('student'), submitQuizAttempt);

export default router;
