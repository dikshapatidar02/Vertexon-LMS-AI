import { Router } from 'express';
import {
  getAllUsers,
  updateUserRole,
  toggleUserSuspend,
  getPendingCourses,
  getAnalyticsOverview,
  getFlaggedPosts,
  moderateFlaggedPost,
} from './admin.controller';
import { authenticateJWT, requireRole } from '../../middleware/auth';

const router = Router();

router.get('/admin/users', authenticateJWT, requireRole('admin'), getAllUsers);
router.put('/admin/users/:id/role', authenticateJWT, requireRole('admin'), updateUserRole);
router.put('/admin/users/:id/suspend', authenticateJWT, requireRole('admin'), toggleUserSuspend);

router.get('/admin/courses/pending', authenticateJWT, requireRole('admin'), getPendingCourses);
router.get('/admin/analytics/overview', authenticateJWT, requireRole('admin'), getAnalyticsOverview);

router.get('/admin/moderation/flagged-posts', authenticateJWT, requireRole('admin'), getFlaggedPosts);
router.put('/admin/moderation/flagged-posts/:id', authenticateJWT, requireRole('admin'), moderateFlaggedPost);

export default router;
