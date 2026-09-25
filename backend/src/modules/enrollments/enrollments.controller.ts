import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../db/store';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const enrollInCourse = async (req: AuthenticatedRequest, res: Response) => {
  const { id: course_id } = req.params;
  const user_id = req.user!.id;

  const course = dbStore.courses.find((c) => c.id === course_id);
  if (!course) {
    throw new AppError('Course not found', 404, 'NOT_FOUND');
  }

  const existing = dbStore.enrollments.find((e) => e.user_id === user_id && e.course_id === course_id);
  if (existing) {
    return res.json({ enrollment: existing, message: 'Already enrolled' });
  }

  const newEnrollment = {
    id: `enr-${uuidv4().slice(0, 8)}`,
    user_id,
    course_id,
    enrolled_at: new Date().toISOString(),
    progress_percent: 0,
  };

  dbStore.enrollments.push(newEnrollment);

  // Check if first course milestone badge awarded
  const studentEnrollments = dbStore.enrollments.filter((e) => e.user_id === user_id);
  if (studentEnrollments.length === 1) {
    const hasBadge = dbStore.userBadges.some((ub) => ub.user_id === user_id && ub.badge_id === 1);
    if (!hasBadge) {
      dbStore.userBadges.push({
        user_id,
        badge_id: 1,
        earned_at: new Date().toISOString(),
      });
    }
  }

  res.status(201).json({ enrollment: newEnrollment });
};

export const getMyEnrollments = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.id;
  const userEnrollments = dbStore.enrollments.filter((e) => e.user_id === user_id);

  const enriched = userEnrollments.map((enr) => {
    const course = dbStore.courses.find((c) => c.id === enr.course_id);
    const courseModules = dbStore.modules.filter((m) => m.course_id === enr.course_id);
    const moduleIds = courseModules.map((m) => m.id);
    const totalLectures = dbStore.lectures.filter((l) => moduleIds.includes(l.module_id)).length;
    
    // Count completed lectures
    const completedLectures = dbStore.lectureProgress.filter(
      (lp) => lp.enrollment_id === enr.id && lp.completed
    ).length;

    const calculatedProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    enr.progress_percent = calculatedProgress;

    return {
      ...enr,
      course,
      total_lectures: totalLectures,
      completed_lectures: completedLectures,
    };
  });

  res.json({ enrollments: enriched });
};

export const updateLectureProgress = async (req: AuthenticatedRequest, res: Response) => {
  const { id: lecture_id } = req.params;
  const { watched_seconds, completed } = req.body;
  const user_id = req.user!.id;

  const lecture = dbStore.lectures.find((l) => l.id === lecture_id);
  if (!lecture) {
    throw new AppError('Lecture not found', 404, 'NOT_FOUND');
  }

  const moduleObj = dbStore.modules.find((m) => m.id === lecture.module_id);
  if (!moduleObj) {
    throw new AppError('Module not found', 404, 'NOT_FOUND');
  }

  const enrollment = dbStore.enrollments.find((e) => e.user_id === user_id && e.course_id === moduleObj.course_id);
  if (!enrollment) {
    throw new AppError('Student is not enrolled in this course', 403, 'FORBIDDEN');
  }

  let progress = dbStore.lectureProgress.find((lp) => lp.enrollment_id === enrollment.id && lp.lecture_id === lecture_id);
  if (!progress) {
    progress = {
      id: `lp-${uuidv4().slice(0, 8)}`,
      enrollment_id: enrollment.id,
      lecture_id,
      watched_seconds: Number(watched_seconds || 0),
      completed: Boolean(completed),
      last_watched_at: new Date().toISOString(),
    };
    dbStore.lectureProgress.push(progress);
  } else {
    if (watched_seconds !== undefined) progress.watched_seconds = Number(watched_seconds);
    if (completed !== undefined) progress.completed = Boolean(completed);
    progress.last_watched_at = new Date().toISOString();
  }

  // Recalculate enrollment total progress
  const courseModules = dbStore.modules.filter((m) => m.course_id === moduleObj.course_id);
  const moduleIds = courseModules.map((m) => m.id);
  const allLectures = dbStore.lectures.filter((l) => moduleIds.includes(l.module_id));
  const completedCount = dbStore.lectureProgress.filter((lp) => lp.enrollment_id === enrollment.id && lp.completed).length;

  enrollment.progress_percent = allLectures.length > 0 ? Math.round((completedCount / allLectures.length) * 100) : 0;

  // Auto-generate certificate if 100% complete
  if (enrollment.progress_percent >= 100) {
    const existingCert = dbStore.certificates.find((c) => c.user_id === user_id && c.course_id === moduleObj.course_id);
    if (!existingCert) {
      dbStore.certificates.push({
        id: `cert-${uuidv4().slice(0, 8)}`,
        user_id,
        course_id: moduleObj.course_id,
        certificate_url: `/api/v1/certificates/download/${user_id}_${moduleObj.course_id}.pdf`,
        issued_at: new Date().toISOString(),
      });
    }
  }

  res.json({ progress, overall_progress: enrollment.progress_percent });
};

export const addNote = async (req: AuthenticatedRequest, res: Response) => {
  const { id: lecture_id } = req.params;
  const { timestamp_seconds = 0, content } = req.body;

  if (!content) {
    throw new AppError('Note content is required', 400, 'VALIDATION_ERROR');
  }

  const newNote = {
    id: `note-${uuidv4().slice(0, 8)}`,
    user_id: req.user!.id,
    lecture_id,
    timestamp_seconds: Number(timestamp_seconds),
    content,
    created_at: new Date().toISOString(),
  };

  dbStore.notes.push(newNote);
  res.status(201).json({ note: newNote });
};

export const getNotes = async (req: AuthenticatedRequest, res: Response) => {
  const { id: lecture_id } = req.params;
  const userNotes = dbStore.notes.filter((n) => n.lecture_id === lecture_id && n.user_id === req.user!.id);
  res.json({ notes: userNotes });
};

export const addBookmark = async (req: AuthenticatedRequest, res: Response) => {
  const { id: lecture_id } = req.params;
  const { timestamp_seconds = 0 } = req.body;

  const newBookmark = {
    id: `bm-${uuidv4().slice(0, 8)}`,
    user_id: req.user!.id,
    lecture_id,
    timestamp_seconds: Number(timestamp_seconds),
    created_at: new Date().toISOString(),
  };

  dbStore.bookmarks.push(newBookmark);
  res.status(201).json({ bookmark: newBookmark });
};

export const getBookmarks = async (req: AuthenticatedRequest, res: Response) => {
  const { id: lecture_id } = req.params;
  const userBookmarks = dbStore.bookmarks.filter((b) => b.lecture_id === lecture_id && b.user_id === req.user!.id);
  res.json({ bookmarks: userBookmarks });
};
