import { create } from 'zustand';
import type { Project, ProjectStep, Feedback, UserLearningProgress, AiConversation } from '@/types';
import { mockProjects, mockProjectSteps, mockFeedback, mockLearningProgress } from '@/data/mock-data';

interface AppState {
  projects: Project[];
  projectSteps: ProjectStep[];
  feedback: Feedback[];
  learningProgress: UserLearningProgress[];
  aiConversations: AiConversation[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addFeedback: (fb: Feedback) => void;
  updateFeedbackStatus: (id: string, status: Feedback['status']) => void;
  addLearningProgress: (progress: UserLearningProgress) => void;
  updateLearningProgress: (id: string, updates: Partial<UserLearningProgress>) => void;
  addAiMessage: (msg: AiConversation) => void;
}

export const useAppStore = create<AppState>((set) => ({
  projects: mockProjects,
  projectSteps: mockProjectSteps,
  feedback: mockFeedback,
  learningProgress: mockLearningProgress,
  aiConversations: [],
  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),
  updateProject: (id, updates) => set((s) => ({
    projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p),
  })),
  addFeedback: (fb) => set((s) => ({ feedback: [...s.feedback, fb] })),
  updateFeedbackStatus: (id, status) => set((s) => ({
    feedback: s.feedback.map(f => f.id === id ? { ...f, status } : f),
  })),
  addLearningProgress: (progress) => set((s) => ({
    learningProgress: [...s.learningProgress, progress],
  })),
  updateLearningProgress: (id, updates) => set((s) => ({
    learningProgress: s.learningProgress.map(lp => lp.id === id ? { ...lp, ...updates } : lp),
  })),
  addAiMessage: (msg) => set((s) => ({
    aiConversations: [...s.aiConversations, msg],
  })),
}));
