import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../db/store';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getCourseThreads = async (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.params;
  const threads = dbStore.discussionThreads.filter((t) => t.course_id === courseId);

  const enriched = threads.map((t) => {
    const posts = dbStore.discussionPosts.filter((p) => p.thread_id === t.id);
    return {
      ...t,
      post_count: posts.length,
    };
  });

  res.json({ threads: enriched });
};

export const createThread = async (req: AuthenticatedRequest, res: Response) => {
  const { course_id, title, initial_post } = req.body;

  if (!course_id || !title || !initial_post) {
    throw new AppError('course_id, title, and initial_post are required', 400, 'VALIDATION_ERROR');
  }

  const threadId = `dt-${uuidv4().slice(0, 8)}`;
  const newThread = {
    id: threadId,
    course_id,
    created_by: req.user!.id,
    created_by_name: req.user!.full_name,
    title,
    created_at: new Date().toISOString(),
  };

  const newPost = {
    id: `dp-${uuidv4().slice(0, 8)}`,
    thread_id: threadId,
    user_id: req.user!.id,
    user_name: req.user!.full_name,
    content: initial_post,
    is_flagged: false,
    created_at: new Date().toISOString(),
  };

  dbStore.discussionThreads.push(newThread);
  dbStore.discussionPosts.push(newPost);

  res.status(201).json({ thread: newThread, post: newPost });
};

export const getThreadPosts = async (req: AuthenticatedRequest, res: Response) => {
  const { id: thread_id } = req.params;
  const posts = dbStore.discussionPosts.filter((p) => p.thread_id === thread_id);
  res.json({ posts });
};

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  const { id: thread_id } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new AppError('Content is required', 400, 'VALIDATION_ERROR');
  }

  const thread = dbStore.discussionThreads.find((t) => t.id === thread_id);
  if (!thread) {
    throw new AppError('Thread not found', 404, 'NOT_FOUND');
  }

  const newPost = {
    id: `dp-${uuidv4().slice(0, 8)}`,
    thread_id,
    user_id: req.user!.id,
    user_name: req.user!.full_name,
    content,
    is_flagged: false,
    created_at: new Date().toISOString(),
  };

  dbStore.discussionPosts.push(newPost);
  res.status(201).json({ post: newPost });
};
