import { api } from '../utils/api';

export const dashboardService = {
  async getStudentDashboard() {
    const res = await api.get('/dashboard');
    return res.data;
  },

  async getBadges() {
    const res = await api.get('/users/me/badges');
    return res.data;
  },

  async getStreak() {
    const res = await api.get('/users/me/streak');
    return res.data;
  },

  async getRecommendations() {
    const res = await api.get('/recommendations/me');
    return res.data;
  },

  async getCertificates() {
    const res = await api.get('/certificates/me');
    return res.data;
  },
};
