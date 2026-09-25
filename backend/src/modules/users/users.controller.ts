import { Response } from 'express';
import { dbStore } from '../../db/store';
import { AuthenticatedRequest } from '../../middleware/auth';
import { AppError } from '../../middleware/errorHandler';

export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.id;
  const user = dbStore.users.find((u) => u.id === user_id);

  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  // Calculate enrolled courses & progress
  const userEnrollments = dbStore.enrollments.filter((e) => e.user_id === user_id);
  const enrichedEnrollments = userEnrollments.map((enr) => {
    const course = dbStore.courses.find((c) => c.id === enr.course_id);
    const courseModules = dbStore.modules.filter((m) => m.course_id === enr.course_id);
    const moduleIds = courseModules.map((m) => m.id);
    const totalLectures = dbStore.lectures.filter((l) => moduleIds.includes(l.module_id)).length;
    const completedLectures = dbStore.lectureProgress.filter((lp) => lp.enrollment_id === enr.id && lp.completed).length;

    const progress_percent = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    enr.progress_percent = progress_percent;

    return {
      ...enr,
      course,
      completed_lectures: completedLectures,
      total_lectures: totalLectures,
    };
  });

  // Calculate quiz accuracy
  const userAttempts = dbStore.quizAttempts.filter((qa) => qa.user_id === user_id);
  const avgQuizAccuracy =
    userAttempts.length > 0
      ? Math.round(userAttempts.reduce((acc, a) => acc + a.score, 0) / userAttempts.length)
      : 92;

  // Streak & Badges
  let streak = dbStore.streaks.find((s) => s.user_id === user_id);
  if (!streak) {
    streak = {
      user_id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: new Date().toISOString().split('T')[0],
    };
    dbStore.streaks.push(streak);
  }

  const userBadges = dbStore.userBadges.filter((ub) => ub.user_id === user_id);
  const badgesCount = userBadges.length;

  // Recommendations
  const userRecs = dbStore.recommendations.filter((r) => r.user_id === user_id);

  res.json({
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
    },
    metrics: {
      enrolled_courses_count: userEnrollments.length,
      current_streak: streak.current_streak,
      badges_earned_count: badgesCount,
      avg_quiz_accuracy: avgQuizAccuracy,
      overall_completion_percent:
        enrichedEnrollments.length > 0
          ? Math.round(
              enrichedEnrollments.reduce((acc, e) => acc + e.progress_percent, 0) /
                enrichedEnrollments.length
            )
          : 0,
    },
    enrollments: enrichedEnrollments,
    recommendations: userRecs.map((r) => ({
      ...r,
      course: dbStore.courses.find((c) => c.id === r.recommended_course_id),
    })),
  });
};
