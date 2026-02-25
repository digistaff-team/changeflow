import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockLearningMaterials } from '@/data/mock-data';
import type { LearningMaterial } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { t, tm } from '@/lib/i18n';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Play, Headphones,
  BarChart3, Trophy, Clock, Lock, BookOpen,
} from 'lucide-react';

interface CourseMedia {
  id: string;
  type: 'video' | 'audio' | 'infographic';
  title: string;
  description: string;
  url: string;
}

interface CourseLesson {
  id: string;
  title: string;
  shortTitle: string;
  goal: string;
  content: string;
  durationMin: number;
  checklist: string[];
  longread: string[];
  media: CourseMedia[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface CourseBlueprint {
  area: string;
  outcomes: [string, string, string];
  lessonFocus: [string, string, string, string, string];
}

interface CourseModel {
  lessons: CourseLesson[];
  quiz: QuizQuestion[];
}

interface PersistedCourseChecklist {
  checkedItems: Record<string, number[]>;
}

const courseBlueprints: Record<string, CourseBlueprint> = tm<Record<string, CourseBlueprint>>('courseBasics.blueprints');
const fallbackBlueprint: CourseBlueprint = tm<CourseBlueprint>('courseBasics.fallback');
const lessonNames = tm<string[]>('courseBasics.lessonNames');
const lessonDurations = [35, 40, 45, 40, 50];

function buildCourseModel(material: LearningMaterial): CourseModel {
  const blueprint = courseBlueprints[material.id] ?? fallbackBlueprint;

  const lessons: CourseLesson[] = lessonNames.map((name, index) => {
    const n = index + 1;
    const focus = blueprint.lessonFocus[index];
    return {
      id: `${material.id}-lesson-${n}`,
      title: t('courseBasics.lesson.title', { n, name, focus }),
      shortTitle: `${name}`,
      goal: t('courseBasics.lesson.goal', { focus, title: material.title }),
      content: t('courseBasics.lesson.content', { focus, title: material.title }),
      durationMin: lessonDurations[index],
      checklist: [
        t('courseBasics.lesson.check1', { focus }),
        t('courseBasics.lesson.check2', { focus }),
        t('courseBasics.lesson.check3', { focus }),
      ],
      longread: [
        t('courseBasics.lesson.long1', { title: material.title, area: blueprint.area }),
        t('courseBasics.lesson.long2', { outcome: blueprint.outcomes[index % blueprint.outcomes.length] }),
      ],
      media: [
        {
          id: `${material.id}-m${n}v`,
          type: 'video',
          title: t('courseBasics.lesson.video', { focus }),
          description: t('courseBasics.lesson.videoDescription', { focus }),
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        },
        {
          id: `${material.id}-m${n}a`,
          type: 'audio',
          title: t('courseBasics.lesson.audio', { name }),
          description: t('courseBasics.lesson.audioDescription', { focus }),
          url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`,
        },
        {
          id: `${material.id}-m${n}i`,
          type: 'infographic',
          title: t('courseBasics.lesson.infographic', { focus }),
          description: t('courseBasics.lesson.infographicDescription', { focus }),
          url: '',
        },
      ],
    };
  });

  const quiz: QuizQuestion[] = [
    {
      id: `${material.id}-q1`,
      question: t('courseBasics.quiz.q1', { title: material.title }),
      options: tm<string[]>('courseBasics.quiz.q1_options'),
      correctIndex: 1,
      explanation: t('courseBasics.quiz.e1'),
    },
    {
      id: `${material.id}-q2`,
      question: t('courseBasics.quiz.q2', { area: blueprint.area }),
      options: tm<string[]>('courseBasics.quiz.q2_options'),
      correctIndex: 2,
      explanation: t('courseBasics.quiz.e2'),
    },
    {
      id: `${material.id}-q3`,
      question: t('courseBasics.quiz.q3'),
      options: tm<string[]>('courseBasics.quiz.q3_options'),
      correctIndex: 1,
      explanation: t('courseBasics.quiz.e3'),
    },
    {
      id: `${material.id}-q4`,
      question: t('courseBasics.quiz.q4'),
      options: tm<string[]>('courseBasics.quiz.q4_options'),
      correctIndex: 0,
      explanation: t('courseBasics.quiz.e4'),
    },
    {
      id: `${material.id}-q5`,
      question: t('courseBasics.quiz.q5'),
      options: tm<string[]>('courseBasics.quiz.q5_options'),
      correctIndex: 2,
      explanation: t('courseBasics.quiz.e5'),
    },
  ];

  return { lessons, quiz };
}

export default function CourseBasicsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const {
    learningProgress,
    lessonProgress,
    addLearningProgress,
    updateLearningProgress,
    addLessonProgress,
  } = useAppStore();
  const courseMaterial = mockLearningMaterials.find((m) => m.id === id) ?? mockLearningMaterials[0];
  const courseId = courseMaterial.id;
  const courseTitle = courseMaterial.title;
  const courseSummary = courseMaterial.content;
  const courseModel = useMemo(() => buildCourseModel(courseMaterial), [courseMaterial]);
  const lessons = courseModel.lessons;
  const quizQuestions = courseModel.quiz;

  const [activeLesson, setActiveLesson] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, Set<number>>>({});
  const [showQuest, setShowQuest] = useState(false);
  const [questAnswers, setQuestAnswers] = useState<(number | null)[]>([]);
  const [questSubmitted, setQuestSubmitted] = useState(false);

  const userId = user?.id || 'u1';
  const progressRecord = learningProgress.find(lp => lp.user_id === userId && lp.material_id === courseId);
  const completedLessonIds = useMemo(
    () =>
      new Set(
        lessonProgress
          .filter((lp) => lp.user_id === userId && lp.material_id === courseId)
          .map((lp) => lp.lesson_id),
      ),
    [courseId, lessonProgress, userId],
  );
  const completedLessonsCount = completedLessonIds.size;
  const checklistStorageKey = `cf-course-checklist:${userId}:${courseId}`;
  const totalDuration = useMemo(() => lessons.reduce((s, lesson) => s + lesson.durationMin, 0), [lessons]);
  const overallPercent = Math.round((completedLessonsCount / lessons.length) * 100);

  useEffect(() => {
    setActiveLesson(0);
    setShowQuest(false);
    setQuestAnswers(new Array(quizQuestions.length).fill(null));
    setQuestSubmitted(Boolean(progressRecord?.completed_at));
  }, [progressRecord?.completed_at, quizQuestions.length]);

  useEffect(() => {
    const persisted = localStorage.getItem(checklistStorageKey);
    if (!persisted) {
      setCheckedItems({});
      return;
    }

    try {
      const parsed = JSON.parse(persisted) as PersistedCourseChecklist;
      setCheckedItems(
        Object.fromEntries(
          Object.entries(parsed.checkedItems ?? {}).map(([lessonId, items]) => [lessonId, new Set(items)]),
        ),
      );
    } catch {
      setCheckedItems({});
    }
  }, [checklistStorageKey]);

  useEffect(() => {
    const payload: PersistedCourseChecklist = {
      checkedItems: Object.fromEntries(
        Object.entries(checkedItems).map(([lessonId, items]) => [lessonId, Array.from(items.values()).sort((a, b) => a - b)]),
      ),
    };
    localStorage.setItem(checklistStorageKey, JSON.stringify(payload));
  }, [checkedItems, checklistStorageKey]);

  const isLessonUnlocked = (index: number) => index === 0 || completedLessonIds.has(lessons[index - 1].id);

  const upsertCourseProgress = (lessonCount: number, completedAt?: string) => {
    const progressPercent = Math.round((lessonCount / lessons.length) * 100);
    if (progressRecord) {
      updateLearningProgress(progressRecord.id, {
        progress_percent: progressPercent,
        completed_at: completedAt ?? progressRecord.completed_at,
      });
      return;
    }

    addLearningProgress({
      id: `ulp-${courseId}-${Date.now()}`,
      user_id: userId,
      material_id: courseId,
      progress_percent: progressPercent,
      completed_at: completedAt,
    });
  };

  const markLessonComplete = (lessonIndex: number) => {
    const lessonId = lessons[lessonIndex].id;
    if (completedLessonIds.has(lessonId)) return;

    addLessonProgress({
      id: `lp-${courseId}-${lessonId}-${Date.now()}`,
      user_id: userId,
      material_id: courseId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
    });
    upsertCourseProgress(completedLessonsCount + 1);
  };

  const toggleCheckItem = (lessonId: string, itemIndex: number) => {
    setCheckedItems(prev => {
      const current = prev[lessonId] ?? new Set<number>();
      const next = new Set(current);
      if (next.has(itemIndex)) next.delete(itemIndex); else next.add(itemIndex);
      return { ...prev, [lessonId]: next };
    });
  };

  const handleQuestSubmit = () => {
    setQuestSubmitted(true);
    upsertCourseProgress(completedLessonsCount, new Date().toISOString());
  };

  const questScore = questAnswers.reduce<number>((acc, a, i) => acc + (a === quizQuestions[i].correctIndex ? 1 : 0), 0);

  const currentLesson = lessons[activeLesson];
  const currentChecked = checkedItems[currentLesson.id] ?? new Set<number>();

  const renderMedia = (media: CourseMedia) => {
    switch (media.type) {
      case 'video':
        return (
          <div key={media.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground text-sm">{media.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground">{media.description}</p>
            <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
              <iframe src={media.url} className="w-full h-full" allowFullScreen title={media.title} />
            </div>
          </div>
        );
      case 'audio':
        return (
          <div key={media.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground text-sm">{media.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground">{media.description}</p>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <audio controls className="w-full" src={media.url}>
                {t('courseBasics.ui.audioNotSupported')}
              </audio>
            </div>
          </div>
        );
      case 'infographic':
        return (
          <div key={media.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground text-sm">{media.title}</h4>
            </div>
            <div className="rounded-lg border border-border bg-primary/5 p-4">
              <p className="text-sm text-muted-foreground">{media.description}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-border bg-card px-6 py-4 space-y-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/learning')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{courseTitle}</h1>
            <p className="text-sm text-muted-foreground">{courseSummary}</p>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            <Clock className="h-3 w-3 mr-1" /> ~{totalDuration} {t('courseBasics.ui.minutes')}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Progress value={overallPercent} className="h-2 flex-1" />
          <span className="text-sm font-bold text-primary whitespace-nowrap">{overallPercent}%</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{completedLessonsCount}/{lessons.length} {t('courseBasics.ui.lessons')}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-border bg-card shrink-0 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {lessons.map((lesson, i) => {
                const unlocked = isLessonUnlocked(i);
                const completed = completedLessonIds.has(lesson.id);
                const isActive = activeLesson === i && !showQuest;

                return (
                  <button
                    key={lesson.id}
                    disabled={!unlocked}
                    onClick={() => { setActiveLesson(i); setShowQuest(false); }}
                    className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors text-sm flex items-center gap-3 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : unlocked
                          ? 'hover:bg-muted text-foreground'
                          : 'text-muted-foreground opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="shrink-0">
                      {completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : !unlocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <div className={`h-4 w-4 rounded-full border-2 ${isActive ? 'border-primary' : 'border-muted-foreground/40'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{lesson.shortTitle}</p>
                      <p className="text-xs text-muted-foreground">{lesson.durationMin} {t('courseBasics.ui.minutes')}</p>
                    </div>
                  </button>
                );
              })}

              <Separator className="my-2" />

              <button
                disabled={completedLessonsCount < lessons.length}
                onClick={() => setShowQuest(true)}
                className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors text-sm flex items-center gap-3 ${
                  showQuest
                    ? 'bg-primary/10 text-primary font-medium'
                    : completedLessonsCount >= lessons.length
                      ? 'hover:bg-muted text-foreground'
                      : 'text-muted-foreground opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="shrink-0">
                  {questSubmitted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : completedLessonsCount < lessons.length ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Trophy className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p>{t('courseBasics.ui.finalQuest')}</p>
                  {questSubmitted && <p className="text-xs text-green-600">{t('courseBasics.ui.correctAnswers', { score: questScore, total: quizQuestions.length })}</p>}
                </div>
              </button>
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {!showQuest ? (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{t('courseBasics.ui.lesson', { n: activeLesson + 1 })}</Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" /> {currentLesson.durationMin} {t('courseBasics.ui.minutes')}
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mt-2">{currentLesson.title}</h2>
                  <p className="text-muted-foreground mt-1">{currentLesson.goal}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">{t('courseBasics.ui.lessonMaterial')}</h3>
                  </div>
                  <p className="text-foreground leading-relaxed">{currentLesson.content}</p>
                  {currentLesson.longread.map((paragraph, i) => (
                    <p
                      key={i}
                      className={`leading-relaxed ${
                        i === 0
                          ? 'text-foreground text-base border-l-4 border-primary pl-4 py-1 bg-primary/5 rounded-r-lg'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {currentLesson.media.length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    {currentLesson.media.map(renderMedia)}
                  </div>
                )}

                <div className="space-y-3">
                  <Separator />
                  <h3 className="text-lg font-semibold text-foreground">{t('courseBasics.ui.practical')}</h3>
                  <div className="space-y-2">
                    {currentLesson.checklist.map((item, i) => (
                      <label
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <Checkbox
                          checked={currentChecked.has(i)}
                          onCheckedChange={() => toggleCheckItem(currentLesson.id, i)}
                          className="mt-0.5"
                        />
                        <span className={`text-sm ${currentChecked.has(i) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeLesson === 0}
                    onClick={() => setActiveLesson(prev => prev - 1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> {t('courseBasics.ui.back')}
                  </Button>

                  <div className="flex gap-2">
                    {!completedLessonIds.has(lessons[activeLesson].id) ? (
                      <Button size="sm" onClick={() => markLessonComplete(activeLesson)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> {t('courseBasics.ui.completeLesson')}
                      </Button>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1.5">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> {t('courseBasics.ui.completed')}
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeLesson === lessons.length - 1 || !completedLessonIds.has(lessons[activeLesson].id)}
                    onClick={() => setActiveLesson(prev => prev + 1)}
                  >
                    {t('courseBasics.ui.next')} <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <CardTitle>{t('courseBasics.ui.finalQuest')}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('courseBasics.ui.questSubtitle')}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {quizQuestions.map((q, qi) => (
                    <div key={qi} className="space-y-3">
                      <p className="font-medium text-foreground">{qi + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => {
                          const selected = questAnswers[qi] === oi;
                          const isCorrect = questSubmitted && oi === q.correctIndex;
                          const isWrong = questSubmitted && selected && oi !== q.correctIndex;
                          return (
                            <button
                              key={oi}
                              disabled={questSubmitted}
                              onClick={() => {
                                const next = [...questAnswers];
                                next[qi] = oi;
                                setQuestAnswers(next);
                              }}
                              className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                                isCorrect ? 'border-green-500 bg-green-50 text-green-800' :
                                isWrong ? 'border-destructive bg-red-50 text-red-800' :
                                selected ? 'border-primary bg-primary/10 text-foreground' :
                                'border-border hover:border-primary/50 text-muted-foreground'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {questSubmitted && (
                        <p className={`text-xs ${questAnswers[qi] === q.correctIndex ? 'text-green-600' : 'text-destructive'}`}>
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}

                  <Separator />

                  {!questSubmitted ? (
                    <Button
                      className="w-full"
                      disabled={questAnswers.some(a => a === null)}
                      onClick={handleQuestSubmit}
                    >
                      <Trophy className="h-4 w-4 mr-2" /> {t('courseBasics.ui.submitAnswers')}
                    </Button>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-lg font-bold text-foreground">
                        {t('courseBasics.ui.result', { score: questScore, total: quizQuestions.length })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {questScore >= 4 ? t('courseBasics.ui.resultHigh') :
                         questScore >= 3 ? t('courseBasics.ui.resultMid') :
                         t('courseBasics.ui.resultLow')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
