import { INITIAL_COURSES } from '../utils/demoData';

export const courseService = {
  async getCourses(params?: { category?: string; difficulty?: string; q?: string; status?: string }) {
    let courses = [...INITIAL_COURSES];

    if (params?.category && params.category !== 'all') {
      courses = courses.filter((c) => c.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.difficulty && params.difficulty !== 'all') {
      courses = courses.filter((c) => c.difficulty.toLowerCase() === params.difficulty!.toLowerCase());
    }
    if (params?.q) {
      const qLower = params.q.toLowerCase();
      courses = courses.filter(
        (c) => c.title.toLowerCase().includes(qLower) || c.description.toLowerCase().includes(qLower)
      );
    }
    if (params?.status) {
      courses = courses.filter((c: any) => c.status === params.status);
    }

    return { courses };
  },

  async getCourseById(id: string) {
    const course = INITIAL_COURSES.find((c) => c.id === id) || INITIAL_COURSES[0];
    return { course };
  },

  async createCourse(data: {
    title: string;
    description: string;
    category: string;
    difficulty?: string;
    price?: number;
    thumbnail_url?: string;
  }) {
    const newCourse = {
      id: `c-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: (data.difficulty as any) || 'intermediate',
      price: data.price || 0,
      thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1516116211223-425856879be4?w=800',
      instructor_name: 'Rohit Verma',
      status: 'pending',
      modules: [],
    };
    return { course: newCourse };
  },

  async addModule(courseId: string, title: string) {
    const newModule = {
      id: `mod-${Date.now()}`,
      course_id: courseId,
      title,
      order_index: 1,
      lectures: [],
    };
    return { module: newModule };
  },

  async addLecture(moduleId: string, data: { title: string; video_url?: string; transcript?: string; resource_urls?: string[] }) {
    const newLecture = {
      id: `lec-${Date.now()}`,
      module_id: moduleId,
      title: data.title,
      video_url: data.video_url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      transcript: data.transcript || 'Transcript text.',
      duration_seconds: 300,
      order_index: 1,
      resource_urls: data.resource_urls || [],
    };
    return { lecture: newLecture };
  },

  async approveCourse(courseId: string, decision: 'approved' | 'rejected', comment?: string) {
    return { message: `Course ${courseId} has been ${decision}` };
  },
};
