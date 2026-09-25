import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../../db/store';
import { AppError } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const createAssignment = async (req: AuthenticatedRequest, res: Response) => {
  const { course_id, title, instructions, rubric = [], due_date } = req.body;

  if (!course_id || !title || !instructions) {
    throw new AppError('course_id, title, and instructions are required', 400, 'VALIDATION_ERROR');
  }

  const course = dbStore.courses.find((c) => c.id === course_id);
  if (!course) {
    throw new AppError('Course not found', 404, 'NOT_FOUND');
  }

  const newAssignment = {
    id: `asg-${uuidv4().slice(0, 8)}`,
    course_id,
    title,
    instructions,
    rubric: Array.isArray(rubric) ? rubric : [],
    due_date: due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  dbStore.assignments.push(newAssignment);

  res.status(201).json({ assignment: newAssignment });
};

export const getCourseAssignments = async (req: AuthenticatedRequest, res: Response) => {
  const { courseId } = req.params;
  const courseAssignments = dbStore.assignments.filter((a) => a.course_id === courseId);

  const enriched = courseAssignments.map((asg) => {
    const userSubmission = dbStore.assignmentSubmissions.find(
      (s) => s.assignment_id === asg.id && s.user_id === req.user!.id
    );
    return {
      ...asg,
      submission: userSubmission || null,
    };
  });

  res.json({ assignments: enriched });
};

export const submitAssignment = async (req: AuthenticatedRequest, res: Response) => {
  const { id: assignment_id } = req.params;
  const { file_url } = req.body;

  const assignment = dbStore.assignments.find((a) => a.id === assignment_id);
  if (!assignment) {
    throw new AppError('Assignment not found', 404, 'NOT_FOUND');
  }

  let submission = dbStore.assignmentSubmissions.find(
    (s) => s.assignment_id === assignment_id && s.user_id === req.user!.id
  );

  if (submission) {
    submission.file_url = file_url || submission.file_url;
    submission.submitted_at = new Date().toISOString();
  } else {
    submission = {
      id: `sub-${uuidv4().slice(0, 8)}`,
      assignment_id,
      user_id: req.user!.id,
      file_url: file_url || 'https://example.com/submissions/submission_file.pdf',
      submitted_at: new Date().toISOString(),
    };
    dbStore.assignmentSubmissions.push(submission);
  }

  res.status(201).json({ submission });
};

export const getAssignmentSubmissions = async (req: AuthenticatedRequest, res: Response) => {
  const { id: assignment_id } = req.params;
  const submissions = dbStore.assignmentSubmissions.filter((s) => s.assignment_id === assignment_id);

  const enriched = submissions.map((sub) => {
    const student = dbStore.users.find((u) => u.id === sub.user_id);
    return {
      ...sub,
      student_name: student ? student.full_name : 'Unknown Student',
      student_email: student ? student.email : '',
    };
  });

  res.json({ submissions: enriched });
};

export const gradeSubmission = async (req: AuthenticatedRequest, res: Response) => {
  const { id: submission_id } = req.params;
  const { grade, feedback } = req.body;

  const submission = dbStore.assignmentSubmissions.find((s) => s.id === submission_id);
  if (!submission) {
    throw new AppError('Submission not found', 404, 'NOT_FOUND');
  }

  if (grade !== undefined) submission.grade = Number(grade);
  if (feedback !== undefined) submission.feedback = String(feedback);

  // Send notification to student
  const assignment = dbStore.assignments.find((a) => a.id === submission.assignment_id);
  dbStore.notifications.push({
    id: `ntf-${uuidv4().slice(0, 8)}`,
    user_id: submission.user_id,
    title: 'Assignment Graded',
    body: `Your submission for "${assignment ? assignment.title : 'Assignment'}" has been graded: ${grade}/100`,
    is_read: false,
    created_at: new Date().toISOString(),
  });

  res.json({ submission });
};
