import { Router } from 'express';
import {
  getMyRecommendations,
  getMyBadges,
  getMyStreak,
  getCourseLeaderboard,
  getMyCertificates,
} from './gamification.controller';
import { authenticateJWT } from '../../middleware/auth';

const router = Router();

router.get('/recommendations/me', authenticateJWT, getMyRecommendations);
router.get('/users/me/badges', authenticateJWT, getMyBadges);
router.get('/users/me/streak', authenticateJWT, getMyStreak);
router.get('/leaderboard/:courseId', authenticateJWT, getCourseLeaderboard);
router.get('/certificates/me', authenticateJWT, getMyCertificates);

export default router;
