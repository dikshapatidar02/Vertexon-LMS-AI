import { INITIAL_ASSIGNMENTS } from '../utils/demoData';
import { getSavedSubmissions, saveAssignmentSubmission } from '../utils/storage';

export const assignmentService = {
  async getAssignments(courseId: string) {
    const assignments = INITIAL_ASSIGNMENTS.filter((a) => a.courseId === courseId);
    return { assignments: assignments.length > 0 ? assignments : INITIAL_ASSIGNMENTS };
  },

  async submitAssignment(assignmentId: string, file_url: string) {
    const sub = saveAssignmentSubmission({
      assignmentId,
      submittedAt: new Date().toISOString(),
      fileName: file_url.split('/').pop() || 'submission.pdf',
      fileSize: '1.4 MB',
      notes: 'Submitted via student workspace portal',
      status: 'Submitted',
    });
    return { submission: sub };
  },

  async createAssignment(data: { course_id: string; title: string; instructions: string; rubric?: any[]; due_date?: string }) {
    const newAsg = {
      id: `asg-${Date.now()}`,
      course_id: data.course_id,
      title: data.title,
      instructions: data.instructions,
      rubric: data.rubric || [],
      due_date: data.due_date || new Date().toISOString(),
    };
    return { assignment: newAsg };
  },

  async getSubmissions(assignmentId: string) {
    const submissions = getSavedSubmissions().filter((s: any) => s.assignmentId === assignmentId);
    return { submissions };
  },

  async gradeSubmission(submissionId: string, grade: number, feedback?: string) {
    return { message: 'Submission graded successfully', grade, feedback };
  },
};
