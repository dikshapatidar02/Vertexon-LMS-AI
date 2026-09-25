import { Router } from 'express';
import {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} from './assignments.controller';
import { authenticateJWT, requireRole } from '../../middleware/auth';

const router = Router();

router.post('/assignments', authenticateJWT, requireRole('instructor', 'admin'), createAssignment);
router.get('/assignments/course/:courseId', authenticateJWT, getCourseAssignments);
router.post('/assignments/:id/submit', authenticateJWT, requireRole('student'), submitAssignment);
router.get('/assignments/:id/submissions', authenticateJWT, requireRole('instructor', 'admin'), getAssignmentSubmissions);
router.put('/submissions/:id/grade', authenticateJWT, requireRole('instructor', 'admin'), gradeSubmission);

export default router;
