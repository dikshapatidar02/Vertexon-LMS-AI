import { Router } from 'express';
import {
  startChatSession,
  sendMessage,
  getSessionMessages,
  switchMode,
  summarizeLecture,
  generateQuizFromLecture,
  generateFlashcards,
  generateStudyPlan,
} from './ai.controller';
import { authenticateJWT, requireRole } from '../../middleware/auth';
import { aiRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/ai/chat/sessions', authenticateJWT, startChatSession);
router.post('/ai/chat/sessions/:id/messages', authenticateJWT, aiRateLimiter, sendMessage);
router.get('/ai/chat/sessions/:id/messages', authenticateJWT, getSessionMessages);
router.put('/ai/chat/sessions/:id/mode', authenticateJWT, switchMode);

router.post('/ai/lectures/:id/summarize', authenticateJWT, summarizeLecture);
router.post('/ai/lectures/:id/generate-quiz', authenticateJWT, requireRole('instructor', 'admin'), generateQuizFromLecture);
router.post('/ai/modules/:id/flashcards', authenticateJWT, generateFlashcards);
router.post('/ai/study-plan', authenticateJWT, generateStudyPlan);

export default router;
