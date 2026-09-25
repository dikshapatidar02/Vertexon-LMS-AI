import { api } from '../utils/api';

export const adminService = {
  async getUsers(params?: { q?: string; role?: string }) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserRole(userId: string, role: string) {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async toggleSuspendUser(userId: string) {
    const res = await api.put(`/admin/users/${userId}/suspend`);
    return res.data;
  },

  async getPendingCourses() {
    const res = await api.get('/admin/courses/pending');
    return res.data;
  },

  async getAnalyticsOverview() {
    const res = await api.get('/admin/analytics/overview');
    return res.data;
  },

  async getFlaggedPosts() {
    const res = await api.get('/admin/moderation/flagged-posts');
    return res.data;
  },

  async moderateFlaggedPost(postId: string, action: 'delete' | 'dismiss') {
    const res = await api.put(`/admin/moderation/flagged-posts/${postId}`, { action });
    return res.data;
  },
};
