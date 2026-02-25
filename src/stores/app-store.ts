import { create } from 'zustand';
import type { Project, ProjectStep, Feedback, UserLearningProgress, AiConversation } from '@/types';
import { mockProjects, mockProjectSteps, mockFeedback, mockLearningProgress } from '@/data/mock-data';
import { api } from '@/lib/api';

interface AppState {
  projects: Project[];
  projectSteps: ProjectStep[];
  feedback: Feedback[];
  learningProgress: UserLearningProgress[];
  aiConversations: AiConversation[];
  isLoading: boolean;
  isLoaded: boolean;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateProjectStepStatus: (projectId: string, stepId: string, status: ProjectStep['status']) => void;
  addFeedback: (fb: Feedback) => void;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
  updateFeedbackStatus: (id: string, status: Feedback['status']) => void;
  addLearningProgress: (progress: UserLearningProgress) => void;
  updateLearningProgress: (id: string, updates: Partial<UserLearningProgress>) => void;
  addAiMessage: (msg: AiConversation) => void;
  bootstrap: () => Promise<void>;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  projects: mockProjects,
  projectSteps: mockProjectSteps,
  feedback: mockFeedback,
  learningProgress: mockLearningProgress,
  aiConversations: [],
  isLoading: false,
  isLoaded: false,
  addProject: (project) => {
    set((s) => ({ projects: [...s.projects, project] }));
    void api.createProject(project);
  },
  updateProject: (id, updates) => {
    set((s) => ({
      projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
    void api.updateProject(id, updates);
  },
  updateProjectStepStatus: (projectId, stepId, status) => {
    set((s) => {
      const now = new Date().toISOString();
      const updatedSteps = s.projectSteps.map(step => {
        if (step.id !== stepId || step.project_id !== projectId) return step;
        if (status === 'in_progress') {
          return { ...step, status, start_date: step.start_date ?? now };
        }
        if (status === 'completed') {
          return { ...step, status, end_date: now, start_date: step.start_date ?? now };
        }
        return { ...step, status };
      });

      if (status === 'completed') {
        const nextStep = updatedSteps
          .filter(step => step.project_id === projectId && step.status === 'pending')
          .sort((a, b) => a.step_number - b.step_number)[0];

        if (nextStep) {
          const nextStepIndex = updatedSteps.findIndex(step => step.id === nextStep.id);
          updatedSteps[nextStepIndex] = {
            ...updatedSteps[nextStepIndex],
            status: 'in_progress',
            start_date: updatedSteps[nextStepIndex].start_date ?? now,
          };
        }
      }

      const projectSteps = updatedSteps.filter(step => step.project_id === projectId);
      const totalSteps = projectSteps.length || 1;
      const completedSteps = projectSteps.filter(step => step.status === 'completed').length;
      const progress = Math.round((completedSteps / totalSteps) * 100);
      const nextProjectStatus: Project['status'] = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'planning';

      return {
        projectSteps: updatedSteps,
        projects: s.projects.map(project =>
          project.id === projectId
            ? { ...project, progress_percent: progress, status: nextProjectStatus }
            : project,
        ),
      };
    });
    void api.updateProjectStep(stepId, status);
  },
  addFeedback: (fb) => {
    set((s) => ({ feedback: [...s.feedback, fb] }));
    void api.createFeedback(fb);
  },
  updateFeedback: (id, updates) => {
    set((s) => ({
      feedback: s.feedback.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
    void api.updateFeedback(id, updates);
  },
  updateFeedbackStatus: (id, status) => {
    set((s) => ({
      feedback: s.feedback.map(f => f.id === id ? { ...f, status } : f),
    }));
    void api.updateFeedback(id, { status });
  },
  addLearningProgress: (progress) => {
    set((s) => ({
      learningProgress: [...s.learningProgress, progress],
    }));
    void api.createLearningProgress(progress);
  },
  updateLearningProgress: (id, updates) => {
    set((s) => ({
      learningProgress: s.learningProgress.map(lp => lp.id === id ? { ...lp, ...updates } : lp),
    }));
    void api.updateLearningProgress(id, updates);
  },
  addAiMessage: (msg) => {
    set((s) => ({
      aiConversations: [...s.aiConversations, msg],
    }));
    void api.createAiMessage(msg);
  },
  bootstrap: async () => {
    set({ isLoading: true });
    try {
      const data = await api.bootstrap();
      set({
        projects: data.projects,
        projectSteps: data.projectSteps,
        feedback: data.feedback,
        learningProgress: data.learningProgress,
        aiConversations: data.aiConversations,
        isLoaded: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false, isLoaded: true });
    }
  },
  reset: () => {
    set({
      projects: [],
      projectSteps: [],
      feedback: [],
      learningProgress: [],
      aiConversations: [],
      isLoaded: false,
      isLoading: false,
    });
  },
}));
