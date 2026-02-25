import type {
  Tenant, User, ChangeAlgorithmTemplate, TemplateStep,
  Project, ProjectStep, Feedback, LearningMaterial, UserLearningProgress, LessonProgress
} from '@/types';
import { tm } from '@/lib/i18n';

export const mockTenant: Tenant = tm<Tenant>('mockData.tenant');
export const mockUsers: User[] = tm<User[]>('mockData.users');
export const mockTemplates: ChangeAlgorithmTemplate[] = tm<ChangeAlgorithmTemplate[]>('mockData.templates');
export const mockTemplateSteps: TemplateStep[] = tm<TemplateStep[]>('mockData.templateSteps');
export const mockProjects: Project[] = tm<Project[]>('mockData.projects');
export const mockProjectSteps: ProjectStep[] = tm<ProjectStep[]>('mockData.projectSteps');
export const mockFeedback: Feedback[] = tm<Feedback[]>('mockData.feedback');
export const mockLearningMaterials: LearningMaterial[] = tm<LearningMaterial[]>('mockData.learningMaterials');
export const mockLearningProgress: UserLearningProgress[] = tm<UserLearningProgress[]>('mockData.learningProgress');
export const mockLessonProgress: LessonProgress[] = tm<LessonProgress[]>('mockData.lessonProgress');
