import { Router } from 'express';
import {
  getCourseThreads,
  createThread,
  getThreadPosts,
  createPost,
} from './discussions.controller';
import { authenticateJWT } from '../../middleware/auth';

const router = Router();

router.get('/discussions/course/:courseId', authenticateJWT, getCourseThreads);
router.post('/discussions', authenticateJWT, createThread);
router.get('/discussions/:id/posts', authenticateJWT, getThreadPosts);
router.post('/discussions/:id/posts', authenticateJWT, createPost);

export default router;
