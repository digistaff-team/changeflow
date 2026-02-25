import type {
  Feedback,
  LessonProgress,
  Project,
  ProjectStep,
  User,
  UserLearningProgress,
  UserRole,
} from '@/types';
import { getAuthToken } from '@/lib/auth-token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = options.token ?? getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export type AuthLoginResponse = {
  token: string;
  user: User;
};

export type BootstrapResponse = {
  projects: Project[];
  projectSteps: ProjectStep[];
  feedback: Feedback[];
  learningProgress: UserLearningProgress[];
  lessonProgress: LessonProgress[];
  aiConversations: {
    id: string;
    user_id: string;
    chat_id: string;
    message_role: 'user' | 'assistant';
    message_content: string;
    created_at: string;
  }[];
};

export const api = {
  login(email: string) {
    return request<AuthLoginResponse>('/auth/login', {
      method: 'POST',
      body: { email },
      token: null,
    });
  },
  me(token?: string) {
    return request<{ user: User }>('/auth/me', { token });
  },
  switchRole(role: UserRole) {
    return request<{ user: User; token?: string }>('/auth/switch-role', {
      method: 'POST',
      body: { role },
    });
  },
  bootstrap() {
    return request<BootstrapResponse>('/bootstrap');
  },
  createProject(project: Project) {
    return request<{ project: Project }>('/projects', {
      method: 'POST',
      body: { project },
    });
  },
  updateProject(id: string, updates: Partial<Project>) {
    return request<{ project: Project }>(`/projects/${id}`, {
      method: 'PATCH',
      body: { updates },
    });
  },
  updateProjectStep(stepId: string, status: ProjectStep['status']) {
    return request<{ step: ProjectStep }>(`/project-steps/${stepId}`, {
      method: 'PATCH',
      body: { status },
    });
  },
  createFeedback(feedback: Feedback) {
    return request<{ feedback: Feedback }>('/feedback', {
      method: 'POST',
      body: { feedback },
    });
  },
  updateFeedback(id: string, updates: Partial<Feedback>) {
    return request<{ feedback: Feedback }>(`/feedback/${id}`, {
      method: 'PATCH',
      body: { updates },
    });
  },
  createLearningProgress(progress: UserLearningProgress) {
    return request<{ learningProgress: UserLearningProgress }>('/learning-progress', {
      method: 'POST',
      body: { progress },
    });
  },
  updateLearningProgress(id: string, updates: Partial<UserLearningProgress>) {
    return request<{ learningProgress: UserLearningProgress }>(`/learning-progress/${id}`, {
      method: 'PATCH',
      body: { updates },
    });
  },
  createLessonProgress(progress: LessonProgress) {
    return request<{ lessonProgress: LessonProgress }>('/lesson-progress', {
      method: 'POST',
      body: { progress },
    });
  },
  updateLessonProgress(id: string, updates: Partial<LessonProgress>) {
    return request<{ lessonProgress: LessonProgress }>(`/lesson-progress/${id}`, {
      method: 'PATCH',
      body: { updates },
    });
  },
  createAiMessage(message: {
    id: string;
    user_id: string;
    chat_id: string;
    message_role: 'user' | 'assistant';
    message_content: string;
    created_at: string;
  }) {
    return request('/ai-conversations', {
      method: 'POST',
      body: { message },
    });
  },
};
