import { INITIAL_DEMO_USERS, INITIAL_COURSES } from '../utils/demoData';

const userList = Object.values(INITIAL_DEMO_USERS);

export const adminService = {
  async getUsers(params?: { q?: string; role?: string }) {
    let users = [...userList];
    if (params?.role && params.role !== 'all') {
      users = users.filter((u) => u.role === params.role);
    }
    if (params?.q) {
      const qLower = params.q.toLowerCase();
      users = users.filter(
        (u) => u.full_name.toLowerCase().includes(qLower) || u.email.toLowerCase().includes(qLower)
      );
    }
    return { users };
  },

  async updateUserRole(userId: string, role: string) {
    return { message: `User ${userId} role updated to ${role}` };
  },

  async toggleSuspendUser(userId: string) {
    return { message: `User ${userId} status toggled` };
  },

  async getPendingCourses() {
    return { courses: INITIAL_COURSES.filter((c: any) => c.status === 'pending') };
  },

  async getAnalyticsOverview() {
    return {
      metrics: {
        daily_active_users: 412,
        total_users: 1420,
        total_students: 1240,
        total_instructors: 178,
        total_courses: INITIAL_COURSES.length,
        approved_courses: 22,
        pending_courses: 2,
        total_enrollments: 3890,
        completion_rate: 84.2,
        total_revenue: 14850.0,
        ai_doubt_resolution_avg_seconds: 3.4,
      },
    };
  },

  async getFlaggedPosts() {
    return {
      posts: [
        {
          id: 'flag-1',
          content: 'Buy cheap assignment solutions at http://spam-essays.example!',
          author_name: 'SpamAccount',
          flag_reason: 'Commercial Spam',
          created_at: new Date().toISOString(),
        },
      ],
    };
  },

  async moderateFlaggedPost(postId: string, action: 'delete' | 'dismiss') {
    return { message: `Flagged post ${postId} ${action}d` };
  },
};
