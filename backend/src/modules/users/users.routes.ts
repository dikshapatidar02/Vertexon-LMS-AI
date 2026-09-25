import { Router } from 'express';
import { getDashboard } from './users.controller';
import { authenticateJWT } from '../../middleware/auth';

const router = Router();

router.get('/dashboard', authenticateJWT, getDashboard);

export default router;
