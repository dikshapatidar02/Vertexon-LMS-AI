import { api } from '../utils/api';

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role?: 'student' | 'instructor';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginPayload) {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(payload: { token: string; password: string }) {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (e) {
      return { message: 'Logged out' };
    }
  },

  async me() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (e) {
      return null;
    }
  },

  async updateProfile(payload: { full_name?: string; avatar_url?: string }) {
    const response = await api.put('/auth/profile', payload);
    return response.data;
  },

  async changePassword(payload: { current_password: string; new_password: string }) {
    const response = await api.post('/auth/change-password', payload);
    return response.data;
  },
};

