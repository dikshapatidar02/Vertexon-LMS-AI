import { INITIAL_ACHIEVEMENTS, INITIAL_COURSES } from '../utils/demoData';
import { getEnrolledCourseIds, getCompletedLectures } from '../utils/storage';

export const dashboardService = {
  async getStudentDashboard() {
    const enrolledIds = getEnrolledCourseIds();
    const completedLectures = getCompletedLectures();
    return {
      enrolledCount: enrolledIds.length,
      completedLecturesCount: completedLectures.length,
      streakDays: 7,
      achievementsCount: INITIAL_ACHIEVEMENTS.filter((a) => a.earned).length,
    };
  },

  async getBadges() {
    return { badges: INITIAL_ACHIEVEMENTS };
  },

  async getStreak() {
    return { current_streak: 7, longest_streak: 12 };
  },

  async getRecommendations() {
    return { recommendations: INITIAL_COURSES.slice(2) };
  },

  async getCertificates() {
    return {
      certificates: [
        {
          id: 'cert-1',
          title: 'Data Structures & Algorithms Masterclass',
          issued_at: '2026-09-15',
          verification_url: 'https://vertexon-lms.netlify.app/certificates/verify/VTX-CERT-2026-88912',
        },
      ],
    };
  },
};
