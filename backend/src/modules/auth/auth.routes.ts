import { Router } from 'express';
import { register, login, refresh, logout, me, updateProfile, changePassword, forgotPassword, resetPassword } from './auth.controller';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { authenticateJWT } from '../../middleware/auth';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.post('/refresh', authRateLimiter, refresh);
router.post('/logout', logout);
router.get('/me', authenticateJWT, me);
router.put('/profile', authenticateJWT, updateProfile);
router.post('/change-password', authenticateJWT, changePassword);

export default router;

