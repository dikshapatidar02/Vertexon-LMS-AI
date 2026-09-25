import { getInitialData, User, Course, Module, Lecture, Enrollment, LectureProgress, Note, Bookmark, Assignment, AssignmentSubmission, Quiz, QuizAttempt, Badge, UserBadge, Streak, AIChatSession, AIChatMessage, StudyPlan, Flashcard, Recommendation, DiscussionThread, DiscussionPost, Announcement, Notification, Certificate } from './seeders/seedData';

class Store {
  public users: User[];
  public courses: Course[];
  public modules: Module[];
  public lectures: Lecture[];
  public enrollments: Enrollment[];
  public lectureProgress: LectureProgress[];
  public notes: Note[];
  public bookmarks: Bookmark[];
  public assignments: Assignment[];
  public assignmentSubmissions: AssignmentSubmission[];
  public quizzes: Quiz[];
  public quizAttempts: QuizAttempt[];
  public badges: Badge[];
  public userBadges: UserBadge[];
  public streaks: Streak[];
  public aiChatSessions: AIChatSession[];
  public aiChatMessages: AIChatMessage[];
  public studyPlans: StudyPlan[];
  public flashcards: Flashcard[];
  public recommendations: Recommendation[];
  public discussionThreads: DiscussionThread[];
  public discussionPosts: DiscussionPost[];
  public announcements: Announcement[];
  public notifications: Notification[];
  public certificates: Certificate[];
  public resetTokens: { token: string; user_id: string; expires_at: number }[];

  constructor() {
    this.resetTokens = [];
    const initial = getInitialData();
    this.users = initial.users;
    this.courses = initial.courses;
    this.modules = initial.modules;
    this.lectures = initial.lectures;
    this.enrollments = initial.enrollments;
    this.lectureProgress = initial.lectureProgress;
    this.notes = initial.notes;
    this.bookmarks = initial.bookmarks;
    this.assignments = initial.assignments;
    this.assignmentSubmissions = initial.assignmentSubmissions;
    this.quizzes = initial.quizzes;
    this.quizAttempts = initial.quizAttempts;
    this.badges = initial.badges;
    this.userBadges = initial.userBadges;
    this.streaks = initial.streaks;
    this.aiChatSessions = initial.aiChatSessions;
    this.aiChatMessages = initial.aiChatMessages;
    this.studyPlans = initial.studyPlans || [];
    this.flashcards = initial.flashcards;
    this.recommendations = initial.recommendations;
    this.discussionThreads = initial.discussionThreads;
    this.discussionPosts = initial.discussionPosts;
    this.announcements = initial.announcements;
    this.notifications = initial.notifications;
    this.certificates = initial.certificates;
  }
}

export const dbStore = new Store();
