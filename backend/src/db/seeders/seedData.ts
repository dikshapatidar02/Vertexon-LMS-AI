import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  avatar_url: string;
  role: 'student' | 'instructor' | 'admin';
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface Course {
  id: string;
  instructor_id: string;
  instructor_name: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
}

export interface Lecture {
  id: string;
  module_id: string;
  title: string;
  video_url: string;
  transcript: string;
  duration_seconds: number;
  order_index: number;
  resource_urls: string[];
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percent: number;
}

export interface LectureProgress {
  id: string;
  enrollment_id: string;
  lecture_id: string;
  watched_seconds: number;
  completed: boolean;
  last_watched_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  lecture_id: string;
  timestamp_seconds: number;
  content: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  lecture_id: string;
  timestamp_seconds: number;
  created_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  instructions: string;
  rubric: { criteria: string; points: number }[];
  due_date: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
}

export interface QuizOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'mcq' | 'multi_select' | 'short_answer';
  order_index: number;
  options?: QuizOption[];
}

export interface Quiz {
  id: string;
  module_id: string;
  title: string;
  is_ai_generated: boolean;
  generated_from_lecture_id?: string;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  started_at: string;
  submitted_at: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon_url: string;
}

export interface UserBadge {
  user_id: string;
  badge_id: number;
  earned_at: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
}

export interface AIChatSession {
  id: string;
  user_id: string;
  course_id: string;
  mode: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}

export interface AIChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'ai';
  content: string;
  source_lecture_ids?: string[];
  created_at: string;
}

export interface Flashcard {
  id: string;
  module_id: string;
  question: string;
  answer: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  course_id: string;
  plan_json: any;
  generated_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  recommended_course_id: string;
  reason: string;
  score: number;
  created_at: string;
}

export interface DiscussionThread {
  id: string;
  course_id: string;
  created_by: string;
  created_by_name: string;
  title: string;
  created_at: string;
  post_count?: number;
}

export interface DiscussionPost {
  id: string;
  thread_id: string;
  user_id: string;
  user_name: string;
  content: string;
  is_flagged: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  course_id: string;
  posted_by: string;
  posted_by_name: string;
  content: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_url: string;
  issued_at: string;
}

export const getInitialData = () => {
  const defaultPasswordHash = bcrypt.hashSync('SecurePass123', 10);
  const studentPasswordHash = bcrypt.hashSync('student123', 10);
  const instructorPasswordHash = bcrypt.hashSync('instructor123', 10);
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);

  const users: User[] = [
    {
      id: 'usr-student-001',
      full_name: 'Ananya Sharma',
      email: 'ananya@example.com',
      password_hash: defaultPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'student',
      is_active: true,
      created_at: new Date('2026-01-15').toISOString(),
    },
    {
      id: 'usr-student-demo',
      full_name: 'Demo Student',
      email: 'student@gmail.com',
      password_hash: studentPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: 'student',
      is_active: true,
      created_at: new Date('2026-01-15').toISOString(),
    },
    {
      id: 'usr-student-002',
      full_name: 'Student User',
      email: 'student@example.com',
      password_hash: defaultPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'student',
      is_active: true,
      created_at: new Date('2026-01-15').toISOString(),
    },
    {
      id: 'usr-instructor-001',
      full_name: 'Rohit Verma',
      email: 'rohit@example.com',
      password_hash: defaultPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'instructor',
      is_active: true,
      created_at: new Date('2025-11-01').toISOString(),
    },
    {
      id: 'usr-instructor-demo',
      full_name: 'Demo Instructor',
      email: 'instructor@gmail.com',
      password_hash: instructorPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'instructor',
      is_active: true,
      created_at: new Date('2025-11-01').toISOString(),
    },
    {
      id: 'usr-instructor-002',
      full_name: 'Instructor User',
      email: 'instructor@example.com',
      password_hash: defaultPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'instructor',
      is_active: true,
      created_at: new Date('2025-11-01').toISOString(),
    },
    {
      id: 'usr-admin-001',
      full_name: 'Meera Patel',
      email: 'meera@example.com',
      password_hash: defaultPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      role: 'admin',
      is_active: true,
      created_at: new Date('2025-09-01').toISOString(),
    },
    {
      id: 'usr-admin-demo',
      full_name: 'Demo Admin',
      email: 'admin@gmail.com',
      password_hash: adminPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      role: 'admin',
      is_active: true,
      created_at: new Date('2025-09-01').toISOString(),
    },
    {
      id: 'usr-admin-002',
      full_name: 'Admin User',
      email: 'admin@example.com',
      password_hash: defaultPasswordHash,
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      role: 'admin',
      is_active: true,
      created_at: new Date('2025-09-01').toISOString(),
    },
  ];

  const dsaThumbnail = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80';
  const mlThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
  const sysThumbnail = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80';

  const courses: Course[] = [
    {
      id: 'crs-dsa-001',
      instructor_id: 'usr-instructor-001',
      instructor_name: 'Rohit Verma',
      title: 'Advanced Data Structures & Algorithms',
      description: 'Master binary trees, dynamic programming, graph traversal, and time complexity analysis with practical coding scenarios and AI tutor support.',
      category: 'Computer Science',
      difficulty: 'intermediate',
      thumbnail_url: dsaThumbnail,
      price: 49.99,
      status: 'approved',
      created_at: new Date('2026-01-10').toISOString(),
    },
    {
      id: 'crs-ml-002',
      instructor_id: 'usr-instructor-001',
      instructor_name: 'Rohit Verma',
      title: 'Machine Learning Foundations & RAG Systems',
      description: 'Understand vector embeddings, transformer architectures, pgvector indexing, and Retrieval-Augmented Generation from scratch.',
      category: 'Artificial Intelligence',
      difficulty: 'advanced',
      thumbnail_url: mlThumbnail,
      price: 79.99,
      status: 'approved',
      created_at: new Date('2026-02-01').toISOString(),
    },
    {
      id: 'crs-sys-003',
      instructor_id: 'usr-instructor-001',
      instructor_name: 'Rohit Verma',
      title: 'Cloud-Native Microservices Architecture',
      description: 'Learn modern distributed system engineering with Node.js, Redis, PostgreSQL, Docker, and API Gateway pattern.',
      category: 'Software Engineering',
      difficulty: 'intermediate',
      thumbnail_url: sysThumbnail,
      price: 59.99,
      status: 'approved',
      created_at: new Date('2026-02-15').toISOString(),
    },
    {
      id: 'crs-pending-004',
      instructor_id: 'usr-instructor-001',
      instructor_name: 'Rohit Verma',
      title: 'Quantum Computing Fundamentals & Qiskit',
      description: 'Introduction to qubits, superposition, quantum entanglement, and algorithm simulation using Python Qiskit.',
      category: 'Emerging Tech',
      difficulty: 'beginner',
      thumbnail_url: dsaThumbnail,
      price: 39.99,
      status: 'pending',
      created_at: new Date('2026-03-20').toISOString(),
    },
  ];

  const modules: Module[] = [
    { id: 'mod-dsa-1', course_id: 'crs-dsa-001', title: 'Module 1: Algorithmic Complexity & Sorting', order_index: 1 },
    { id: 'mod-dsa-2', course_id: 'crs-dsa-001', title: 'Module 2: Graph Theory & Shortest Path', order_index: 2 },
    { id: 'mod-ml-1', course_id: 'crs-ml-002', title: 'Module 1: Embeddings & Vector Search', order_index: 1 },
    { id: 'mod-sys-1', course_id: 'crs-sys-001', title: 'Module 1: Microservices & Event Loops', order_index: 1 },
  ];

  const lectures: Lecture[] = [
    {
      id: 'lec-dsa-101',
      module_id: 'mod-dsa-1',
      title: 'Quicksort & Pivot Selection Strategies',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      transcript: 'Welcome to Lecture 1 on Quicksort. Quicksort is a divide-and-conquer algorithm. It selects a pivot element and partitions the array such that elements smaller than the pivot go to the left, and elements greater go to the right. Average time complexity is O(n log n). However, if the pivot selection is poor—for example selecting the first element of an already sorted array—the worst-case performance degrades to O(n^2). Using randomized pivot selection or median-of-three mitigates this risk.',
      duration_seconds: 420,
      order_index: 1,
      resource_urls: ['https://example.com/slides-quicksort.pdf', 'https://example.com/quicksort-code.py'],
    },
    {
      id: 'lec-dsa-102',
      module_id: 'mod-dsa-1',
      title: 'Merge Sort & Divide-and-Conquer Recurrences',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      transcript: 'Merge Sort is a stable, comparison-based sorting algorithm with a guaranteed time complexity of O(n log n) in all cases. It repeatedly divides the input array into two halves, recursively sorts them, and then merges the sorted halves. Space complexity is O(n) due to auxiliary memory requirements.',
      duration_seconds: 510,
      order_index: 2,
      resource_urls: ['https://example.com/slides-mergesort.pdf'],
    },
    {
      id: 'lec-dsa-201',
      module_id: 'mod-dsa-2',
      title: 'Dijkstra Algorithm & Priority Queue Optimizations',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      transcript: 'Dijkstra algorithm finds the shortest path from a starting node to all other nodes in a weighted graph with non-negative edge weights. By using a Min-Priority Queue (Fibonacci or Binary Heap), the time complexity improves to O((V + E) log V).',
      duration_seconds: 600,
      order_index: 1,
      resource_urls: ['https://example.com/dijkstra-notes.pdf'],
    },
    {
      id: 'lec-ml-101',
      module_id: 'mod-ml-1',
      title: 'Vector Embeddings & Cosine Similarity in pgvector',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      transcript: 'Vector embeddings represent textual content in high-dimensional vector spaces where semantic similarity translates into geometric closeness. We measure closeness using Cosine Distance or Inner Product. In PostgreSQL, pgvector allows indexing embeddings with IVFFlat or HNSW indexes.',
      duration_seconds: 480,
      order_index: 1,
      resource_urls: ['https://example.com/pgvector-guide.pdf'],
    },
  ];

  const enrollments: Enrollment[] = [
    {
      id: 'enr-001',
      user_id: 'usr-student-001',
      course_id: 'crs-dsa-001',
      enrolled_at: new Date('2026-02-01').toISOString(),
      progress_percent: 65,
    },
    {
      id: 'enr-002',
      user_id: 'usr-student-001',
      course_id: 'crs-ml-002',
      enrolled_at: new Date('2026-02-15').toISOString(),
      progress_percent: 25,
    },
  ];

  const lectureProgress: LectureProgress[] = [
    {
      id: 'lp-001',
      enrollment_id: 'enr-001',
      lecture_id: 'lec-dsa-101',
      watched_seconds: 420,
      completed: true,
      last_watched_at: new Date('2026-03-01').toISOString(),
    },
    {
      id: 'lp-002',
      enrollment_id: 'enr-001',
      lecture_id: 'lec-dsa-102',
      watched_seconds: 300,
      completed: false,
      last_watched_at: new Date('2026-03-05').toISOString(),
    },
  ];

  const notes: Note[] = [
    {
      id: 'note-001',
      user_id: 'usr-student-001',
      lecture_id: 'lec-dsa-101',
      timestamp_seconds: 140,
      content: 'Pivot selection degrades to O(n^2) when array is already sorted and first element is selected.',
      created_at: new Date('2026-03-01').toISOString(),
    },
  ];

  const bookmarks: Bookmark[] = [
    {
      id: 'bm-001',
      user_id: 'usr-student-001',
      lecture_id: 'lec-dsa-101',
      timestamp_seconds: 210,
      created_at: new Date('2026-03-01').toISOString(),
    },
  ];

  const assignments: Assignment[] = [
    {
      id: 'asg-001',
      course_id: 'crs-dsa-001',
      title: 'Quicksort & Mergesort Benchmarking Assignment',
      instructions: 'Implement Quicksort with randomized pivot and Mergesort in Python or C++. Compare execution times for array sizes N=10^3, 10^5, and 10^7. Submit a ZIP file containing your code and PDF report.',
      rubric: [
        { criteria: 'Correct Implementation of Quicksort & Mergesort', points: 40 },
        { criteria: 'Benchmark Data & Graphs', points: 30 },
        { criteria: 'Analysis of Pivot Strategies', points: 30 },
      ],
      due_date: new Date('2026-10-15T23:59:59Z').toISOString(),
    },
  ];

  const assignmentSubmissions: AssignmentSubmission[] = [
    {
      id: 'sub-001',
      assignment_id: 'asg-001',
      user_id: 'usr-student-001',
      file_url: 'https://example.com/submissions/ananya_dsa_benchmarks.zip',
      submitted_at: new Date('2026-03-10').toISOString(),
      grade: 92.5,
      feedback: 'Excellent pivot selection benchmarks! Good breakdown of memory overhead.',
    },
  ];

  const quizzes: Quiz[] = [
    {
      id: 'qz-001',
      module_id: 'mod-dsa-1',
      title: 'Sorting Algorithms & Time Complexity Quiz',
      is_ai_generated: false,
      questions: [
        {
          id: 'q-1',
          quiz_id: 'qz-001',
          question_text: 'What is the worst-case time complexity of Quicksort when using a deterministic first-element pivot on a sorted array?',
          question_type: 'mcq',
          order_index: 1,
          options: [
            { id: 'opt-1-1', question_id: 'q-1', option_text: 'O(n log n)', is_correct: false },
            { id: 'opt-1-2', question_id: 'q-1', option_text: 'O(n^2)', is_correct: true },
            { id: 'opt-1-3', question_id: 'q-1', option_text: 'O(n)', is_correct: false },
            { id: 'opt-1-4', question_id: 'q-1', option_text: 'O(log n)', is_correct: false },
          ],
        },
        {
          id: 'q-2',
          quiz_id: 'qz-001',
          question_text: 'Which of the following sorting algorithms are STABLE by default? (Select all that apply)',
          question_type: 'multi_select',
          order_index: 2,
          options: [
            { id: 'opt-2-1', question_id: 'q-2', option_text: 'Merge Sort', is_correct: true },
            { id: 'opt-2-2', question_id: 'q-2', option_text: 'In-place Quicksort', is_correct: false },
            { id: 'opt-2-3', question_id: 'q-2', option_text: 'Insertion Sort', is_correct: true },
            { id: 'opt-2-4', question_id: 'q-2', option_text: 'Heapsort', is_correct: false },
          ],
        },
        {
          id: 'q-3',
          quiz_id: 'qz-001',
          question_text: 'What auxiliary space complexity is required by standard Merge Sort for an array of size n?',
          question_type: 'short_answer',
          order_index: 3,
        },
      ],
    },
  ];

  const quizAttempts: QuizAttempt[] = [
    {
      id: 'qa-001',
      quiz_id: 'qz-001',
      user_id: 'usr-student-001',
      score: 100,
      started_at: new Date('2026-03-02T10:00:00Z').toISOString(),
      submitted_at: new Date('2026-03-02T10:12:00Z').toISOString(),
    },
  ];

  const badges: Badge[] = [
    { id: 1, name: 'First Milestone', description: 'Enrolled in your first course on Vertexon LMS', icon_url: '🚀' },
    { id: 2, name: '7-Day Streak', description: 'Learned continuously for 7 consecutive days', icon_url: '🔥' },
    { id: 3, name: 'Quiz Master', description: 'Achieved a perfect 100% score on a course assessment', icon_url: '🏆' },
    { id: 4, name: 'AI Scholar', description: 'Asked over 10 insightful questions to the AI Tutor', icon_url: '🤖' },
  ];

  const userBadges: UserBadge[] = [
    { user_id: 'usr-student-001', badge_id: 1, earned_at: new Date('2026-02-01').toISOString() },
    { user_id: 'usr-student-001', badge_id: 2, earned_at: new Date('2026-03-01').toISOString() },
    { user_id: 'usr-student-001', badge_id: 3, earned_at: new Date('2026-03-02').toISOString() },
  ];

  const streaks: Streak[] = [
    {
      user_id: 'usr-student-001',
      current_streak: 7,
      longest_streak: 12,
      last_active_date: new Date().toISOString().split('T')[0],
    },
  ];

  const aiChatSessions: AIChatSession[] = [
    {
      id: 'ses-001',
      user_id: 'usr-student-001',
      course_id: 'crs-dsa-001',
      mode: 'intermediate',
      created_at: new Date('2026-03-01').toISOString(),
    },
  ];

  const aiChatMessages: AIChatMessage[] = [
    {
      id: 'msg-001',
      session_id: 'ses-001',
      sender: 'user',
      content: 'Why does quicksort degrade to O(n^2) on sorted input?',
      created_at: new Date('2026-03-01T14:00:00Z').toISOString(),
    },
    {
      id: 'msg-002',
      session_id: 'ses-001',
      sender: 'ai',
      content: 'When quicksort picks the first element as the pivot in an already sorted array, it creates completely unbalanced partitions: one sub-array of length 0 and another of length (n - 1). This results in n recursion levels, leading to a sum of n + (n-1) + ... + 1 = O(n^2) total comparisons. Using randomized pivot or median-of-three pivot avoids this unbalanced partitioning.',
      source_lecture_ids: ['lec-dsa-101'],
      created_at: new Date('2026-03-01T14:00:05Z').toISOString(),
    },
  ];

  const flashcards: Flashcard[] = [
    {
      id: 'fc-001',
      module_id: 'mod-dsa-1',
      question: 'What is the average time complexity of Quicksort?',
      answer: 'O(n log n)',
    },
    {
      id: 'fc-002',
      module_id: 'mod-dsa-1',
      question: 'Why is Merge Sort preferred for linked lists over Quicksort?',
      answer: 'Merge Sort does not require random access memory indexing (unlike array indexing in Quicksort), making pointer manipulations efficient in linked lists.',
    },
    {
      id: 'fc-003',
      module_id: 'mod-dsa-1',
      question: 'What technique guarantees randomized pivot selection in Quicksort?',
      answer: 'Randomized Quicksort (choosing pivot uniformly at random between low and high indices) or Median-of-Three pivot selection.',
    },
  ];

  const recommendations: Recommendation[] = [
    {
      id: 'rec-001',
      user_id: 'usr-student-001',
      recommended_course_id: 'crs-sys-003',
      reason: 'Based on your high mastery in Data Structures, advance into Cloud-Native Systems Architecture.',
      score: 0.94,
      created_at: new Date('2026-03-05').toISOString(),
    },
  ];

  const discussionThreads: DiscussionThread[] = [
    {
      id: 'dt-001',
      course_id: 'crs-dsa-001',
      created_by: 'usr-student-001',
      created_by_name: 'Ananya Sharma',
      title: 'Is Randomized Quicksort guaranteed to run in O(n log n) time in all cases?',
      created_at: new Date('2026-03-03').toISOString(),
      post_count: 2,
    },
  ];

  const discussionPosts: DiscussionPost[] = [
    {
      id: 'dp-001',
      thread_id: 'dt-001',
      user_id: 'usr-student-001',
      user_name: 'Ananya Sharma',
      content: 'I know randomized pivot reduces worst case probability, but mathematically is it impossible to hit O(n^2)?',
      is_flagged: false,
      created_at: new Date('2026-03-03T10:00:00Z').toISOString(),
    },
    {
      id: 'dp-002',
      thread_id: 'dt-001',
      user_id: 'usr-instructor-001',
      user_name: 'Rohit Verma',
      content: 'Great question Ananya! Mathematically, the worst case O(n^2) still has a non-zero probability (1 / n!), but the expected runtime across all randomized choices is strictly O(n log n). For practical engineering purposes, the probability of hitting worst case is negligible.',
      is_flagged: false,
      created_at: new Date('2026-03-03T11:30:00Z').toISOString(),
    },
  ];

  const announcements: Announcement[] = [
    {
      id: 'ann-001',
      course_id: 'crs-dsa-001',
      posted_by: 'usr-instructor-001',
      posted_by_name: 'Rohit Verma',
      content: 'Midterm Benchmarking Assignment is now published! Please check the instructions and submit before the deadline.',
      created_at: new Date('2026-03-01').toISOString(),
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'ntf-001',
      user_id: 'usr-student-001',
      title: 'Assignment Graded',
      body: 'Your submission for Quicksort Benchmarking was graded: 92.5/100',
      is_read: false,
      created_at: new Date('2026-03-10').toISOString(),
    },
    {
      id: 'ntf-002',
      user_id: 'usr-student-001',
      title: '7-Day Streak Badge Unlocked!',
      body: 'Congratulations! You earned the 7-Day Streak badge.',
      is_read: true,
      created_at: new Date('2026-03-01').toISOString(),
    },
  ];

  const certificates: Certificate[] = [
    {
      id: 'cert-001',
      user_id: 'usr-student-001',
      course_id: 'crs-dsa-001',
      certificate_url: 'https://example.com/certificates/ananya_dsa_cert.pdf',
      issued_at: new Date('2026-03-15').toISOString(),
    }
  ];

  const studyPlans: StudyPlan[] = [
    {
      id: 'sp-001',
      user_id: 'usr-student-001',
      course_id: 'crs-dsa-001',
      plan_json: {
        title: 'Personalized Adaptive Study Plan',
        recommendations: [
          'Review Lecture 1: Quicksort Pivot Selection (Weak area identified in Quiz Attempt #1)',
          'Complete Flashcard Revision Deck for Module 1',
          'Attempt Benchmarking Assignment to solidify practical implementation',
        ],
        estimated_hours_remaining: 3.5,
        target_completion_date: '2026-10-15',
      },
      generated_at: new Date().toISOString(),
    },
  ];

  return {
    users,
    courses,
    modules,
    lectures,
    enrollments,
    lectureProgress,
    notes,
    bookmarks,
    assignments,
    assignmentSubmissions,
    quizzes,
    quizAttempts,
    badges,
    userBadges,
    streaks,
    aiChatSessions,
    aiChatMessages,
    studyPlans,
    flashcards,
    recommendations,
    discussionThreads,
    discussionPosts,
    announcements,
    notifications,
    certificates,
  };
};
