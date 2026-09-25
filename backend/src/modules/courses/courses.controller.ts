import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../db/store';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getCourses = async (req: Request, res: Response) => {
  const { category, difficulty, q, status } = req.query;

  let filtered = dbStore.courses;

  // Non-admin users only see approved courses by default
  if (!status) {
    filtered = filtered.filter((c) => c.status === 'approved');
  } else {
    filtered = filtered.filter((c) => c.status === status);
  }

  if (category) {
    filtered = filtered.filter((c) => c.category.toLowerCase() === String(category).toLowerCase());
  }

  if (difficulty) {
    filtered = filtered.filter((c) => c.difficulty.toLowerCase() === String(difficulty).toLowerCase());
  }

  if (q) {
    const query = String(q).toLowerCase();
    filtered = filtered.filter(
      (c) => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
    );
  }

  res.json({
    courses: filtered.map((c) => {
      const courseModules = dbStore.modules.filter((m) => m.course_id === c.id);
      const moduleIds = courseModules.map((m) => m.id);
      const totalLectures = dbStore.lectures.filter((l) => moduleIds.includes(l.module_id)).length;
      const totalEnrollments = dbStore.enrollments.filter((e) => e.course_id === c.id).length;
      return {
        ...c,
        total_modules: courseModules.length,
        total_lectures: totalLectures,
        enrolled_count: totalEnrollments,
      };
    }),
  });
};

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = dbStore.courses.find((c) => c.id === id);

  if (!course) {
    throw new AppError('Course not found', 404, 'NOT_FOUND');
  }

  const courseModules = dbStore.modules
    .filter((m) => m.course_id === course.id)
    .sort((a, b) => a.order_index - b.order_index)
    .map((m) => {
      const moduleLectures = dbStore.lectures
        .filter((l) => l.module_id === m.id)
        .sort((a, b) => a.order_index - b.order_index);
      const moduleQuizzes = dbStore.quizzes.filter((q) => q.module_id === m.id);
      return {
        ...m,
        lectures: moduleLectures,
        quizzes: moduleQuizzes,
      };
    });

  const enrolledCount = dbStore.enrollments.filter((e) => e.course_id === course.id).length;

  res.json({
    course: {
      ...course,
      modules: courseModules,
      enrolled_count: enrolledCount,
    },
  });
};

export const createCourse = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, category, difficulty = 'intermediate', price = 0, thumbnail_url } = req.body;

  if (!title || !description || !category) {
    throw new AppError('Title, description, and category are required', 400, 'VALIDATION_ERROR');
  }

  const newCourse = {
    id: `crs-${uuidv4().slice(0, 8)}`,
    instructor_id: req.user!.id,
    instructor_name: req.user!.full_name,
    title,
    description,
    category,
    difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
    thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1516116211223-47a12980df96?w=600',
    price: Number(price),
    status: 'pending' as const,
    created_at: new Date().toISOString(),
  };

  dbStore.courses.push(newCourse);

  res.status(201).json({
    course: newCourse,
    message: 'Course created successfully. Pending admin approval.',
  });
};

export const updateCourse = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const course = dbStore.courses.find((c) => c.id === id);

  if (!course) {
    throw new AppError('Course not found', 404, 'NOT_FOUND');
  }

  if (course.instructor_id !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('Not authorized to edit this course', 403, 'FORBIDDEN');
  }

  const { title, description, category, difficulty, price, thumbnail_url } = req.body;
  if (title) course.title = title;
  if (description) course.description = description;
  if (category) course.category = category;
  if (difficulty) course.difficulty = difficulty;
  if (price !== undefined) course.price = Number(price);
  if (thumbnail_url) course.thumbnail_url = thumbnail_url;

  res.json({ course });
};

export const addModule = async (req: AuthenticatedRequest, res: Response) => {
  const { id: course_id } = req.params;
  const { title, order_index } = req.body;

  const course = dbStore.courses.find((c) => c.id === course_id);
  if (!course) {
    throw new AppError('Course not found', 404, 'NOT_FOUND');
  }

  if (course.instructor_id !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('Not authorized to modify this course', 403, 'FORBIDDEN');
  }

  const existingModules = dbStore.modules.filter((m) => m.course_id === course_id);
  const newModule = {
    id: `mod-${uuidv4().slice(0, 8)}`,
    course_id,
    title: title || `Module ${existingModules.length + 1}`,
    order_index: order_index || existingModules.length + 1,
  };

  dbStore.modules.push(newModule);
  res.status(201).json({ module: newModule });
};

export const addLecture = async (req: AuthenticatedRequest, res: Response) => {
  const { id: module_id } = req.params;
  const { title, video_url, transcript, duration_seconds = 300, resource_urls = [] } = req.body;

  const targetModule = dbStore.modules.find((m) => m.id === module_id);
  if (!targetModule) {
    throw new AppError('Module not found', 404, 'NOT_FOUND');
  }

  const course = dbStore.courses.find((c) => c.id === targetModule.course_id);
  if (course && course.instructor_id !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('Not authorized to add lectures to this course', 403, 'FORBIDDEN');
  }

  const existingLectures = dbStore.lectures.filter((l) => l.module_id === module_id);
  const newLecture = {
    id: `lec-${uuidv4().slice(0, 8)}`,
    module_id,
    title,
    video_url: video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    transcript: transcript || 'Default lecture transcript introducing core concept.',
    duration_seconds: Number(duration_seconds),
    order_index: existingLectures.length + 1,
    resource_urls: Array.isArray(resource_urls) ? resource_urls : [],
  };

  dbStore.lectures.push(newLecture);
  res.status(201).json({ lecture: newLecture });
};

export const approveCourse = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { decision, comment } = req.body; // decision: 'approved' | 'rejected'

  const course = dbStore.courses.find((c) => c.id === id);
  if (!course) {
    throw new AppError('Course not found', 404, 'NOT_FOUND');
  }

  if (decision !== 'approved' && decision !== 'rejected') {
    throw new AppError("Decision must be 'approved' or 'rejected'", 400, 'VALIDATION_ERROR');
  }

  course.status = decision;

  // Add notification to instructor
  dbStore.notifications.push({
    id: `ntf-${uuidv4().slice(0, 8)}`,
    user_id: course.instructor_id,
    title: `Course ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
    body: `Your course "${course.title}" was ${decision} by platform administrators. ${comment ? `Reason: ${comment}` : ''}`,
    is_read: false,
    created_at: new Date().toISOString(),
  });

  res.json({
    message: `Course ${decision} successfully`,
    course,
  });
};
