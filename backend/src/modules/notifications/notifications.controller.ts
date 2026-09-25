import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../db/store';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getCourseAnnouncements = async (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.params;
  const list = dbStore.announcements.filter((a) => a.course_id === courseId);
  res.json({ announcements: list });
};

export const createAnnouncement = async (req: AuthenticatedRequest, res: Response) => {
  const { course_id, content } = req.body;
  if (!course_id || !content) {
    throw new AppError('course_id and content required', 400, 'VALIDATION_ERROR');
  }

  const course = dbStore.courses.find((c) => c.id === course_id);
  if (!course) {
    throw new AppError('Course not found', 404, 'NOT_FOUND');
  }

  const announcement = {
    id: `ann-${uuidv4().slice(0, 8)}`,
    course_id,
    posted_by: req.user!.id,
    posted_by_name: req.user!.full_name,
    content,
    created_at: new Date().toISOString(),
  };

  dbStore.announcements.push(announcement);

  // Notify enrolled students
  const enrolledStudents = dbStore.enrollments.filter((e) => e.course_id === course_id);
  enrolledStudents.forEach((enr) => {
    dbStore.notifications.push({
      id: `ntf-${uuidv4().slice(0, 8)}`,
      user_id: enr.user_id,
      title: `Announcement: ${course.title}`,
      body: content.slice(0, 100) + '...',
      is_read: false,
      created_at: new Date().toISOString(),
    });
  });

  res.status(201).json({ announcement });
};

export const getMyNotifications = async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user!.id;
  const userNotifications = dbStore.notifications
    .filter((n) => n.user_id === user_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  res.json({ notifications: userNotifications });
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const notification = dbStore.notifications.find((n) => n.id === id && n.user_id === req.user!.id);
  if (notification) {
    notification.is_read = true;
  }
  res.json({ notification });
};
