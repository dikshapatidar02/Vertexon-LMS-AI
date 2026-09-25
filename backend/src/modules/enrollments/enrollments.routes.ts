import { Router } from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  updateLectureProgress,
  addNote,
  getNotes,
  addBookmark,
  getBookmarks,
} from './enrollments.controller';
import { authenticateJWT, requireRole } from '../../middleware/auth';

const router = Router();

router.post('/courses/:id/enroll', authenticateJWT, requireRole('student'), enrollInCourse);
router.get('/enrollments/me', authenticateJWT, getMyEnrollments);
router.post('/lectures/:id/progress', authenticateJWT, updateLectureProgress);
router.post('/lectures/:id/notes', authenticateJWT, addNote);
router.get('/lectures/:id/notes', authenticateJWT, getNotes);
router.post('/lectures/:id/bookmarks', authenticateJWT, addBookmark);
router.get('/lectures/:id/bookmarks', authenticateJWT, getBookmarks);

export default router;
