import { Response } from 'express';
import { dbStore } from '../../db/store';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getMyRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.id;
  const userRecs = dbStore.recommendations.filter((r) => r.user_id === user_id);

  const enriched = userRecs.map((rec) => {
    const course = dbStore.courses.find((c) => c.id === rec.recommended_course_id);
    return {
      ...rec,
      course,
    };
  });

  res.json({ recommendations: enriched });
};

export const getMyBadges = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.id;
  const userBadgeIds = dbStore.userBadges.filter((ub) => ub.user_id === user_id);

  const enriched = dbStore.badges.map((b) => {
    const earned = userBadgeIds.find((ub) => ub.badge_id === b.id);
    return {
      ...b,
      is_earned: Boolean(earned),
      earned_at: earned ? earned.earned_at : null,
    };
  });

  res.json({ badges: enriched });
};

export const getMyStreak = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.id;
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

  res.json({ streak });
};

export const getCourseLeaderboard = async (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.params;
  const enrollments = dbStore.enrollments.filter((e) => e.course_id === courseId);

  const leaderboard = enrollments
    .map((e) => {
      const student = dbStore.users.find((u) => u.id === e.user_id);
      const attempts = dbStore.quizAttempts.filter((qa) => qa.user_id === e.user_id);
      const avgScore = attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length) : 0;

      return {
        user_id: e.user_id,
        user_name: student ? student.full_name : 'Anonymous Student',
        avatar_url: student ? student.avatar_url : '',
        progress_percent: e.progress_percent,
        avg_quiz_score: avgScore,
      };
    })
    .sort((a, b) => b.progress_percent + b.avg_quiz_score - (a.progress_percent + a.avg_quiz_score));

  res.json({ leaderboard });
};

export const getMyCertificates = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.id;
  const userCerts = dbStore.certificates.filter((c) => c.user_id === user_id);

  const enriched = userCerts.map((cert) => {
    const course = dbStore.courses.find((c) => c.id === cert.course_id);
    return {
      ...cert,
      course_title: course ? course.title : 'Course',
    };
  });

  res.json({ certificates: enriched });
};
