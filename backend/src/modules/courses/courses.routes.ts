import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  addModule,
  addLecture,
  approveCourse,
} from './courses.controller';
import { authenticateJWT, requireRole } from '../../middleware/auth';

const router = Router();

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);

router.post('/courses', authenticateJWT, requireRole('instructor', 'admin'), createCourse);
router.put('/courses/:id', authenticateJWT, requireRole('instructor', 'admin'), updateCourse);
router.post('/courses/:id/modules', authenticateJWT, requireRole('instructor', 'admin'), addModule);
router.post('/modules/:id/lectures', authenticateJWT, requireRole('instructor', 'admin'), addLecture);

router.post('/courses/:id/approve', authenticateJWT, requireRole('admin'), approveCourse);

export default router;
