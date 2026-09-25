import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { generalRateLimiter } from './middleware/rateLimiter';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import courseRoutes from './modules/courses/courses.routes';
import enrollmentRoutes from './modules/enrollments/enrollments.routes';
import assignmentRoutes from './modules/assignments/assignments.routes';
import quizRoutes from './modules/quizzes/quizzes.routes';
import aiRoutes from './modules/ai/ai.routes';
import gamificationRoutes from './modules/gamification/gamification.routes';
import discussionRoutes from './modules/discussions/discussions.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(generalRateLimiter);

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Vertexon LMS Core Backend' });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Vertexon LMS Core Backend API v1' });
});

// API v1 routes
const API_PREFIX = '/api/v1';

// Mount auth routes under both /api/v1/auth and /api/v1 for 100% client compatibility
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(API_PREFIX, authRoutes);

app.use(API_PREFIX, usersRoutes);
app.use(API_PREFIX, courseRoutes);
app.use(API_PREFIX, enrollmentRoutes);
app.use(API_PREFIX, assignmentRoutes);
app.use(API_PREFIX, quizRoutes);
app.use(API_PREFIX, aiRoutes);
app.use(API_PREFIX, gamificationRoutes);
app.use(API_PREFIX, discussionRoutes);
app.use(API_PREFIX, notificationRoutes);
app.use(API_PREFIX, adminRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = config.port;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Vertexon LMS Backend Server running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api/v1`);
    console.log(`🔐 Auth API Endpoints: http://localhost:${PORT}/api/v1/auth/register & http://localhost:${PORT}/api/v1/auth/login`);
  });
}

export default app;
