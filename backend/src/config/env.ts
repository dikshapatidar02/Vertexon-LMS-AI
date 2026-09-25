import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'vertexon_lms_super_secret_jwt_key_2026',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'vertexon_lms_super_secret_refresh_key_2026',
  jwtExpiresIn: '24h',
  jwtRefreshExpiresIn: '7d',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || '',
};
