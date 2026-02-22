import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockLearningMaterials } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BookOpen, Video, FileText, CheckSquare, GraduationCap, Clock, CheckCircle2, Lock } from 'lucide-react';

type CourseLesson = {
  id: string;
  title: string;
  goal: string;
  content: string;
  durationMin: number;
  checklist: string[];
  longread?: string[];
  media?: CourseMedia[];
};

type CourseMedia = {
  id: string;
  type: 'video' | 'audio' | 'infographic';
  title: string;
  description: string;
  url: string;
};

type CourseQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

type StructuredCourse = {
  materialId: string;
  title: string;
  methodology: string;
  lessons: CourseLesson[];
  quiz: {
    title: string;
    passScore: number;
    questions: CourseQuizQuestion[];
  };
};

const typeIcons: Record<string, React.ElementType> = {
  article: FileText,
  video: Video,
  course: GraduationCap,
  guide: BookOpen,
  checklist: CheckSquare,
  instruction: BookOpen,
  document: FileText,
};

const mediaTypeLabels: Record<CourseMedia['type'], string> = {
  video: '\u0412\u0438\u0434\u0435\u043e',
  audio: '\u0410\u0443\u0434\u0438\u043e-\u043f\u043e\u0434\u043a\u0430\u0441\u0442',
  infographic: '\u0418\u043d\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u043a\u0430',
};

const structuredCourses: Record<string, StructuredCourse> = {
  lm1: {
    materialId: 'lm1',
    title: '\u041e\u0441\u043d\u043e\u0432\u044b \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f\u043c\u0438',
    methodology: '\u0421\u0442\u0440\u0443\u043a\u0442\u0443\u0440\u0430 \u043f\u043e \u0448\u0430\u0431\u043b\u043e\u043d\u0443 \u00ab8 \u0448\u0430\u0433\u043e\u0432 \u041a\u043e\u0442\u0442\u0435\u0440\u0430\u00bb: 5 \u0437\u0430\u043d\u044f\u0442\u0438\u0439-\u043b\u043e\u043d\u0433\u0440\u0438\u0434\u043e\u0432 + \u0444\u0438\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u043a\u0432\u0435\u0441\u0442.',
    lessons: [
      {
        id: 'base-1',
        title: '\u0417\u0430\u043d\u044f\u0442\u0438\u0435 1. \u041f\u0440\u0438\u0440\u043e\u0434\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439 \u0438 \u0440\u043e\u043b\u044c \u043b\u0438\u0434\u0435\u0440\u0430',
        goal: '\u041f\u043e\u043d\u044f\u0442\u044c, \u043f\u043e\u0447\u0435\u043c\u0443 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u043f\u0440\u043e\u0432\u0430\u043b\u0438\u0432\u0430\u044e\u0442\u0441\u044f \u0438 \u043a\u0430\u043a \u0443\u043f\u0440\u0430\u0432\u043b\u044f\u0442\u044c \u0438\u043c\u0438 \u0441\u0438\u0441\u0442\u0435\u043c\u043d\u043e.',
        content: '\u0412 \u0444\u043e\u043a\u0443\u0441\u0435 \u0437\u0430\u043d\u044f\u0442\u0438\u044f: \u043c\u043e\u0434\u0435\u043b\u044c \u043b\u044e\u0434\u0438-\u043f\u0440\u043e\u0446\u0435\u0441\u0441-\u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0438, \u0442\u0438\u043f\u0438\u0447\u043d\u044b\u0435 \u043e\u0448\u0438\u0431\u043a\u0438 \u0438 \u0431\u0430\u0437\u043e\u0432\u044b\u0435 \u043f\u0440\u0438\u043d\u0446\u0438\u043f\u044b \u0440\u0430\u0431\u043e\u0442\u044b \u043b\u0438\u0434\u0435\u0440\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439.',
        durationMin: 40,
        checklist: [
          '\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u044b \u0433\u043b\u0430\u0432\u043d\u044b\u0435 \u043f\u0440\u0438\u0447\u0438\u043d\u044b \u043f\u0440\u043e\u0432\u0430\u043b\u043e\u0432 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439',
          '\u0421\u0444\u043e\u0440\u043c\u0443\u043b\u0438\u0440\u043e\u0432\u0430\u043d\u0430 \u0440\u043e\u043b\u044c \u0441\u043f\u043e\u043d\u0441\u043e\u0440\u0430 \u0438 \u043b\u0438\u0434\u0435\u0440\u0430 \u043f\u0440\u043e\u0435\u043a\u0442\u0430',
          '\u041e\u043f\u0438\u0441\u0430\u043d\u044b \u0446\u0435\u043b\u0435\u0432\u044b\u0435 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0447\u0435\u0441\u043a\u0438\u0435 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438',
        ],
        longread: [
          '\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f\u043c\u0438 \u043d\u0435 \u0441\u0432\u043e\u0434\u0438\u0442\u0441\u044f \u043a \u043f\u0440\u0438\u043a\u0430\u0437\u0443 \u00ab\u0434\u0435\u043b\u0430\u0435\u043c \u043f\u043e-\u043d\u043e\u0432\u043e\u043c\u0443\u00bb. \u042d\u0442\u043e \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u043e\u043c: \u043e\u0442 \u0442\u0435\u043a\u0443\u0449\u0435\u0439 \u043c\u043e\u0434\u0435\u043b\u0438 \u0440\u0430\u0431\u043e\u0442\u044b \u043a \u0446\u0435\u043b\u0435\u0432\u043e\u0439, \u0441 \u0447\u0435\u0442\u043a\u0438\u043c\u0438 \u044d\u0442\u0430\u043f\u0430\u043c\u0438 \u0438 \u043e\u0431\u0440\u0430\u0442\u043d\u043e\u0439 \u0441\u0432\u044f\u0437\u044c\u044e.',
          '\u041a\u043b\u044e\u0447\u0435\u0432\u0430\u044f \u0437\u0430\u0434\u0430\u0447\u0430 \u043b\u0438\u0434\u0435\u0440\u0430 \u2014 \u043d\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u043e\u0431\u044a\u044f\u0432\u0438\u0442\u044c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435, \u043d\u043e \u0438 \u043e\u0431\u0435\u0441\u043f\u0435\u0447\u0438\u0442\u044c \u043f\u043e\u043d\u044f\u0442\u043d\u043e\u0441\u0442\u044c, \u0440\u0435\u0441\u0443\u0440\u0441\u044b \u0438 \u043f\u043e\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439.',
        ],
        media: [
          { id: 'm1v', type: 'video', title: '\u0412\u0438\u0434\u0435\u043e: \u041f\u043e\u0447\u0435\u043c\u0443 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u043f\u0440\u043e\u0432\u0430\u043b\u0438\u0432\u0430\u044e\u0442\u0441\u044f', description: '\u041a\u0440\u0430\u0442\u043a\u0438\u0439 \u0440\u0430\u0437\u0431\u043e\u0440 5 \u0442\u0438\u043f\u043e\u0432\u044b\u0445 \u043e\u0448\u0438\u0431\u043e\u043a.', url: 'https://example.com/change-basics/video-1' },
          { id: 'm1a', type: 'audio', title: '\u041f\u043e\u0434\u043a\u0430\u0441\u0442: \u0420\u043e\u043b\u044c \u043b\u0438\u0434\u0435\u0440\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439', description: '\u041f\u0440\u0430\u043a\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u043a\u0435\u0439\u0441\u044b \u0432\u043d\u0435\u0434\u0440\u0435\u043d\u0438\u044f.', url: 'https://example.com/change-basics/audio-1' },
          { id: 'm1i', type: 'infographic', title: '\u0418\u043d\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u043a\u0430: \u0426\u0438\u043a\u043b \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439', description: '\u041e\u0442 \u0438\u043d\u0438\u0446\u0438\u0430\u0446\u0438\u0438 \u0434\u043e \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u044f.', url: 'https://example.com/change-basics/infographic-1' },
        ],
      },
      {
        id: 'base-2',
        title: '\u0417\u0430\u043d\u044f\u0442\u0438\u0435 2. \u0414\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0430 \u0442\u0435\u043a\u0443\u0449\u0435\u0433\u043e \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u044f',
        goal: '\u041e\u0446\u0435\u043d\u0438\u0442\u044c \u0433\u043e\u0442\u043e\u0432\u043d\u043e\u0441\u0442\u044c \u043a \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f\u043c \u0438 \u0432\u044b\u044f\u0432\u0438\u0442\u044c \u0431\u0430\u0440\u044c\u0435\u0440\u044b.',
        content: '\u0417\u0430\u043d\u044f\u0442\u0438\u0435 \u043f\u043e\u0441\u0432\u044f\u0449\u0435\u043d\u043e \u043a\u0430\u0440\u0442\u0435 \u0441\u0442\u0435\u0439\u043a\u0445\u043e\u043b\u0434\u0435\u0440\u043e\u0432, \u0430\u043d\u0430\u043b\u0438\u0437\u0443 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u043e\u0432 \u0438 \u0438\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u044e \u0438\u0441\u0445\u043e\u0434\u043d\u044b\u0445 KPI.',
        durationMin: 45,
        checklist: [
          '\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0430 \u043a\u0430\u0440\u0442\u0430 \u0441\u0442\u0435\u0439\u043a\u0445\u043e\u043b\u0434\u0435\u0440\u043e\u0432',
          '\u0412\u044b\u044f\u0432\u043b\u0435\u043d\u044b \u0440\u0438\u0441\u043a\u0438 \u0438 \u0431\u0430\u0440\u044c\u0435\u0440\u044b',
          '\u0417\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u044b \u0431\u0430\u0437\u043e\u0432\u044b\u0435 KPI',
        ],
        longread: [
          '\u0414\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0430 \u2014 \u0431\u0430\u0437\u0430 \u0434\u043b\u044f \u0440\u0435\u0430\u043b\u0438\u0441\u0442\u0438\u0447\u043d\u043e\u0439 \u0434\u043e\u0440\u043e\u0436\u043d\u043e\u0439 \u043a\u0430\u0440\u0442\u044b. \u0411\u0435\u0437 \u043d\u0435\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u0430 \u0447\u0430\u0441\u0442\u043e \u043f\u0440\u043e\u043f\u0443\u0441\u043a\u0430\u0435\u0442 \u0441\u0438\u0441\u0442\u0435\u043c\u043d\u044b\u0435 \u043f\u0440\u0438\u0447\u0438\u043d\u044b \u0441\u043e\u043f\u0440\u043e\u0442\u0438\u0432\u043b\u0435\u043d\u0438\u044f.',
          '\u0412\u0430\u0436\u043d\u043e \u043e\u0431\u044a\u0435\u0434\u0438\u043d\u044f\u0442\u044c \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0435 (\u0438\u043d\u0442\u0435\u0440\u0432\u044c\u044e, \u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435) \u0438 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0435 (\u043c\u0435\u0442\u0440\u0438\u043a\u0438, \u0441\u0440\u043e\u043a\u0438, \u0434\u0435\u0444\u0435\u043a\u0442\u044b) \u0434\u0430\u043d\u043d\u044b\u0435.',
        ],
        media: [
          { id: 'm2v', type: 'video', title: '\u0412\u0438\u0434\u0435\u043e: \u041a\u0430\u043a \u043f\u0440\u043e\u0432\u043e\u0434\u0438\u0442\u044c \u0434\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0443', description: '\u0427\u0435\u043a-\u043b\u0438\u0441\u0442 \u043f\u0435\u0440\u0435\u0434 \u0437\u0430\u043f\u0443\u0441\u043a\u043e\u043c \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439.', url: 'https://example.com/change-basics/video-2' },
          { id: 'm2a', type: 'audio', title: '\u041f\u043e\u0434\u043a\u0430\u0441\u0442: \u0413\u0434\u0435 \u0438\u0441\u043a\u0430\u0442\u044c \u0441\u043e\u043f\u0440\u043e\u0442\u0438\u0432\u043b\u0435\u043d\u0438\u0435', description: '\u0421\u0438\u0433\u043d\u0430\u043b\u044b \u0440\u0438\u0441\u043a\u0430 \u0434\u043e \u0441\u0442\u0430\u0440\u0442\u0430 \u0432\u043d\u0435\u0434\u0440\u0435\u043d\u0438\u044f.', url: 'https://example.com/change-basics/audio-2' },
          { id: 'm2i', type: 'infographic', title: '\u0418\u043d\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u043a\u0430: \u041c\u0430\u0442\u0440\u0438\u0446\u0430 \u0440\u0438\u0441\u043a\u043e\u0432', description: '\u0412\u043b\u0438\u044f\u043d\u0438\u0435 \u0438 \u0432\u0435\u0440\u043e\u044f\u0442\u043d\u043e\u0441\u0442\u044c \u0434\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0433\u043e \u0440\u0438\u0441\u043a\u0430.', url: 'https://example.com/change-basics/infographic-2' },
        ],
      },
      {
        id: 'base-3',
        title: '\u0417\u0430\u043d\u044f\u0442\u0438\u0435 3. \u041a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u044f \u0438 \u0432\u043e\u0432\u043b\u0435\u0447\u0435\u043d\u0438\u0435',
        goal: '\u041f\u043e\u0441\u0442\u0440\u043e\u0438\u0442\u044c \u043f\u043b\u0430\u043d \u043a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u043e\u0431\u0440\u0430\u0442\u043d\u0443\u044e \u0441\u0432\u044f\u0437\u044c.',
        content: '\u0412 \u043b\u043e\u043d\u0433\u0440\u0438\u0434\u0435 \u0440\u0430\u0437\u0431\u0438\u0440\u0430\u044e\u0442\u0441\u044f \u043a\u0430\u043d\u0430\u043b\u044b \u043a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u0438, \u0444\u043e\u0440\u043c\u0430\u0442\u044b \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439 \u0438 \u0440\u0430\u0431\u043e\u0442\u0430 \u0441 \u0432\u043e\u043f\u0440\u043e\u0441\u0430\u043c\u0438 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u043e\u0432.',
        durationMin: 45,
        checklist: [
          '\u0421\u043e\u0431\u0440\u0430\u043d \u0435\u0434\u0438\u043d\u044b\u0439 \u043f\u043b\u0430\u043d \u043a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u0439',
          '\u041e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u044b \u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0435 \u0437\u0430 \u043a\u0430\u043d\u0430\u043b\u044b',
          '\u041d\u0430\u0441\u0442\u0440\u043e\u0435\u043d \u0446\u0438\u043a\u043b \u043e\u0431\u0440\u0430\u0442\u043d\u043e\u0439 \u0441\u0432\u044f\u0437\u0438',
        ],
        longread: [
          '\u0425\u043e\u0440\u043e\u0448\u0430\u044f \u043a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u044f \u043f\u043e \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f\u043c \u2014 \u044d\u0442\u043e \u0440\u0438\u0442\u043c \u0438 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c: \u0447\u0442\u043e \u0434\u0435\u043b\u0430\u0435\u043c, \u0437\u0430\u0447\u0435\u043c \u0438 \u043a\u0430\u043a \u0438\u0437\u043c\u0435\u0440\u044f\u0435\u043c \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442.',
          '\u041a\u0440\u0438\u0442\u0438\u0447\u043d\u043e \u0434\u0430\u0432\u0430\u0442\u044c \u043d\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e, \u043d\u043e \u0438 \u0441\u043f\u043e\u0441\u043e\u0431 \u0432\u043b\u0438\u044f\u0442\u044c \u043d\u0430 \u0445\u043e\u0434 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439 \u0447\u0435\u0440\u0435\u0437 \u0432\u043e\u043f\u0440\u043e\u0441\u044b \u0438 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f.',
        ],
        media: [
          { id: 'm3v', type: 'video', title: '\u0412\u0438\u0434\u0435\u043e: \u0428\u0430\u0431\u043b\u043e\u043d \u043e\u0431\u044a\u044f\u0432\u043b\u0435\u043d\u0438\u044f \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439', description: '\u041a\u0430\u043a \u0433\u043e\u0432\u043e\u0440\u0438\u0442\u044c \u043e \u043d\u043e\u0432\u043e\u0432\u0432\u0435\u0434\u0435\u043d\u0438\u044f\u0445 \u043f\u043e\u043d\u044f\u0442\u043d\u043e.', url: 'https://example.com/change-basics/video-3' },
          { id: 'm3a', type: 'audio', title: '\u041f\u043e\u0434\u043a\u0430\u0441\u0442: \u0421\u043b\u043e\u0436\u043d\u044b\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b \u043a\u043e\u043c\u0430\u043d\u0434\u044b', description: '\u041f\u0440\u0438\u043c\u0435\u0440\u044b \u043e\u0442\u0432\u0435\u0442\u043e\u0432 \u0431\u0435\u0437 \u043f\u043e\u0442\u0435\u0440\u0438 \u0434\u043e\u0432\u0435\u0440\u0438\u044f.', url: 'https://example.com/change-basics/audio-3' },
          { id: 'm3i', type: 'infographic', title: '\u0418\u043d\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u043a\u0430: \u041a\u0430\u0440\u0442\u0430 \u043a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u0439', description: '\u041a\u043e\u043c\u0443, \u0447\u0442\u043e, \u043a\u043e\u0433\u0434\u0430 \u0438 \u0432 \u043a\u0430\u043a\u043e\u043c \u043a\u0430\u043d\u0430\u043b\u0435.', url: 'https://example.com/change-basics/infographic-3' },
        ],
      },
      {
        id: 'base-4',
        title: '\u0417\u0430\u043d\u044f\u0442\u0438\u0435 4. \u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u043f\u043e\u0431\u0435\u0434\u044b \u0438 \u0443\u0441\u0442\u043e\u0439\u0447\u0438\u0432\u043e\u0441\u0442\u044c',
        goal: '\u0417\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u043f\u0438\u043b\u043e\u0442\u044b \u0438 \u0437\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0431\u044b\u0441\u0442\u0440\u044b\u0439 \u044d\u0444\u0444\u0435\u043a\u0442.',
        content: '\u0417\u0434\u0435\u0441\u044c \u043e\u0431\u0441\u0443\u0436\u0434\u0430\u044e\u0442\u0441\u044f \u043a\u0440\u0438\u0442\u0435\u0440\u0438\u0438 \u0431\u044b\u0441\u0442\u0440\u043e\u0439 \u043f\u043e\u0431\u0435\u0434\u044b, \u043f\u0438\u043b\u043e\u0442\u043d\u044b\u0435 \u0438\u043d\u0438\u0446\u0438\u0430\u0442\u0438\u0432\u044b \u0438 \u043c\u0435\u0442\u0440\u0438\u043a\u0438 \u0443\u0441\u043f\u0435\u0445\u0430 \u043d\u0430 \u043f\u0435\u0440\u0432\u044b\u0435 30 \u0434\u043d\u0435\u0439.',
        durationMin: 40,
        checklist: [
          '\u0412\u044b\u0431\u0440\u0430\u043d\u044b \u0431\u044b\u0441\u0442\u0440\u044b\u0435 \u043f\u0438\u043b\u043e\u0442\u044b',
          '\u041d\u0430\u0437\u043d\u0430\u0447\u0435\u043d\u044b \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u044b \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430',
          '\u0417\u0430\u0444\u0438\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d \u043f\u043b\u0430\u043d \u043c\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f',
        ],
        longread: [
          '\u0411\u044b\u0441\u0442\u0440\u0430\u044f \u043f\u043e\u0431\u0435\u0434\u0430 \u2014 \u044d\u0442\u043e \u043d\u0435 \u043f\u043e\u043a\u0430\u0437\u0443\u0445\u0430, \u0430 \u0434\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e \u0440\u0430\u0431\u043e\u0442\u043e\u0441\u043f\u043e\u0441\u043e\u0431\u043d\u043e\u0441\u0442\u0438 \u043d\u043e\u0432\u043e\u0433\u043e \u043f\u043e\u0434\u0445\u043e\u0434\u0430 \u043d\u0430 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0435.',
          '\u0414\u043b\u044f \u0443\u0441\u0442\u043e\u0439\u0447\u0438\u0432\u043e\u0441\u0442\u0438 \u043d\u0443\u0436\u043d\u044b \u0440\u0435\u0433\u043b\u0430\u043c\u0435\u043d\u0442, \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u0438 \u0440\u0438\u0442\u043c \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044f \u2014 \u0438\u043d\u0430\u0447\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u0430 \u043e\u0442\u043a\u0430\u0442\u0438\u0442\u0441\u044f \u043a \u043f\u0440\u0435\u0436\u043d\u0438\u043c \u043f\u0440\u0438\u0432\u044b\u0447\u043a\u0430\u043c.',
        ],
        media: [
          { id: 'm4v', type: 'video', title: '\u0412\u0438\u0434\u0435\u043e: \u0417\u0430\u043f\u0443\u0441\u043a \u043f\u0438\u043b\u043e\u0442\u0430 \u0437\u0430 2 \u043d\u0435\u0434\u0435\u043b\u0438', description: '\u0428\u0430\u0433\u0438 \u0438 \u0442\u043e\u0447\u043a\u0438 \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044f.', url: 'https://example.com/change-basics/video-4' },
          { id: 'm4a', type: 'audio', title: '\u041f\u043e\u0434\u043a\u0430\u0441\u0442: \u041a\u0430\u043a \u0437\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u043d\u043e\u0432\u0443\u044e \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0443', description: '\u0420\u0430\u0437\u0431\u043e\u0440 \u043e\u0448\u0438\u0431\u043e\u043a \u043c\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f.', url: 'https://example.com/change-basics/audio-4' },
          { id: 'm4i', type: 'infographic', title: '\u0418\u043d\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u043a\u0430: \u0412\u043e\u0440\u043e\u043d\u043a\u0430 \u0431\u044b\u0441\u0442\u0440\u044b\u0445 \u043f\u043e\u0431\u0435\u0434', description: '\u041e\u0442 \u043f\u0438\u043b\u043e\u0442\u0430 \u043a \u043c\u0430\u0441\u0448\u0442\u0430\u0431\u0443.', url: 'https://example.com/change-basics/infographic-4' },
        ],
      },
      {
        id: 'base-5',
        title: '\u0417\u0430\u043d\u044f\u0442\u0438\u0435 5. \u0418\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044f \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439 \u0432 \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u0443',
        goal: '\u0412\u0441\u0442\u0440\u043e\u0438\u0442\u044c \u043d\u043e\u0432\u044b\u0435 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0438 \u0432 \u0435\u0436\u0435\u0434\u043d\u0435\u0432\u043d\u043e\u0435 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435.',
        content: '\u0424\u0438\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u043b\u043e\u043d\u0433\u0440\u0438\u0434 \u043e \u0437\u0430\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439: \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u044b, \u0440\u043e\u043b\u0438, \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435 \u043d\u043e\u0432\u044b\u0445 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u043e\u0432, \u043f\u0435\u0442\u043b\u044f \u0443\u043b\u0443\u0447\u0448\u0435\u043d\u0438\u0439.',
        durationMin: 50,
        checklist: [
          '\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u044b \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u044b \u0438 \u0440\u0435\u0433\u043b\u0430\u043c\u0435\u043d\u0442\u044b',
          '\u041e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439',
          '\u0417\u0430\u043f\u0443\u0449\u0435\u043d \u0446\u0438\u043a\u043b \u043f\u0435\u0440\u0435\u0441\u043c\u043e\u0442\u0440\u0430 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432',
        ],
        longread: [
          '\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u0441\u044f \u00ab\u043d\u043e\u0440\u043c\u043e\u0439\u00bb, \u043a\u043e\u0433\u0434\u0430 \u043e\u043d\u043e \u0432\u0441\u0442\u0440\u043e\u0435\u043d\u043e \u0432 \u0440\u0435\u0433\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u044b \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f: \u043f\u043b\u0430\u043d\u0435\u0440\u043a\u0438, KPI, \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u0435, \u0430\u0443\u0434\u0438\u0442\u044b.',
          '\u041d\u0430 \u044d\u0442\u043e\u043c \u044d\u0442\u0430\u043f\u0435 \u0432\u0430\u0436\u043d\u043e \u043f\u0435\u0440\u0435\u0439\u0442\u0438 \u043e\u0442 \u00ab\u043f\u0440\u043e\u0435\u043a\u0442\u0430 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439\u00bb \u043a \u00ab\u0441\u0438\u0441\u0442\u0435\u043c\u0435 \u0443\u043b\u0443\u0447\u0448\u0435\u043d\u0438\u0439\u00bb, \u0433\u0434\u0435 \u043a\u0430\u0436\u0434\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u0430 \u0437\u043d\u0430\u0435\u0442, \u043a\u0430\u043a \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442.',
        ],
        media: [
          { id: 'm5v', type: 'video', title: '\u0412\u0438\u0434\u0435\u043e: \u0417\u0430\u043a\u0440\u0435\u043f\u043b\u0435\u043d\u0438\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439', description: '\u041a\u0430\u043a \u043d\u0435 \u0434\u043e\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u043e\u0442\u043a\u0430\u0442 \u043a \u0441\u0442\u0430\u0440\u043e\u043c\u0443 \u043f\u043e\u0434\u0445\u043e\u0434\u0443.', url: 'https://example.com/change-basics/video-5' },
          { id: 'm5a', type: 'audio', title: '\u041f\u043e\u0434\u043a\u0430\u0441\u0442: \u041a\u0443\u043b\u044c\u0442\u0443\u0440\u0430 \u0438 \u043f\u0440\u0438\u0432\u044b\u0447\u043a\u0438', description: '\u041a\u0430\u043a \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043b\u044e\u0434\u0435\u0439 \u0441\u0432\u044f\u0437\u0430\u043d\u043e \u0441 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430\u043c\u0438.', url: 'https://example.com/change-basics/audio-5' },
          { id: 'm5i', type: 'infographic', title: '\u0418\u043d\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u043a\u0430: \u0426\u0438\u043a\u043b \u0443\u0441\u0442\u043e\u0439\u0447\u0438\u0432\u043e\u0441\u0442\u0438', description: '\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442 \u2014 \u0438\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u0435 \u2014 \u043e\u0431\u0440\u0430\u0442\u043d\u0430\u044f \u0441\u0432\u044f\u0437\u044c \u2014 \u0443\u043b\u0443\u0447\u0448\u0435\u043d\u0438\u0435.', url: 'https://example.com/change-basics/infographic-5' },
        ],
      },
    ],
    quiz: {
      title: '\u0424\u0438\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u043a\u0432\u0435\u0441\u0442 \u043f\u043e \u043e\u0441\u043d\u043e\u0432\u0430\u043c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f\u043c\u0438',
      passScore: 80,
      questions: [
        {
          id: 'bq1',
          question: '\u0412 \u043a\u043e\u043c\u0430\u043d\u0434\u0435 \u043d\u0435\u0442 \u043f\u043e\u043d\u0438\u043c\u0430\u043d\u0438\u044f, \u0437\u0430\u0447\u0435\u043c \u043d\u0443\u0436\u043d\u044b \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f. \u041f\u0435\u0440\u0432\u044b\u0439 \u0448\u0430\u0433?',
          options: ['\u0417\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u044c \u043f\u0438\u043b\u043e\u0442 \u0431\u0435\u0437 \u043e\u0431\u0441\u0443\u0436\u0434\u0435\u043d\u0438\u044f', '\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u044f\u0441\u043d\u043e\u0435 \u043e\u0431\u043e\u0441\u043d\u043e\u0432\u0430\u043d\u0438\u0435 \u0441\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u0438', '\u041e\u0442\u043b\u043e\u0436\u0438\u0442\u044c \u043a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u044e'],
          correctIndex: 1,
        },
        {
          id: 'bq2',
          question: '\u041a\u0430\u043a\u0430\u044f \u043a\u043e\u043c\u0431\u0438\u043d\u0430\u0446\u0438\u044f \u0434\u0430\u0435\u0442 \u043b\u0443\u0447\u0448\u0443\u044e \u0434\u0438\u0430\u0433\u043d\u043e\u0441\u0442\u0438\u043a\u0443?',
          options: ['\u0422\u043e\u043b\u044c\u043a\u043e \u0438\u043d\u0442\u0435\u0440\u0432\u044c\u044e', '\u0422\u043e\u043b\u044c\u043a\u043e KPI', '\u0418\u043d\u0442\u0435\u0440\u0432\u044c\u044e + \u043c\u0435\u0442\u0440\u0438\u043a\u0438 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0430'],
          correctIndex: 2,
        },
        {
          id: 'bq3',
          question: '\u0427\u0442\u043e \u043a\u0440\u0438\u0442\u0438\u0447\u043d\u043e \u0434\u043b\u044f \u043a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0439?',
          options: ['\u0420\u0430\u0437\u043e\u0432\u0430\u044f \u0440\u0430\u0441\u0441\u044b\u043b\u043a\u0430', '\u0420\u0435\u0433\u0443\u043b\u044f\u0440\u043d\u043e\u0441\u0442\u044c \u0438 \u043e\u0431\u0440\u0430\u0442\u043d\u0430\u044f \u0441\u0432\u044f\u0437\u044c', '\u0422\u043e\u043b\u044c\u043a\u043e \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438 \u0442\u043e\u043f\u043e\u0432'],
          correctIndex: 1,
        },
        {
          id: 'bq4',
          question: '\u041a\u0430\u043a \u043f\u043e\u043d\u044f\u0442\u044c, \u0447\u0442\u043e \u0431\u044b\u0441\u0442\u0440\u0430\u044f \u043f\u043e\u0431\u0435\u0434\u0430 \u0443\u0434\u0430\u043b\u0430\u0441\u044c?',
          options: ['\u0415\u0441\u0442\u044c \u0438\u0437\u043c\u0435\u0440\u0438\u043c\u044b\u0439 \u044d\u0444\u0444\u0435\u043a\u0442 \u0438 \u0432\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430', '\u041a\u0440\u0430\u0441\u0438\u0432\u0430\u044f \u043f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u044f', '\u041c\u0435\u043d\u044c\u0448\u0435 \u0436\u0430\u043b\u043e\u0431 \u0432 \u0447\u0430\u0442\u0435'],
          correctIndex: 0,
        },
        {
          id: 'bq5',
          question: '\u0427\u0442\u043e \u0444\u0438\u043a\u0441\u0438\u0440\u0443\u0435\u0442 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0432 \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u0435?',
          options: ['\u041e\u0434\u0438\u043d \u0443\u0441\u043f\u0435\u0448\u043d\u044b\u0439 \u043f\u0438\u043b\u043e\u0442', '\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043d\u044b\u0435 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u044b, \u0440\u043e\u043b\u0438 \u0438 \u0440\u0438\u0442\u043c \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044f', '\u0424\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u043e\u0435 \u0437\u0430\u043a\u0440\u044b\u0442\u0438\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u0430'],
          correctIndex: 1,
        },
      ],
    },
  },
  lm2: {
    materialId: 'lm2',
    title: '8 шагов Коттера для трансформации',
    methodology: 'Практико-ориентированный формат: 5 последовательных занятий + итоговый квиз.',
    lessons: [
      {
        id: 'kotter-1',
        title: 'Занятие 1. Срочность и коалиция изменений',
        goal: 'Сформировать ощущение срочности и собрать команду проводников изменений.',
        content:
          'Разберите причины трансформации, ключевые риски бездействия и роли лидеров изменений. Зафиксируйте состав коалиции и зоны ответственности.',
        durationMin: 35,
        checklist: [
          'Сформулированы 3-5 причин срочности',
          'Определены ключевые стейкхолдеры',
          'Назначен владелец трансформации',
        ],
      },
      {
        id: 'kotter-2',
        title: 'Занятие 2. Видение и стратегия изменений',
        goal: 'Собрать понятное видение целевого состояния и маршрут перехода.',
        content:
          'Опишите целевую модель работы, критерии успеха и этапы внедрения. Убедитесь, что стратегия реализуема в сроках и ресурсах.',
        durationMin: 40,
        checklist: [
          'Сформулировано единое видение',
          'Определены KPI трансформации',
          'Разложены этапы и контрольные точки',
        ],
      },
      {
        id: 'kotter-3',
        title: 'Занятие 3. Коммуникация и вовлечение',
        goal: 'Снизить сопротивление через системную коммуникацию и участие команды.',
        content:
          'Подготовьте карту коммуникаций: кому, что, когда и в каком формате сообщаем. Определите каналы обратной связи и шаблоны ответов на возражения.',
        durationMin: 45,
        checklist: [
          'Готов план коммуникаций',
          'Определены частые возражения и ответы',
          'Назначены ответственные за коммуникации',
        ],
      },
      {
        id: 'kotter-4',
        title: 'Занятие 4. Быстрые победы и устранение барьеров',
        goal: 'Показать первые результаты и снять организационные ограничения.',
        content:
          'Выберите короткие инициативы с измеримым эффектом, зафиксируйте барьеры и план их устранения. Договоритесь о публичной фиксации быстрых побед.',
        durationMin: 40,
        checklist: [
          'Определены 2-3 быстрые победы',
          'Составлен реестр барьеров',
          'Утверждены действия по снятию барьеров',
        ],
      },
      {
        id: 'kotter-5',
        title: 'Занятие 5. Масштабирование и закрепление в культуре',
        goal: 'Перевести изменения в стандарт работы и корпоративные практики.',
        content:
          'Сформируйте план масштабирования, обновите регламенты и привяжите новые практики к системе оценки эффективности и обучению новых сотрудников.',
        durationMin: 45,
        checklist: [
          'Согласован план масштабирования',
          'Обновлены регламенты и роли',
          'Встроен контроль устойчивости изменений',
        ],
      },
    ],
    quiz: {
      title: 'Итоговый квиз по 8 шагам Коттера',
      passScore: 80,
      questions: [
        {
          id: 'q1',
          question: 'С чего начинается модель Коттера?',
          options: ['С формирования видения', 'С создания ощущения срочности', 'С масштабирования изменений'],
          correctIndex: 1,
        },
        {
          id: 'q2',
          question: 'Зачем нужны «быстрые победы»?',
          options: ['Чтобы сократить бюджет', 'Чтобы повысить доверие к изменениям', 'Чтобы отменить коммуникации'],
          correctIndex: 1,
        },
        {
          id: 'q3',
          question: 'Когда изменения считаются закрепленными?',
          options: ['Когда есть один успешный пилот', 'Когда практики встроены в культуру и стандарты', 'Когда проект закрыт формально'],
          correctIndex: 1,
        },
        {
          id: 'q4',
          question: 'Кто отвечает за устойчивость изменений?',
          options: ['Только HR', 'Только руководитель проекта', 'Коалиция лидеров и линейные руководители'],
          correctIndex: 2,
        },
        {
          id: 'q5',
          question: 'Что критично для шага коммуникации?',
          options: ['Единые сообщения и регулярная обратная связь', 'Разовая рассылка', 'Коммуникации только для топ-менеджмента'],
          correctIndex: 0,
        },
      ],
    },
  },
};

export default function LearningPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { learningProgress, addLearningProgress, updateLearningProgress } = useAppStore();

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [completedLessonsByCourse, setCompletedLessonsByCourse] = useState<Record<string, number[]>>({});
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const userId = user?.id || 'u1';

  const buildCompletedLessonsFromPercent = (materialId: string, progressPercent?: number) => {
    const course = structuredCourses[materialId];
    if (!course) return [];
    const boundedPercent = Math.max(0, Math.min(100, progressPercent ?? 0));
    const completedCount = Math.floor((boundedPercent / 100) * course.lessons.length);
    return Array.from({ length: completedCount }, (_, index) => index);
  };

  const getUserProgress = (materialId: string) => {
    return learningProgress.find((lp) => lp.user_id === userId && lp.material_id === materialId);
  };

  const upsertLearningProgress = (materialId: string, progressPercent: number, isCompleted = false) => {
    const existing = getUserProgress(materialId);
    const now = new Date().toISOString();

    if (existing) {
      updateLearningProgress(existing.id, {
        progress_percent: Math.max(existing.progress_percent, progressPercent),
        completed_at: isCompleted ? now : existing.completed_at,
      });
      return;
    }

    addLearningProgress({
      id: 'ulp' + Date.now(),
      user_id: userId,
      material_id: materialId,
      progress_percent: progressPercent,
      completed_at: isCompleted ? now : undefined,
    });
  };

  const handleStart = (materialId: string) => {
    const existing = getUserProgress(materialId);
    if (!existing) {
      addLearningProgress({
        id: 'ulp' + Date.now(),
        user_id: userId,
        material_id: materialId,
        progress_percent: 10,
      });
    }
  };

  const handleComplete = (materialId: string) => {
    upsertLearningProgress(materialId, 100, true);
  };

  const openStructuredCourse = (materialId: string) => {
    const course = structuredCourses[materialId];
    if (!course) return;

    const existing = getUserProgress(materialId);
    const completedLessons =
      completedLessonsByCourse[materialId] ?? buildCompletedLessonsFromPercent(materialId, existing?.progress_percent);
    const nextLessonIndex = course.lessons.findIndex((_, index) => !completedLessons.includes(index));

    setCompletedLessonsByCourse((prev) => {
      if (prev[materialId]) return prev;
      return {
        ...prev,
        [materialId]: completedLessons,
      };
    });
    setActiveCourseId(materialId);
    setActiveLessonIndex(nextLessonIndex === -1 ? course.lessons.length - 1 : nextLessonIndex);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const closeStructuredCourse = () => {
    setActiveCourseId(null);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const activeCourse = activeCourseId ? structuredCourses[activeCourseId] : null;
  const completedLessons = useMemo(
    () => (activeCourseId ? completedLessonsByCourse[activeCourseId] ?? [] : []),
    [activeCourseId, completedLessonsByCourse],
  );
  const completedLessonSet = useMemo(() => new Set(completedLessons), [completedLessons]);
  const allLessonsCompleted = !!activeCourse && completedLessons.length === activeCourse.lessons.length;

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    return completedLessonSet.has(lessonIndex - 1);
  };

  const completeLesson = (lessonIndex: number) => {
    if (!activeCourseId || !activeCourse || !isLessonUnlocked(lessonIndex)) return;

    setCompletedLessonsByCourse((prev) => {
      const currentLessons = prev[activeCourseId] ?? [];
      if (currentLessons.includes(lessonIndex)) return prev;

      const nextLessons = [...currentLessons, lessonIndex].sort((a, b) => a - b);
      const progressPercent = Math.round((nextLessons.length / activeCourse.lessons.length) * 100);
      upsertLearningProgress(activeCourseId, progressPercent);

      return {
        ...prev,
        [activeCourseId]: nextLessons,
      };
    });

    if (activeCourse.lessons[lessonIndex + 1]) {
      setActiveLessonIndex(lessonIndex + 1);
    }
  };

  const submitQuiz = () => {
    if (!activeCourseId || !activeCourse) return;

    const totalQuestions = activeCourse.quiz.questions.length;
    if (Object.keys(quizAnswers).length < totalQuestions) return;

    const correctAnswers = activeCourse.quiz.questions.reduce((sum, question) => {
      return sum + (quizAnswers[question.id] === question.correctIndex ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    setQuizScore(score);

    if (score >= activeCourse.quiz.passScore) {
      upsertLearningProgress(activeCourseId, 100, true);
      return;
    }

    const currentLessonProgress = Math.round((completedLessons.length / activeCourse.lessons.length) * 100);
    upsertLearningProgress(activeCourseId, currentLessonProgress);
  };

  const completedCount = learningProgress.filter((lp) => lp.user_id === userId && lp.completed_at).length;
  const totalCount = mockLearningMaterials.filter((m) => m.target_roles.includes(user?.role || 'employee')).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Обучение</h1>
          <p className="text-muted-foreground">Образовательные материалы по управлению изменениями</p>
        </div>
        <Card className="px-4 py-2">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold">{completedCount}/{totalCount}</p>
              <p className="text-xs text-muted-foreground">Пройдено</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockLearningMaterials.map((material) => {
          const Icon = typeIcons[material.content_type] || BookOpen;
          const progress = getUserProgress(material.id);
          const isCompleted = !!progress?.completed_at;
          const hasStructuredCourse = !!structuredCourses[material.id];
          const completedLessonIndexes = completedLessonsByCourse[material.id];
          const lessonBasedProgress = hasStructuredCourse && completedLessonIndexes
            ? Math.round((completedLessonIndexes.length / structuredCourses[material.id].lessons.length) * 100)
            : undefined;
          const displayProgressPercent = lessonBasedProgress ?? progress?.progress_percent;

          return (
            <Card key={material.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                    {isCompleted && (
                      <CheckCircle2 className="absolute -top-1.5 -right-1.5 h-4 w-4 text-green-600 bg-background rounded-full" />
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">{material.category}</Badge>
                  </div>
                </div>
                <CardTitle className="text-sm mt-2">{material.title}</CardTitle>
                <CardDescription className="text-xs">{material.content}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{material.duration_min} мин.</span>
                </div>
                {displayProgressPercent !== undefined && (
                  <div className="space-y-1">
                    <Progress value={displayProgressPercent} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{displayProgressPercent}%</p>
                  </div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (material.id === 'lm1' || material.id === 'lm3') {
                      navigate(`/learning/course/${material.id}`);
                      return;
                    }

                    if (hasStructuredCourse) {
                      openStructuredCourse(material.id);
                      return;
                    }

                    if (!progress) {
                      handleStart(material.id);
                      return;
                    }

                    if (!isCompleted) {
                      handleComplete(material.id);
                    }
                  }}
                >
                  {'\u041e\u0442\u043a\u0440\u044b\u0442\u044c'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!activeCourse} onOpenChange={(open) => (!open ? closeStructuredCourse() : undefined)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {activeCourse && (
            <>
              <DialogHeader>
                <DialogTitle>{activeCourse.title}</DialogTitle>
                <DialogDescription>{activeCourse.methodology}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Прогресс курса</p>
                  <Progress
                    value={Math.round((completedLessons.length / activeCourse.lessons.length) * 100)}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeCourse.lessons.map((lesson, index) => {
                    const isCompletedLesson = completedLessonSet.has(index);
                    const isUnlocked = isLessonUnlocked(index);

                    return (
                      <Card
                        key={lesson.id}
                        className={activeLessonIndex === index ? 'border-primary' : ''}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-sm">{lesson.title}</CardTitle>
                            {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <CardDescription className="text-xs">{lesson.goal}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-xs text-muted-foreground">{lesson.durationMin} мин.</p>
                          {isCompletedLesson && (
                            <Badge className="bg-green-100 text-green-800">{'\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e'}</Badge>
                          )}
                            <Button
                              size="sm"
                              variant={isUnlocked ? 'outline' : 'secondary'}
                              disabled={!isUnlocked}
                              onClick={() => setActiveLessonIndex(index)}
                            >
                              {isUnlocked
                                ? '\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0437\u0430\u043d\u044f\u0442\u0438\u0435'
                                : '\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043e'}
                            </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{activeCourse.lessons[activeLessonIndex].title}</CardTitle>
                    <CardDescription>{activeCourse.lessons[activeLessonIndex].goal}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{activeCourse.lessons[activeLessonIndex].content}</p>
                    {activeCourse.lessons[activeLessonIndex].longread && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium mb-1">Лонгрид:</p>
                        {activeCourse.lessons[activeLessonIndex].longread?.map((paragraph) => (
                          <p key={paragraph} className="text-sm text-muted-foreground leading-relaxed">{paragraph}</p>
                        ))}
                      </div>
                    )}

                    {activeCourse.lessons[activeLessonIndex].media && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium mb-1">Мультимедиа:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {activeCourse.lessons[activeLessonIndex].media?.map((media) => (
                            <Card key={media.id} className="border-dashed">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">{media.title}</CardTitle>
                                <CardDescription className="text-xs">{media.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0 space-y-2">
                                <Badge variant="outline" className="text-xs">{mediaTypeLabels[media.type]}</Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => window.open(media.url, '_blank', 'noopener,noreferrer')}
                                >
                                  {'\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0440\u0435\u0441\u0443\u0440\u0441'}
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-2">Практические шаги:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {activeCourse.lessons[activeLessonIndex].checklist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    {!completedLessonSet.has(activeLessonIndex) && (
                      <Button onClick={() => completeLesson(activeLessonIndex)}>
                        {'\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044c \u0437\u0430\u043d\u044f\u0442\u0438\u0435'}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{activeCourse.quiz.title}</CardTitle>
                    <CardDescription>
                      Квиз станет доступен после завершения всех 5 занятий. Проходной балл: {activeCourse.quiz.passScore}%.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!allLessonsCompleted && (
                      <Badge variant="secondary">
                        {'\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u0432\u0441\u0435 \u0437\u0430\u043d\u044f\u0442\u0438\u044f \u043f\u043e \u043f\u043e\u0440\u044f\u0434\u043a\u0443'}
                      </Badge>
                    )}

                    {allLessonsCompleted && (
                      <div className="space-y-4">
                        {activeCourse.quiz.questions.map((question, index) => (
                          <div key={question.id} className="space-y-2">
                            <p className="text-sm font-medium">{index + 1}. {question.question}</p>
                            <div className="flex flex-col gap-2">
                              {question.options.map((option, optionIndex) => (
                                <Button
                                  key={option}
                                  type="button"
                                  variant={quizAnswers[question.id] === optionIndex ? 'default' : 'outline'}
                                  className="justify-start h-auto whitespace-normal"
                                  onClick={() => setQuizAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                                >
                                  {option}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <Button onClick={submitQuiz}>{'\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c \u043a\u0432\u0438\u0437'}</Button>

                        {quizScore !== null && (
                          quizScore >= activeCourse.quiz.passScore ? (
                            <Badge className="bg-green-100 text-green-800">
                              {'\u041a\u0432\u0438\u0437 \u043f\u0440\u043e\u0439\u0434\u0435\u043d'}: {quizScore}%.
                              {' \u041a\u0443\u0440\u0441 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d.'}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              {'\u041a\u0432\u0438\u0437 \u043d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d'}: {quizScore}%.
                              {' \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0441\u043d\u043e\u0432\u0430.'}
                            </Badge>
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

