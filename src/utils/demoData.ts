export interface DemoUser {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar_url: string;
  title?: string;
  bio?: string;
  joined_date: string;
  completed_courses_count: number;
  certificates_count: number;
  streak_days: number;
}

export interface DemoLecture {
  id: string;
  module_id: string;
  title: string;
  duration: string;
  duration_seconds: number;
  video_url?: string;
  transcript: string;
  order_index: number;
  resources: { name: string; url: string; type: string }[];
}

export interface DemoModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  lectures: DemoLecture[];
}

export interface DemoCourse {
  id: string;
  title: string;
  short_description: string;
  description: string;
  category: 'Computer Science' | 'Artificial Intelligence' | 'Software Engineering' | 'Emerging Tech';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  rating: number;
  students_enrolled: number;
  instructor_id: string;
  instructor_name: string;
  instructor_title: string;
  thumbnail_url: string;
  duration: string;
  total_lectures: number;
  objectives: string[];
  prerequisites: string[];
  modules: DemoModule[];
  is_enrolled?: boolean;
  progress_percentage?: number;
}

export interface DemoAssignment {
  id: string;
  course_id: string;
  course_title: string;
  title: string;
  instructions: string;
  due_date: string;
  points: number;
  rubric: { criteria: string; points: number }[];
  submission?: {
    file_url: string;
    submitted_at: string;
    grade?: number;
    feedback?: string;
    status: 'submitted' | 'graded';
  };
}

export interface DemoQuestion {
  id: string;
  question_text: string;
  question_type: 'mcq' | 'multi_select' | 'short_answer';
  options?: { id: string; option_text: string; is_correct?: boolean }[];
  explanation?: string;
}

export interface DemoQuiz {
  id: string;
  course_id: string;
  course_title: string;
  title: string;
  time_limit_minutes: number;
  questions: DemoQuestion[];
  is_ai_generated?: boolean;
}

export interface DemoCertificate {
  id: string;
  course_id: string;
  course_title: string;
  student_name: string;
  instructor_name: string;
  issued_at: string;
  credential_id: string;
  verification_url: string;
}

export interface DemoBadge {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  category: 'streak' | 'course' | 'quiz' | 'mastery';
  earned: boolean;
  earned_date?: string;
}

export interface DemoNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assignment' | 'quiz' | 'certificate' | 'announcement';
  link_url?: string;
}

export interface DemoDiscussionPost {
  id: string;
  user_name: string;
  user_role: string;
  user_avatar: string;
  content: string;
  created_at: string;
  likes_count: number;
  is_liked?: boolean;
  is_flagged?: boolean;
}

export interface DemoDiscussionThread {
  id: string;
  course_id: string;
  course_title: string;
  title: string;
  created_by_name: string;
  created_by_avatar: string;
  created_at: string;
  replies_count: number;
  posts: DemoDiscussionPost[];
}

// ----------------------------------------------------
// DEMO ACCOUNTS DATA
// ----------------------------------------------------

export const INITIAL_DEMO_USERS: Record<string, DemoUser> = {
  student: {
    id: 'usr-student-001',
    full_name: 'Alex Morgan',
    email: 'student@gmail.com',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'Computer Science Major',
    bio: 'Passionate student exploring data structures, algorithms, and applied machine learning.',
    joined_date: 'Jan 2026',
    completed_courses_count: 2,
    certificates_count: 2,
    streak_days: 7,
  },
  instructor: {
    id: 'usr-instructor-001',
    full_name: 'Dr. Rohit Verma',
    email: 'instructor@gmail.com',
    role: 'instructor',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    title: 'Senior Professor of Computer Science',
    bio: '12+ years of teaching experience in algorithm design, quantum computing, and AI architectures.',
    joined_date: 'Sep 2024',
    completed_courses_count: 14,
    certificates_count: 14,
    streak_days: 45,
  },
  admin: {
    id: 'usr-admin-001',
    full_name: 'Meera Patel',
    email: 'admin@gmail.com',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    title: 'Vertexon System Administrator',
    bio: 'Managing enterprise LMS security, user governance, content approval, and platform metrics.',
    joined_date: 'Aug 2024',
    completed_courses_count: 8,
    certificates_count: 8,
    streak_days: 120,
  },
};

// ----------------------------------------------------
// DEMO COURSES DATA
// ----------------------------------------------------

export const INITIAL_DEMO_COURSES: DemoCourse[] = [
  {
    id: 'crs-dsa-001',
    title: 'Advanced Data Structures & Algorithms',
    short_description: 'Master Quicksort, Mergesort, Dynamic Programming, and Graph Traversals with practical algorithmic analysis.',
    description: 'This comprehensive computer science course provides rigorous training in fundamental and advanced algorithmic principles. You will cover divide-and-conquer strategy, pivot optimization in Quicksort, recursive Merge Sort complexity proofs, Dijkstra and Bellman-Ford shortest paths, and dynamic programming optimization on trees.',
    category: 'Computer Science',
    difficulty: 'intermediate',
    price: 49.99,
    rating: 4.9,
    students_enrolled: 1240,
    instructor_id: 'usr-instructor-001',
    instructor_name: 'Dr. Rohit Verma',
    instructor_title: 'Senior Professor of CS',
    thumbnail_url: 'https://images.unsplash.com/photo-1516116211223-425856879be4?auto=format&fit=crop&w=800&q=80',
    duration: '14.5 Hours',
    total_lectures: 4,
    is_enrolled: true,
    progress_percentage: 65,
    objectives: [
      'Understand the mathematical runtime proofs for O(n log n) divide-and-conquer algorithms.',
      'Implement in-place Quicksort with randomized pivot strategies to avoid worst-case O(n²) degradation.',
      'Apply Dijkstra and A* pathfinding algorithms on weighted non-negative graphs.',
      'Construct state transitions for dynamic programming problems over multi-dimensional states.'
    ],
    prerequisites: [
      'Basic knowledge of Python, C++, or Java programming',
      'High school algebra and familiarity with logarithms'
    ],
    modules: [
      {
        id: 'mod-dsa-1',
        course_id: 'crs-dsa-001',
        title: 'Module 1: Divide-and-Conquer Sorting Algorithms',
        order_index: 1,
        lectures: [
          {
            id: 'lec-dsa-101',
            module_id: 'mod-dsa-1',
            title: 'Quicksort & Pivot Selection Strategies',
            duration: '24:15',
            duration_seconds: 1455,
            transcript: 'Welcome to Lecture 1 on Quicksort. Quicksort is an efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy. The key step is selecting a pivot element. If a deterministic first-element pivot is chosen on an already sorted array, the runtime degrades to O(n²). However, randomized pivot selection or median-of-three guarantees an expected O(n log n) runtime.',
            order_index: 1,
            resources: [
              { name: 'Quicksort Memory Trace Diagram (PDF)', url: '#', type: 'pdf' },
              { name: 'Python Quicksort Implementation (.py)', url: '#', type: 'code' }
            ]
          },
          {
            id: 'lec-dsa-102',
            module_id: 'mod-dsa-1',
            title: 'Merge Sort Recurrence & Auxiliary Space Complexity',
            duration: '18:40',
            duration_seconds: 1120,
            transcript: 'In this lecture we analyze Merge Sort. Merge Sort has a deterministic worst-case runtime of O(n log n), proved using the Master Theorem. Unlike Quicksort, Merge Sort requires O(n) auxiliary space for temporary subarray merges.',
            order_index: 2,
            resources: [
              { name: 'Merge Sort Proof Notes (PDF)', url: '#', type: 'pdf' }
            ]
          }
        ]
      },
      {
        id: 'mod-dsa-2',
        course_id: 'crs-dsa-001',
        title: 'Module 2: Graph Algorithms & Shortest Paths',
        order_index: 2,
        lectures: [
          {
            id: 'lec-dsa-201',
            module_id: 'mod-dsa-2',
            title: 'Dijkstra Algorithm & Min-Priority Queues',
            duration: '32:10',
            duration_seconds: 1930,
            transcript: 'Dijkstra algorithm computes shortest paths from a single source node to all other nodes in a non-negative weighted graph. Using a binary min-heap priority queue, the total runtime is reduced to O((V + E) log V).',
            order_index: 1,
            resources: [
              { name: 'Dijkstra Heap Benchmark Code', url: '#', type: 'code' }
            ]
          },
          {
            id: 'lec-dsa-202',
            module_id: 'mod-dsa-2',
            title: 'Dynamic Programming State Formulation on Trees',
            duration: '28:50',
            duration_seconds: 1730,
            transcript: 'Dynamic programming on tree structures combines post-order traversal with memoization tables. We formulate subproblems for nodes and their child subtrees to solve the Maximum Independent Set on Trees in O(V) time.',
            order_index: 2,
            resources: [
              { name: 'Tree DP Problem Set Solution', url: '#', type: 'pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'crs-ai-002',
    title: 'Generative AI & LLM Systems Engineering',
    short_description: 'Build production-ready RAG pipelines, fine-tune transformer models, and optimize vector database retrieval.',
    description: 'An advanced systems-level course on building scalable enterprise artificial intelligence applications. Learn the inner mechanics of Multi-Head Self-Attention in Transformer models, Vector Embeddings indexing with pgvector/HNSW, Retrieval-Augmented Generation (RAG) chunking strategies, and quantization methods (GGUF/AWQ).',
    category: 'Artificial Intelligence',
    difficulty: 'advanced',
    price: 79.99,
    rating: 4.8,
    students_enrolled: 890,
    instructor_id: 'usr-instructor-001',
    instructor_name: 'Dr. Rohit Verma',
    instructor_title: 'AI Systems Architect',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    duration: '18.0 Hours',
    total_lectures: 3,
    is_enrolled: true,
    progress_percentage: 30,
    objectives: [
      'Design modular Retrieval-Augmented Generation architectures with source attribution.',
      'Deploy pgvector HNSW vector indices for millisecond similarity retrieval.',
      'Fine-tune open weights models (Llama 3 / Mistral) using LoRA and QLoRA adapters.'
    ],
    prerequisites: [
      'Intermediate Python proficiency',
      'Basic linear algebra and matrix multiplication'
    ],
    modules: [
      {
        id: 'mod-ai-1',
        course_id: 'crs-ai-002',
        title: 'Module 1: Attention Mechanics & Transformer Architecture',
        order_index: 1,
        lectures: [
          {
            id: 'lec-ai-101',
            module_id: 'mod-ai-1',
            title: 'Scaled Dot-Product Self-Attention Mechanics',
            duration: '35:00',
            duration_seconds: 2100,
            transcript: 'Attention is all you need. In this lecture, we dissect Query, Key, and Value matrices Q, K, V. We compute Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V.',
            order_index: 1,
            resources: [{ name: 'Attention Matrix Calculus PDF', url: '#', type: 'pdf' }]
          }
        ]
      }
    ]
  },
  {
    id: 'crs-web-003',
    title: 'Modern Full-Stack Engineering with React & Node',
    short_description: 'Construct resilient web applications using React, TypeScript, Express, PostgreSQL, and clean architectural patterns.',
    description: 'Learn modern software engineering best practices by building production web platforms. Master state management with Zustand, custom hooks, RESTful API design, database migrations, authentication workflows, and modern UI styling.',
    category: 'Software Engineering',
    difficulty: 'beginner',
    price: 39.99,
    rating: 4.9,
    students_enrolled: 2150,
    instructor_id: 'usr-instructor-001',
    instructor_name: 'Ananya Sharma',
    instructor_title: 'Staff Frontend Engineer',
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    duration: '22.0 Hours',
    total_lectures: 4,
    is_enrolled: false,
    progress_percentage: 0,
    objectives: [
      'Architect TypeScript React frontends with clean separation of layout and domain logic.',
      'Implement scalable Express server middleware and request input validation schemas.',
      'Deploy web applications to production with SPA routing fallback configurations.'
    ],
    prerequisites: ['HTML, CSS, and basic JavaScript basics'],
    modules: [
      {
        id: 'mod-web-1',
        course_id: 'crs-web-003',
        title: 'Module 1: React Fundamentals & Component Design',
        order_index: 1,
        lectures: [
          {
            id: 'lec-web-101',
            module_id: 'mod-web-1',
            title: 'React 18 State Management & Component Lifecycle',
            duration: '21:30',
            duration_seconds: 1290,
            transcript: 'React component architecture relies on declarative UI state and immutability. We explore useState, useEffect, and custom hook composition.',
            order_index: 1,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'crs-sys-004',
    title: 'Distributed Systems & Cloud Architecture',
    short_description: 'Design fault-tolerant distributed networks, consensus algorithms (Raft), and scalable microservices.',
    description: 'Understand the challenges of building fault-tolerant cloud infrastructures. Learn about CAP Theorem, consensus protocols (Raft, Paxos), eventual consistency, event-driven architectures with Kafka, and containerized orchestration.',
    category: 'Emerging Tech',
    difficulty: 'advanced',
    price: 64.99,
    rating: 4.7,
    students_enrolled: 640,
    instructor_id: 'usr-instructor-001',
    instructor_name: 'Dr. Rohit Verma',
    instructor_title: 'Senior Distributed Systems Architect',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    duration: '16.0 Hours',
    total_lectures: 2,
    is_enrolled: false,
    progress_percentage: 0,
    objectives: [
      'Evaluate trade-offs between strong vs eventual consistency in global database systems.',
      'Implement leader election and log replication logic using Raft consensus.',
      'Design asynchronous messaging topologies with message queues.'
    ],
    prerequisites: ['Operating systems fundamentals and networking fundamentals'],
    modules: [
      {
        id: 'mod-sys-1',
        course_id: 'crs-sys-004',
        title: 'Module 1: Distributed Consensus & Raft Protocol',
        order_index: 1,
        lectures: [
          {
            id: 'lec-sys-101',
            module_id: 'mod-sys-1',
            title: 'Raft Leader Election & Log Replication',
            duration: '29:40',
            duration_seconds: 1780,
            transcript: 'Raft divides consensus into leader election, log replication, and safety. In this lecture, we trace election timeouts and term numbers.',
            order_index: 1,
            resources: []
          }
        ]
      }
    ]
  }
];

// ----------------------------------------------------
// DEMO ASSIGNMENTS
// ----------------------------------------------------

export const INITIAL_DEMO_ASSIGNMENTS: DemoAssignment[] = [
  {
    id: 'asg-001',
    course_id: 'crs-dsa-001',
    course_title: 'Advanced Data Structures & Algorithms',
    title: 'Quicksort & Mergesort Benchmarking Project',
    instructions: 'Implement Quicksort with randomized pivot selection and Mergesort in Python or C++. Compare execution runtimes across input sizes N=10^3, 10^5, and 10^7. Submit a ZIP file or GitHub repository URL containing your code and PDF performance analysis report.',
    due_date: '2026-10-15T23:59:59Z',
    points: 100,
    rubric: [
      { criteria: 'Correct Implementation of Quicksort & Mergesort', points: 40 },
      { criteria: 'Benchmark Execution Graphs & Datasets', points: 30 },
      { criteria: 'Analysis of Pivot Strategies under Sorted Inputs', points: 30 }
    ],
    submission: {
      file_url: 'https://github.com/alexmorgan/dsa-benchmarks.zip',
      submitted_at: '2026-03-10T14:30:00Z',
      grade: 94.5,
      feedback: 'Outstanding benchmark breakdown! Excellent pivot selection data and clear memory overhead trade-off analysis.',
      status: 'graded'
    }
  },
  {
    id: 'asg-002',
    course_id: 'crs-ai-002',
    course_title: 'Generative AI & LLM Systems Engineering',
    title: 'RAG Pipeline & Vector Search Implementation',
    instructions: 'Build a document chunking and vector retrieval pipeline using pgvector. Ingest the provided course lecture transcripts and implement cosine similarity search with source attribution.',
    due_date: '2026-11-01T23:59:59Z',
    points: 100,
    rubric: [
      { criteria: 'Text Chunking Strategy & Overlap', points: 30 },
      { criteria: 'Vector Store Query Latency (< 100ms)', points: 40 },
      { criteria: 'Source Citation Accuracy in AI Responses', points: 30 }
    ]
  }
];

// ----------------------------------------------------
// DEMO QUIZZES
// ----------------------------------------------------

export const INITIAL_DEMO_QUIZZES: DemoQuiz[] = [
  {
    id: 'qz-001',
    course_id: 'crs-dsa-001',
    course_title: 'Advanced Data Structures & Algorithms',
    title: 'Sorting Algorithms & Time Complexity Quiz',
    time_limit_minutes: 15,
    is_ai_generated: false,
    questions: [
      {
        id: 'q-1',
        question_text: 'What is the worst-case time complexity of Quicksort when using a deterministic first-element pivot on an already sorted array?',
        question_type: 'mcq',
        explanation: 'When the array is already sorted and the first element is selected as pivot, each partition split creates subproblems of size 0 and n-1, resulting in O(n²) total comparisons.',
        options: [
          { id: 'opt-1-1', option_text: 'O(n log n)' },
          { id: 'opt-1-2', option_text: 'O(n²)', is_correct: true },
          { id: 'opt-1-3', option_text: 'O(n)' },
          { id: 'opt-1-4', option_text: 'O(log n)' }
        ]
      },
      {
        id: 'q-2',
        question_text: 'Which of the following sorting algorithms are STABLE by default? (Select all that apply)',
        question_type: 'multi_select',
        explanation: 'Merge Sort and Insertion Sort preserve the relative order of duplicate elements. Standard in-place Quicksort and Heapsort are unstable.',
        options: [
          { id: 'opt-2-1', option_text: 'Merge Sort', is_correct: true },
          { id: 'opt-2-2', option_text: 'In-place Quicksort', is_correct: false },
          { id: 'opt-2-3', option_text: 'Insertion Sort', is_correct: true },
          { id: 'opt-2-4', option_text: 'Heapsort', is_correct: false }
        ]
      },
      {
        id: 'q-3',
        question_text: 'What auxiliary space complexity is required by standard Merge Sort for an array of size n?',
        question_type: 'short_answer',
        explanation: 'Standard Merge Sort requires O(n) auxiliary space to hold elements during the merging phase.',
        options: []
      }
    ]
  },
  {
    id: 'qz-002',
    course_id: 'crs-ai-002',
    course_title: 'Generative AI & LLM Systems Engineering',
    title: 'Self-Attention & Transformer Mechanics Quiz',
    time_limit_minutes: 20,
    is_ai_generated: true,
    questions: [
      {
        id: 'q-2-1',
        question_text: 'In scaled dot-product attention, why is the dot product QK^T divided by sqrt(d_k)?',
        question_type: 'mcq',
        explanation: 'Scaling by 1/sqrt(d_k) prevents large dot product magnitudes from driving softmax into regions with extremely small gradients.',
        options: [
          { id: 'opt-2-1-1', option_text: 'To convert values into probabilities' },
          { id: 'opt-2-1-2', option_text: 'To prevent softmax gradients from vanishing during backpropagation', is_correct: true },
          { id: 'opt-2-1-3', option_text: 'To reduce matrix dimensionality' }
        ]
      }
    ]
  }
];

// ----------------------------------------------------
// DEMO CERTIFICATES
// ----------------------------------------------------

export const INITIAL_DEMO_CERTIFICATES: DemoCertificate[] = [
  {
    id: 'cert-001',
    course_id: 'crs-dsa-001',
    course_title: 'Advanced Data Structures & Algorithms',
    student_name: 'Alex Morgan',
    instructor_name: 'Dr. Rohit Verma',
    issued_at: '2026-03-15',
    credential_id: 'VTX-CERT-2026-88912',
    verification_url: 'https://vertexon-lms.netlify.app/certificates/verify/VTX-CERT-2026-88912'
  },
  {
    id: 'cert-002',
    course_id: 'crs-web-003',
    course_title: 'Modern Full-Stack Engineering with React & Node',
    student_name: 'Alex Morgan',
    instructor_name: 'Ananya Sharma',
    issued_at: '2026-02-10',
    credential_id: 'VTX-CERT-2026-44109',
    verification_url: 'https://vertexon-lms.netlify.app/certificates/verify/VTX-CERT-2026-44109'
  }
];

// ----------------------------------------------------
// DEMO BADGES & ACHIEVEMENTS
// ----------------------------------------------------

export const INITIAL_DEMO_BADGES: DemoBadge[] = [
  {
    id: 'badge-1',
    title: '7-Day Learning Streak',
    description: 'Studied course lectures for 7 consecutive days',
    icon_name: 'Zap',
    category: 'streak',
    earned: true,
    earned_date: 'Mar 24, 2026'
  },
  {
    id: 'badge-2',
    title: 'Algorithm Master',
    description: 'Achieved 100% score on Data Structures & Algorithms Quiz',
    icon_name: 'Award',
    category: 'quiz',
    earned: true,
    earned_date: 'Mar 15, 2026'
  },
  {
    id: 'badge-3',
    title: 'First Graduation',
    description: 'Completed your first accredited course on Vertexon LMS',
    icon_name: 'GraduationCap',
    category: 'course',
    earned: true,
    earned_date: 'Feb 10, 2026'
  },
  {
    id: 'badge-4',
    title: 'AI Scholar',
    description: 'Interacted with AI Tutor RAG engine 50+ times',
    icon_name: 'Sparkles',
    category: 'mastery',
    earned: false
  },
  {
    id: 'badge-5',
    title: 'Community Contributor',
    description: 'Answered 5 student discussion questions in forums',
    icon_name: 'MessageSquare',
    category: 'mastery',
    earned: false
  },
  {
    id: 'badge-6',
    title: '30-Day Master Streak',
    description: 'Maintain an unbroken learning streak for 30 days',
    icon_name: 'Flame',
    category: 'streak',
    earned: false
  }
];

// ----------------------------------------------------
// DEMO NOTIFICATIONS
// ----------------------------------------------------

export const INITIAL_DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: 'notif-1',
    title: 'Assignment Graded',
    message: 'Your submission for "Quicksort & Mergesort Benchmarking Project" received a grade of 94.5/100.',
    timestamp: '2 hours ago',
    read: false,
    type: 'assignment',
    link_url: '/assignments'
  },
  {
    id: 'notif-2',
    title: 'New Quiz Available',
    message: 'Module 2 Quiz on "Graph Algorithms & Shortest Paths" is now active.',
    timestamp: '1 day ago',
    read: false,
    type: 'quiz',
    link_url: '/quizzes'
  },
  {
    id: 'notif-3',
    title: 'Certificate Issued',
    message: 'Congratulations! Your certificate for "Advanced Data Structures & Algorithms" is ready to view.',
    timestamp: '3 days ago',
    read: true,
    type: 'certificate',
    link_url: '/certificates'
  },
  {
    id: 'notif-4',
    title: 'New Discussion Reply',
    message: 'Dr. Rohit Verma replied to your thread "Is Randomized Quicksort guaranteed O(n log n)?"',
    timestamp: '5 days ago',
    read: true,
    type: 'announcement',
    link_url: '/discussions'
  }
];

// ----------------------------------------------------
// DEMO DISCUSSIONS
// ----------------------------------------------------

export const INITIAL_DEMO_DISCUSSIONS: DemoDiscussionThread[] = [
  {
    id: 'dt-001',
    course_id: 'crs-dsa-001',
    course_title: 'Advanced Data Structures & Algorithms',
    title: 'Is Randomized Quicksort guaranteed to run in O(n log n) time in all cases?',
    created_by_name: 'Alex Morgan',
    created_by_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: '2026-03-03T10:00:00Z',
    replies_count: 2,
    posts: [
      {
        id: 'dp-001',
        user_name: 'Alex Morgan',
        user_role: 'student',
        user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        content: 'I know randomized pivot reduces worst-case probability, but mathematically is it impossible to hit O(n²)?',
        created_at: '2026-03-03T10:00:00Z',
        likes_count: 4,
        is_liked: true
      },
      {
        id: 'dp-002',
        user_name: 'Dr. Rohit Verma',
        user_role: 'instructor',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        content: 'Great question Alex! Mathematically, worst-case O(n²) still has a non-zero probability (1 / n!), but the expected runtime across all randomized choices is strictly O(n log n). For practical engineering purposes, the probability of hitting worst case is negligible.',
        created_at: '2026-03-03T11:30:00Z',
        likes_count: 12,
        is_liked: false
      }
    ]
  },
  {
    id: 'dt-002',
    course_id: 'crs-ai-002',
    course_title: 'Generative AI & LLM Systems Engineering',
    title: 'Comparing pgvector HNSW vs IVFFlat index parameters for RAG retrieval',
    created_by_name: 'Priya Sundaram',
    created_by_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    created_at: '2026-03-12T16:20:00Z',
    replies_count: 1,
    posts: [
      {
        id: 'dp-003',
        user_name: 'Priya Sundaram',
        user_role: 'student',
        user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        content: 'Should we use HNSW m=16, ef_construction=64 or IVFFlat for a dataset of 100,000 embedded lecture chunks?',
        created_at: '2026-03-12T16:20:00Z',
        likes_count: 6,
      },
    ],
  },
];

// Convenience Aliases
export const DEMO_USERS = {
  student: {
    id: INITIAL_DEMO_USERS.student.id,
    name: INITIAL_DEMO_USERS.student.full_name,
    email: INITIAL_DEMO_USERS.student.email,
    role: INITIAL_DEMO_USERS.student.role,
    avatar: INITIAL_DEMO_USERS.student.avatar_url,
  },
  instructor: {
    id: INITIAL_DEMO_USERS.instructor.id,
    name: INITIAL_DEMO_USERS.instructor.full_name,
    email: INITIAL_DEMO_USERS.instructor.email,
    role: INITIAL_DEMO_USERS.instructor.role,
    avatar: INITIAL_DEMO_USERS.instructor.avatar_url,
  },
  admin: {
    id: INITIAL_DEMO_USERS.admin.id,
    name: INITIAL_DEMO_USERS.admin.full_name,
    email: INITIAL_DEMO_USERS.admin.email,
    role: INITIAL_DEMO_USERS.admin.role,
    avatar: INITIAL_DEMO_USERS.admin.avatar_url,
  },
};

export const INITIAL_COURSES = INITIAL_DEMO_COURSES.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  category: c.category,
  difficulty: c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1),
  price: c.price,
  rating: c.rating,
  reviewsCount: 142,
  studentsEnrolled: c.students_enrolled,
  instructor: c.instructor_name,
  instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  thumbnail: c.thumbnail_url,
  duration: c.duration,
  lecturesCount: c.total_lectures,
  learningObjectives: c.objectives,
  modules: c.modules.map((m) => ({
    id: m.id,
    title: m.title,
    description: `Comprehensive module covering key principles and practical implementations.`,
    lectures: m.lectures.map((l) => ({
      id: l.id,
      title: l.title,
      duration: l.duration,
      duration_seconds: l.duration_seconds,
      transcript: l.transcript,
      resources: l.resources.map((r) => ({ title: r.name, url: r.url })),
    })),
  })),
}));

export const INITIAL_ASSIGNMENTS = INITIAL_DEMO_ASSIGNMENTS.map((a) => ({
  id: a.id,
  courseId: a.course_id,
  courseTitle: a.course_title,
  title: a.title,
  instructions: a.instructions,
  dueDate: a.due_date,
  totalPoints: a.points,
  rubric: a.rubric,
  submission: a.submission,
}));

export const INITIAL_QUIZZES = INITIAL_DEMO_QUIZZES.map((q) => ({
  id: q.id,
  courseId: q.course_id,
  courseTitle: q.course_title,
  title: q.title,
  timeLimitMinutes: q.time_limit_minutes,
  questions: q.questions.map((quest, idx) => ({
    id: idx + 1,
    prompt: quest.question_text,
    type: quest.question_type,
    options: quest.options?.map((o) => o.option_text) || [],
    correctAnswer: quest.options?.findIndex((o) => o.is_correct) ?? 0,
    correctAnswers: quest.options?.map((o, i) => (o.is_correct ? i : -1)).filter((i) => i !== -1) || [0],
  })),
}));

export const INITIAL_CERTIFICATES = INITIAL_DEMO_CERTIFICATES.map((c) => ({
  id: c.id,
  courseTitle: c.course_title,
  issueDate: c.issued_at,
  certificateId: c.credential_id,
  instructor: c.instructor_name,
}));

export const INITIAL_ACHIEVEMENTS = INITIAL_DEMO_BADGES.map((b) => ({
  id: b.id,
  title: b.title,
  description: b.description,
  icon: b.icon_name === 'flame' ? '🔥' : b.icon_name === 'award' ? '🏆' : b.icon_name === 'target' ? '🎯' : '⭐',
  category: b.category,
  earned: b.earned,
  unlockedAt: b.earned_date || '2026-03-15',
}));

export const INITIAL_NOTIFICATIONS = INITIAL_DEMO_NOTIFICATIONS.map((n) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  timestamp: n.timestamp,
  type: n.type,
  read: n.read,
  link: n.link_url,
}));

export const INITIAL_DISCUSSIONS = INITIAL_DEMO_DISCUSSIONS.map((d) => ({
  id: d.id,
  courseId: d.course_id,
  courseTitle: d.course_title,
  title: d.title,
  content: d.posts[0]?.content || d.title,
  authorName: d.created_by_name,
  authorAvatar: d.created_by_avatar,
  authorRole: 'Student',
  createdAt: '2 days ago',
  likesCount: d.posts[0]?.likes_count || 4,
  isLiked: d.posts[0]?.is_liked || false,
  replies: d.posts.slice(1).map((p) => ({
    id: p.id,
    authorName: p.user_name,
    authorAvatar: p.user_avatar,
    authorRole: p.user_role.charAt(0).toUpperCase() + p.user_role.slice(1),
    createdAt: '1 day ago',
    content: p.content,
    likesCount: p.likes_count,
  })),
}));

