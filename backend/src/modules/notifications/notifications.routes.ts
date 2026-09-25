import { Router } from 'express';
import {
  getCourseAnnouncements,
  createAnnouncement,
  getMyNotifications,
  markNotificationRead,
} from './notifications.controller';
import { authenticateJWT, requireRole } from '../../middleware/auth';

const router = Router();

router.get('/announcements/course/:courseId', authenticateJWT, getCourseAnnouncements);
router.post('/announcements', authenticateJWT, requireRole('instructor', 'admin'), createAnnouncement);

router.get('/notifications/me', authenticateJWT, getMyNotifications);
router.put('/notifications/:id/read', authenticateJWT, markNotificationRead);

export default router;
