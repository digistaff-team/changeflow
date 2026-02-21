import { useMemo, useState } from 'react';
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

const structuredCourses: Record<string, StructuredCourse> = {
  lm2: {
    materialId: 'lm2',
    title: '8 С€Р°РіРѕРІ РљРѕС‚С‚РµСЂР° РґР»СЏ С‚СЂР°РЅСЃС„РѕСЂРјР°С†РёРё',
    methodology: 'РџСЂР°РєС‚РёРєРѕ-РѕСЂРёРµРЅС‚РёСЂРѕРІР°РЅРЅС‹Р№ С„РѕСЂРјР°С‚: 5 РїРѕСЃР»РµРґРѕРІР°С‚РµР»СЊРЅС‹С… Р·Р°РЅСЏС‚РёР№ + РёС‚РѕРіРѕРІС‹Р№ РєРІРёР·.',
    lessons: [
      {
        id: 'kotter-1',
        title: 'Р—Р°РЅСЏС‚РёРµ 1. РЎСЂРѕС‡РЅРѕСЃС‚СЊ Рё РєРѕР°Р»РёС†РёСЏ РёР·РјРµРЅРµРЅРёР№',
        goal: 'РЎС„РѕСЂРјРёСЂРѕРІР°С‚СЊ РѕС‰СѓС‰РµРЅРёРµ СЃСЂРѕС‡РЅРѕСЃС‚Рё Рё СЃРѕР±СЂР°С‚СЊ РєРѕРјР°РЅРґСѓ РїСЂРѕРІРѕРґРЅРёРєРѕРІ РёР·РјРµРЅРµРЅРёР№.',
        content:
          'Р Р°Р·Р±РµСЂРёС‚Рµ РїСЂРёС‡РёРЅС‹ С‚СЂР°РЅСЃС„РѕСЂРјР°С†РёРё, РєР»СЋС‡РµРІС‹Рµ СЂРёСЃРєРё Р±РµР·РґРµР№СЃС‚РІРёСЏ Рё СЂРѕР»Рё Р»РёРґРµСЂРѕРІ РёР·РјРµРЅРµРЅРёР№. Р—Р°С„РёРєСЃРёСЂСѓР№С‚Рµ СЃРѕСЃС‚Р°РІ РєРѕР°Р»РёС†РёРё Рё Р·РѕРЅС‹ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚Рё.',
        durationMin: 35,
        checklist: [
          'РЎС„РѕСЂРјСѓР»РёСЂРѕРІР°РЅС‹ 3-5 РїСЂРёС‡РёРЅ СЃСЂРѕС‡РЅРѕСЃС‚Рё',
          'РћРїСЂРµРґРµР»РµРЅС‹ РєР»СЋС‡РµРІС‹Рµ СЃС‚РµР№РєС…РѕР»РґРµСЂС‹',
          'РќР°Р·РЅР°С‡РµРЅ РІР»Р°РґРµР»РµС† С‚СЂР°РЅСЃС„РѕСЂРјР°С†РёРё',
        ],
      },
      {
        id: 'kotter-2',
        title: 'Р—Р°РЅСЏС‚РёРµ 2. Р’РёРґРµРЅРёРµ Рё СЃС‚СЂР°С‚РµРіРёСЏ РёР·РјРµРЅРµРЅРёР№',
        goal: 'РЎРѕР±СЂР°С‚СЊ РїРѕРЅСЏС‚РЅРѕРµ РІРёРґРµРЅРёРµ С†РµР»РµРІРѕРіРѕ СЃРѕСЃС‚РѕСЏРЅРёСЏ Рё РјР°СЂС€СЂСѓС‚ РїРµСЂРµС…РѕРґР°.',
        content:
          'РћРїРёС€РёС‚Рµ С†РµР»РµРІСѓСЋ РјРѕРґРµР»СЊ СЂР°Р±РѕС‚С‹, РєСЂРёС‚РµСЂРёРё СѓСЃРїРµС…Р° Рё СЌС‚Р°РїС‹ РІРЅРµРґСЂРµРЅРёСЏ. РЈР±РµРґРёС‚РµСЃСЊ, С‡С‚Рѕ СЃС‚СЂР°С‚РµРіРёСЏ СЂРµР°Р»РёР·СѓРµРјР° РІ СЃСЂРѕРєР°С… Рё СЂРµСЃСѓСЂСЃР°С….',
        durationMin: 40,
        checklist: [
          'РЎС„РѕСЂРјСѓР»РёСЂРѕРІР°РЅРѕ РµРґРёРЅРѕРµ РІРёРґРµРЅРёРµ',
          'РћРїСЂРµРґРµР»РµРЅС‹ KPI С‚СЂР°РЅСЃС„РѕСЂРјР°С†РёРё',
          'Р Р°Р·Р»РѕР¶РµРЅС‹ СЌС‚Р°РїС‹ Рё РєРѕРЅС‚СЂРѕР»СЊРЅС‹Рµ С‚РѕС‡РєРё',
        ],
      },
      {
        id: 'kotter-3',
        title: 'Р—Р°РЅСЏС‚РёРµ 3. РљРѕРјРјСѓРЅРёРєР°С†РёСЏ Рё РІРѕРІР»РµС‡РµРЅРёРµ',
        goal: 'РЎРЅРёР·РёС‚СЊ СЃРѕРїСЂРѕС‚РёРІР»РµРЅРёРµ С‡РµСЂРµР· СЃРёСЃС‚РµРјРЅСѓСЋ РєРѕРјРјСѓРЅРёРєР°С†РёСЋ Рё СѓС‡Р°СЃС‚РёРµ РєРѕРјР°РЅРґС‹.',
        content:
          'РџРѕРґРіРѕС‚РѕРІСЊС‚Рµ РєР°СЂС‚Сѓ РєРѕРјРјСѓРЅРёРєР°С†РёР№: РєРѕРјСѓ, С‡С‚Рѕ, РєРѕРіРґР° Рё РІ РєР°РєРѕРј С„РѕСЂРјР°С‚Рµ СЃРѕРѕР±С‰Р°РµРј. РћРїСЂРµРґРµР»РёС‚Рµ РєР°РЅР°Р»С‹ РѕР±СЂР°С‚РЅРѕР№ СЃРІСЏР·Рё Рё С€Р°Р±Р»РѕРЅС‹ РѕС‚РІРµС‚РѕРІ РЅР° РІРѕР·СЂР°Р¶РµРЅРёСЏ.',
        durationMin: 45,
        checklist: [
          'Р“РѕС‚РѕРІ РїР»Р°РЅ РєРѕРјРјСѓРЅРёРєР°С†РёР№',
          'РћРїСЂРµРґРµР»РµРЅС‹ С‡Р°СЃС‚С‹Рµ РІРѕР·СЂР°Р¶РµРЅРёСЏ Рё РѕС‚РІРµС‚С‹',
          'РќР°Р·РЅР°С‡РµРЅС‹ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Рµ Р·Р° РєРѕРјРјСѓРЅРёРєР°С†РёРё',
        ],
      },
      {
        id: 'kotter-4',
        title: 'Р—Р°РЅСЏС‚РёРµ 4. Р‘С‹СЃС‚СЂС‹Рµ РїРѕР±РµРґС‹ Рё СѓСЃС‚СЂР°РЅРµРЅРёРµ Р±Р°СЂСЊРµСЂРѕРІ',
        goal: 'РџРѕРєР°Р·Р°С‚СЊ РїРµСЂРІС‹Рµ СЂРµР·СѓР»СЊС‚Р°С‚С‹ Рё СЃРЅСЏС‚СЊ РѕСЂРіР°РЅРёР·Р°С†РёРѕРЅРЅС‹Рµ РѕРіСЂР°РЅРёС‡РµРЅРёСЏ.',
        content:
          'Р’С‹Р±РµСЂРёС‚Рµ РєРѕСЂРѕС‚РєРёРµ РёРЅРёС†РёР°С‚РёРІС‹ СЃ РёР·РјРµСЂРёРјС‹Рј СЌС„С„РµРєС‚РѕРј, Р·Р°С„РёРєСЃРёСЂСѓР№С‚Рµ Р±Р°СЂСЊРµСЂС‹ Рё РїР»Р°РЅ РёС… СѓСЃС‚СЂР°РЅРµРЅРёСЏ. Р”РѕРіРѕРІРѕСЂРёС‚РµСЃСЊ Рѕ РїСѓР±Р»РёС‡РЅРѕР№ С„РёРєСЃР°С†РёРё Р±С‹СЃС‚СЂС‹С… РїРѕР±РµРґ.',
        durationMin: 40,
        checklist: [
          'РћРїСЂРµРґРµР»РµРЅС‹ 2-3 Р±С‹СЃС‚СЂС‹Рµ РїРѕР±РµРґС‹',
          'РЎРѕСЃС‚Р°РІР»РµРЅ СЂРµРµСЃС‚СЂ Р±Р°СЂСЊРµСЂРѕРІ',
          'РЈС‚РІРµСЂР¶РґРµРЅС‹ РґРµР№СЃС‚РІРёСЏ РїРѕ СЃРЅСЏС‚РёСЋ Р±Р°СЂСЊРµСЂРѕРІ',
        ],
      },
      {
        id: 'kotter-5',
        title: 'Р—Р°РЅСЏС‚РёРµ 5. РњР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёРµ Рё Р·Р°РєСЂРµРїР»РµРЅРёРµ РІ РєСѓР»СЊС‚СѓСЂРµ',
        goal: 'РџРµСЂРµРІРµСЃС‚Рё РёР·РјРµРЅРµРЅРёСЏ РІ СЃС‚Р°РЅРґР°СЂС‚ СЂР°Р±РѕС‚С‹ Рё РєРѕСЂРїРѕСЂР°С‚РёРІРЅС‹Рµ РїСЂР°РєС‚РёРєРё.',
        content:
          'РЎС„РѕСЂРјРёСЂСѓР№С‚Рµ РїР»Р°РЅ РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёСЏ, РѕР±РЅРѕРІРёС‚Рµ СЂРµРіР»Р°РјРµРЅС‚С‹ Рё РїСЂРёРІСЏР¶РёС‚Рµ РЅРѕРІС‹Рµ РїСЂР°РєС‚РёРєРё Рє СЃРёСЃС‚РµРјРµ РѕС†РµРЅРєРё СЌС„С„РµРєС‚РёРІРЅРѕСЃС‚Рё Рё РѕР±СѓС‡РµРЅРёСЋ РЅРѕРІС‹С… СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ.',
        durationMin: 45,
        checklist: [
          'РЎРѕРіР»Р°СЃРѕРІР°РЅ РїР»Р°РЅ РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёСЏ',
          'РћР±РЅРѕРІР»РµРЅС‹ СЂРµРіР»Р°РјРµРЅС‚С‹ Рё СЂРѕР»Рё',
          'Р’СЃС‚СЂРѕРµРЅ РєРѕРЅС‚СЂРѕР»СЊ СѓСЃС‚РѕР№С‡РёРІРѕСЃС‚Рё РёР·РјРµРЅРµРЅРёР№',
        ],
      },
    ],
    quiz: {
      title: 'РС‚РѕРіРѕРІС‹Р№ РєРІРёР· РїРѕ 8 С€Р°РіР°Рј РљРѕС‚С‚РµСЂР°',
      passScore: 80,
      questions: [
        {
          id: 'q1',
          question: 'РЎ С‡РµРіРѕ РЅР°С‡РёРЅР°РµС‚СЃСЏ РјРѕРґРµР»СЊ РљРѕС‚С‚РµСЂР°?',
          options: ['РЎ С„РѕСЂРјРёСЂРѕРІР°РЅРёСЏ РІРёРґРµРЅРёСЏ', 'РЎ СЃРѕР·РґР°РЅРёСЏ РѕС‰СѓС‰РµРЅРёСЏ СЃСЂРѕС‡РЅРѕСЃС‚Рё', 'РЎ РјР°СЃС€С‚Р°Р±РёСЂРѕРІР°РЅРёСЏ РёР·РјРµРЅРµРЅРёР№'],
          correctIndex: 1,
        },
        {
          id: 'q2',
          question: 'Р—Р°С‡РµРј РЅСѓР¶РЅС‹ В«Р±С‹СЃС‚СЂС‹Рµ РїРѕР±РµРґС‹В»?',
          options: ['Р§С‚РѕР±С‹ СЃРѕРєСЂР°С‚РёС‚СЊ Р±СЋРґР¶РµС‚', 'Р§С‚РѕР±С‹ РїРѕРІС‹СЃРёС‚СЊ РґРѕРІРµСЂРёРµ Рє РёР·РјРµРЅРµРЅРёСЏРј', 'Р§С‚РѕР±С‹ РѕС‚РјРµРЅРёС‚СЊ РєРѕРјРјСѓРЅРёРєР°С†РёРё'],
          correctIndex: 1,
        },
        {
          id: 'q3',
          question: 'РљРѕРіРґР° РёР·РјРµРЅРµРЅРёСЏ СЃС‡РёС‚Р°СЋС‚СЃСЏ Р·Р°РєСЂРµРїР»РµРЅРЅС‹РјРё?',
          options: ['РљРѕРіРґР° РµСЃС‚СЊ РѕРґРёРЅ СѓСЃРїРµС€РЅС‹Р№ РїРёР»РѕС‚', 'РљРѕРіРґР° РїСЂР°РєС‚РёРєРё РІСЃС‚СЂРѕРµРЅС‹ РІ РєСѓР»СЊС‚СѓСЂСѓ Рё СЃС‚Р°РЅРґР°СЂС‚С‹', 'РљРѕРіРґР° РїСЂРѕРµРєС‚ Р·Р°РєСЂС‹С‚ С„РѕСЂРјР°Р»СЊРЅРѕ'],
          correctIndex: 1,
        },
        {
          id: 'q4',
          question: 'РљС‚Рѕ РѕС‚РІРµС‡Р°РµС‚ Р·Р° СѓСЃС‚РѕР№С‡РёРІРѕСЃС‚СЊ РёР·РјРµРЅРµРЅРёР№?',
          options: ['РўРѕР»СЊРєРѕ HR', 'РўРѕР»СЊРєРѕ СЂСѓРєРѕРІРѕРґРёС‚РµР»СЊ РїСЂРѕРµРєС‚Р°', 'РљРѕР°Р»РёС†РёСЏ Р»РёРґРµСЂРѕРІ Рё Р»РёРЅРµР№РЅС‹Рµ СЂСѓРєРѕРІРѕРґРёС‚РµР»Рё'],
          correctIndex: 2,
        },
        {
          id: 'q5',
          question: 'Р§С‚Рѕ РєСЂРёС‚РёС‡РЅРѕ РґР»СЏ С€Р°РіР° РєРѕРјРјСѓРЅРёРєР°С†РёРё?',
          options: ['Р•РґРёРЅС‹Рµ СЃРѕРѕР±С‰РµРЅРёСЏ Рё СЂРµРіСѓР»СЏСЂРЅР°СЏ РѕР±СЂР°С‚РЅР°СЏ СЃРІСЏР·СЊ', 'Р Р°Р·РѕРІР°СЏ СЂР°СЃСЃС‹Р»РєР°', 'РљРѕРјРјСѓРЅРёРєР°С†РёРё С‚РѕР»СЊРєРѕ РґР»СЏ С‚РѕРї-РјРµРЅРµРґР¶РјРµРЅС‚Р°'],
          correctIndex: 0,
        },
      ],
    },
  },
};

export default function LearningPage() {
  const { user } = useAuthStore();
  const { learningProgress, addLearningProgress, updateLearningProgress } = useAppStore();

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [completedLessonsByCourse, setCompletedLessonsByCourse] = useState<Record<string, number[]>>({});
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const userId = user?.id || 'u1';

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

    const completedLessons = completedLessonsByCourse[materialId] ?? [];
    const nextLessonIndex = course.lessons.findIndex((_, index) => !completedLessons.includes(index));

    setActiveCourseId(materialId);
    setActiveLessonIndex(nextLessonIndex === -1 ? course.lessons.length - 1 : nextLessonIndex);
    setQuizAnswers({});
    setQuizScore(null);

    const existing = getUserProgress(materialId);
    if (!existing) {
      upsertLearningProgress(materialId, 5);
    }
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
      const progressPercent = Math.round((nextLessons.length / (activeCourse.lessons.length + 1)) * 100);
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

    const currentLessonProgress = Math.round((activeCourse.lessons.length / (activeCourse.lessons.length + 1)) * 100);
    upsertLearningProgress(activeCourseId, currentLessonProgress);
  };

  const completedCount = learningProgress.filter((lp) => lp.user_id === userId && lp.completed_at).length;
  const totalCount = mockLearningMaterials.filter((m) => m.target_roles.includes(user?.role || 'employee')).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">РћР±СѓС‡РµРЅРёРµ</h1>
          <p className="text-muted-foreground">РћР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹Рµ РјР°С‚РµСЂРёР°Р»С‹ РїРѕ СѓРїСЂР°РІР»РµРЅРёСЋ РёР·РјРµРЅРµРЅРёСЏРјРё</p>
        </div>
        <Card className="px-4 py-2">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold">{completedCount}/{totalCount}</p>
              <p className="text-xs text-muted-foreground">РџСЂРѕР№РґРµРЅРѕ</p>
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
                  <span>{material.duration_min} РјРёРЅ.</span>
                </div>
                {progress && (
                  <div className="space-y-1">
                    <Progress value={progress.progress_percent} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{progress.progress_percent}%</p>
                  </div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
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
                  Открыть
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
                  <p className="text-sm font-medium mb-2">РџСЂРѕРіСЂРµСЃСЃ РєСѓСЂСЃР°</p>
                  <Progress
                    value={Math.round((completedLessons.length / (activeCourse.lessons.length + 1)) * 100)}
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
                          <p className="text-xs text-muted-foreground">{lesson.durationMin} РјРёРЅ.</p>
                          {isCompletedLesson ? (
                            <Badge className="bg-green-100 text-green-800">Р—Р°РІРµСЂС€РµРЅРѕ</Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant={isUnlocked ? 'outline' : 'secondary'}
                              disabled={!isUnlocked}
                              onClick={() => setActiveLessonIndex(index)}
                            >
                              {isUnlocked ? 'РћС‚РєСЂС‹С‚СЊ Р·Р°РЅСЏС‚РёРµ' : 'Р—Р°Р±Р»РѕРєРёСЂРѕРІР°РЅРѕ'}
                            </Button>
                          )}
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
                    <div>
                      <p className="text-sm font-medium mb-2">РџСЂР°РєС‚РёС‡РµСЃРєРёРµ С€Р°РіРё:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {activeCourse.lessons[activeLessonIndex].checklist.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    {!completedLessonSet.has(activeLessonIndex) && (
                      <Button onClick={() => completeLesson(activeLessonIndex)}>Р—Р°РІРµСЂС€РёС‚СЊ Р·Р°РЅСЏС‚РёРµ</Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{activeCourse.quiz.title}</CardTitle>
                    <CardDescription>
                      РљРІРёР· СЃС‚Р°РЅРµС‚ РґРѕСЃС‚СѓРїРµРЅ РїРѕСЃР»Рµ Р·Р°РІРµСЂС€РµРЅРёСЏ РІСЃРµС… 5 Р·Р°РЅСЏС‚РёР№. РџСЂРѕС…РѕРґРЅРѕР№ Р±Р°Р»Р»: {activeCourse.quiz.passScore}%.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!allLessonsCompleted && (
                      <Badge variant="secondary">РЎРЅР°С‡Р°Р»Р° Р·Р°РІРµСЂС€РёС‚Рµ РІСЃРµ Р·Р°РЅСЏС‚РёСЏ РїРѕ РїРѕСЂСЏРґРєСѓ</Badge>
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

                        <Button onClick={submitQuiz}>РџСЂРѕРІРµСЂРёС‚СЊ РєРІРёР·</Button>

                        {quizScore !== null && (
                          quizScore >= activeCourse.quiz.passScore ? (
                            <Badge className="bg-green-100 text-green-800">
                              РљРІРёР· РїСЂРѕР№РґРµРЅ: {quizScore}%. РљСѓСЂСЃ Р·Р°РІРµСЂС€РµРЅ.
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              РљРІРёР· РЅРµ РїСЂРѕР№РґРµРЅ: {quizScore}%. РџРѕРІС‚РѕСЂРёС‚Рµ Рё РїРѕРїСЂРѕР±СѓР№С‚Рµ СЃРЅРѕРІР°.
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
