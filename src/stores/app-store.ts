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
  updateProjectStepStatus: (projectId: string, stepId: string, status: ProjectStep['status']) => void;
  addFeedback: (fb: Feedback) => void;
  updateFeedback: (id: string, updates: Partial<Feedback>) => void;
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
  updateProjectStepStatus: (projectId, stepId, status) => set((s) => {
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
  }),
  addFeedback: (fb) => set((s) => ({ feedback: [...s.feedback, fb] })),
  updateFeedback: (id, updates) => set((s) => ({
    feedback: s.feedback.map(f => f.id === id ? { ...f, ...updates } : f),
  })),
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
