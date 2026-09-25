import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/env';
import { dbStore } from '../../db/store';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const register = async (req: Request, res: Response) => {
  const { full_name, email, password, role = 'student' } = req.body;

  if (!email || !password || !full_name) {
    throw new AppError('Full name, email, and password are required.', 400, 'VALIDATION_ERROR');
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long.', 400, 'VALIDATION_ERROR');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  
  if (role === 'admin') {
    throw new AppError('Admin account creation is prohibited through public registration.', 403, 'FORBIDDEN_ROLE');
  }

  const existingUser = dbStore.users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
  if (existingUser) {
    throw new AppError('An account with this email already exists. Please log in instead.', 409, 'USER_EXISTS', 'email');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newUser = {
    id: `usr-${uuidv4().slice(0, 8)}`,
    full_name: String(full_name).trim(),
    email: cleanEmail,
    password_hash,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`,
    role: (role === 'instructor' ? 'instructor' : 'student') as 'student' | 'instructor',
    is_active: true,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };

  dbStore.users.push(newUser);

  if (newUser.role === 'student') {
    dbStore.streaks.push({
      user_id: newUser.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: new Date().toISOString().split('T')[0],
    });
  }

  const accessOptions: SignOptions = { expiresIn: '24h' };
  const refreshOptions: SignOptions = { expiresIn: '7d' };

  const access_token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, full_name: newUser.full_name },
    config.jwtSecret,
    accessOptions
  );

  const refresh_token = jwt.sign(
    { id: newUser.id },
    config.jwtRefreshSecret,
    refreshOptions
  );

  res.status(201).json({
    access_token,
    refresh_token,
    user: {
      id: newUser.id,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      avatar_url: newUser.avatar_url,
      created_at: newUser.created_at,
      last_login_at: newUser.last_login_at,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required.', 400, 'VALIDATION_ERROR');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  // Find user by email only
  const user = dbStore.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user || !user.is_active) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  // Strictly verify password using bcrypt compare against stored hash
  const isMatch = await bcrypt.compare(cleanPassword, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }

  user.last_login_at = new Date().toISOString();

  const accessOptions: SignOptions = { expiresIn: '24h' };
  const refreshOptions: SignOptions = { expiresIn: '7d' };

  const access_token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    config.jwtSecret,
    accessOptions
  );

  const refresh_token = jwt.sign(
    { id: user.id },
    config.jwtRefreshSecret,
    refreshOptions
  );

  res.json({
    access_token,
    refresh_token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
    },
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError('Email address is required.', 400, 'VALIDATION_ERROR');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = dbStore.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Return standard success response to avoid email enumeration
    return res.json({
      message: 'If an account exists with that email, a password reset link has been issued.',
    });
  }

  const token = `rst-${uuidv4()}`;
  const expires_at = Date.now() + 15 * 60 * 1000; // 15 mins

  dbStore.resetTokens.push({ token, user_id: user.id, expires_at });

  res.json({
    message: 'If an account exists with that email, a password reset link has been issued.',
    dev_reset_url: `/reset-password?token=${token}`,
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new AppError('Reset token and new password are required.', 400, 'VALIDATION_ERROR');
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long.', 400, 'VALIDATION_ERROR');
  }

  const record = dbStore.resetTokens.find((r) => r.token === token && r.expires_at > Date.now());
  if (!record) {
    throw new AppError('Invalid or expired password reset token. Please request a new one.', 400, 'INVALID_TOKEN');
  }

  const user = dbStore.users.find((u) => u.id === record.user_id);
  if (!user) {
    throw new AppError('User account not found.', 404, 'NOT_FOUND');
  }

  const password_hash = await bcrypt.hash(password, 10);
  user.password_hash = password_hash;

  // Invalidate reset token
  dbStore.resetTokens = dbStore.resetTokens.filter((r) => r.token !== token);

  res.json({
    message: 'Password updated successfully. You can now log in with your new password.',
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    throw new AppError('Refresh token required', 400, 'VALIDATION_ERROR');
  }

  try {
    const decoded = jwt.verify(refresh_token, config.jwtRefreshSecret) as { id: string };
    const user = dbStore.users.find((u) => u.id === decoded.id && u.is_active);

    if (!user) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    const accessOptions: SignOptions = { expiresIn: '24h' };
    const access_token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      config.jwtSecret,
      accessOptions
    );

    res.json({ access_token });
  } catch (err) {
    throw new AppError('Expired or invalid refresh token', 401, 'INVALID_TOKEN');
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }
  const user = dbStore.users.find((u) => u.id === req.user?.id);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  const safeUser = {
    id: user.id,
    name: user.full_name,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    status: user.is_active ? 'active' : 'inactive',
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    createdAt: user.created_at,
    last_login_at: user.last_login_at || user.created_at,
    lastLoginAt: user.last_login_at || user.created_at,
  };

  res.json({
    user: safeUser,
    ...safeUser,
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const user = dbStore.users.find((u) => u.id === req.user?.id);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  const { full_name, avatar_url } = req.body;

  if (full_name !== undefined) {
    const trimmed = String(full_name).trim();
    if (!trimmed) {
      throw new AppError('Full name cannot be empty.', 400, 'VALIDATION_ERROR');
    }
    user.full_name = trimmed;
  }

  if (avatar_url !== undefined) {
    user.avatar_url = String(avatar_url).trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.full_name)}`;
  }

  const safeUser = {
    id: user.id,
    name: user.full_name,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    status: user.is_active ? 'active' : 'inactive',
    avatar_url: user.avatar_url,
    created_at: user.created_at,
    createdAt: user.created_at,
    last_login_at: user.last_login_at || user.created_at,
    lastLoginAt: user.last_login_at || user.created_at,
  };

  res.json({
    message: 'Profile updated successfully',
    user: safeUser,
    ...safeUser,
  });
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const user = dbStore.users.find((u) => u.id === req.user?.id);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    throw new AppError('Current password and new password are required.', 400, 'VALIDATION_ERROR');
  }

  if (String(new_password).length < 6) {
    throw new AppError('New password must be at least 6 characters long.', 400, 'VALIDATION_ERROR');
  }

  const isMatch = await bcrypt.compare(String(current_password), user.password_hash);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 400, 'INVALID_PASSWORD');
  }

  const newHash = await bcrypt.hash(String(new_password), 10);
  user.password_hash = newHash;

  res.json({
    message: 'Password changed successfully.',
  });
};

