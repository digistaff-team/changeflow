export type UserRole = 'admin' | 'manager' | 'employee';

export interface Tenant {
  id: string;
  name: string;
  inn: string;
  industry: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: string;
  avatar_url?: string;
}

export type TransformationType = 'lean' | 'digital' | 'culture' | 'pss' | 'structure';

export interface ChangeAlgorithmTemplate {
  id: string;
  name: string;
  description: string;
  transformation_type: TransformationType;
  duration_weeks: number;
  icon: string;
  color: string;
}

export interface TemplateStep {
  id: string;
  template_id: string;
  step_number: number;
  name: string;
  description: string;
  duration_days: number;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface Project {
  id: string;
  tenant_id: string;
  template_id: string;
  name: string;
  start_date: string;
  owner_id: string;
  status: ProjectStatus;
  progress_percent: number;
  description?: string;
}

export interface ProjectStep {
  id: string;
  project_id: string;
  step_number: number;
  name: string;
  status: StepStatus;
  start_date?: string;
  end_date?: string;
}

export type FeedbackType = 'suggestion' | 'concern' | 'question' | 'praise';
export type FeedbackStatus = 'new' | 'reviewed' | 'in_progress' | 'resolved';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Feedback {
  id: string;
  tenant_id: string;
  project_id: string;
  user_id: string;
  feedback_type: FeedbackType;
  message: string;
  status: FeedbackStatus;
  sentiment: Sentiment;
  ai_tags: string[];
  created_at: string;
}

export type ContentType = 'article' | 'video' | 'course' | 'guide' | 'checklist';

export interface LearningMaterial {
  id: string;
  title: string;
  content_type: ContentType;
  target_roles: UserRole[];
  content: string;
  file_url?: string;
  duration_min?: number;
  category: string;
}

export interface UserLearningProgress {
  id: string;
  user_id: string;
  material_id: string;
  completed_at?: string;
  progress_percent: number;
}

export interface AiConversation {
  id: string;
  user_id: string;
  chat_id: string;
  message_role: 'user' | 'assistant';
  message_content: string;
  created_at: string;
}
