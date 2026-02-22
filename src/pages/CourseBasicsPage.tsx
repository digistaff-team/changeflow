import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockLearningMaterials } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const lessons: CourseLesson[] = [
  {
    id: 'base-1',
    title: 'Занятие 1. Природа изменений и роль лидера',
    shortTitle: 'Природа изменений',
    goal: 'Понять, почему изменения проваливаются и как управлять ими системно.',
    content: 'В фокусе занятия: модель люди-процесс-технологии, типичные ошибки и базовые принципы работы лидера изменений.',
    durationMin: 40,
    checklist: [
      'Выделены главные причины провалов изменений',
      'Сформулирована роль спонсора и лидера проекта',
      'Описаны целевые поведенческие практики',
    ],
    longread: [
      'Управление изменениями не сводится к приказу «делаем по-новому». Это управление переходом: от текущей модели работы к целевой, с четкими этапами и обратной связью. Без системного подхода даже самые разумные инициативы рискуют столкнуться с сопротивлением и потерей мотивации команды.',
      'Ключевая задача лидера — не только объявить изменение, но и обеспечить понятность, ресурсы и последовательность действий. Лидер изменений выступает как архитектор перехода: он формирует видение, выстраивает коммуникацию и создает условия для первых побед.',
    ],
    media: [
      { id: 'm1v', type: 'video', title: 'Видео: Почему изменения проваливаются', description: 'Краткий разбор 5 типовых ошибок.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm1a', type: 'audio', title: 'Подкаст: Роль лидера изменений', description: 'Практические кейсы внедрения.', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'm1i', type: 'infographic', title: 'Инфографика: Цикл изменений', description: 'От инициации до закрепления.', url: '' },
    ],
  },
  {
    id: 'base-2',
    title: 'Занятие 2. Диагностика текущего состояния',
    shortTitle: 'Диагностика',
    goal: 'Оценить готовность к изменениям и выявить барьеры.',
    content: 'Занятие посвящено карте стейкхолдеров, анализу процессов и измерению исходных KPI.',
    durationMin: 45,
    checklist: [
      'Обновлена карта стейкхолдеров',
      'Выявлены риски и барьеры',
      'Зафиксированы базовые KPI',
    ],
    longread: [
      'Диагностика — база для реалистичной дорожной карты. Без нее команда часто пропускает системные причины сопротивления. Качественная диагностика включает анализ процессов, ролей, культуры и технологической готовности организации.',
      'Важно объединять качественные (интервью, наблюдение) и количественные (метрики, сроки, дефекты) данные. Только их сочетание дает объемную картину, позволяющую принимать обоснованные решения о стратегии изменений.',
    ],
    media: [
      { id: 'm2v', type: 'video', title: 'Видео: Как проводить диагностику', description: 'Чек-лист перед запуском изменений.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm2a', type: 'audio', title: 'Подкаст: Где искать сопротивление', description: 'Сигналы риска до старта внедрения.', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'm2i', type: 'infographic', title: 'Инфографика: Матрица рисков', description: 'Влияние и вероятность для каждого риска.', url: '' },
    ],
  },
  {
    id: 'base-3',
    title: 'Занятие 3. Коммуникация и вовлечение',
    shortTitle: 'Коммуникация',
    goal: 'Построить план коммуникаций и запустить обратную связь.',
    content: 'В лонгриде разбираются каналы коммуникации, форматы сообщений и работа с вопросами сотрудников.',
    durationMin: 45,
    checklist: [
      'Собран единый план коммуникаций',
      'Определены ответственные за каналы',
      'Настроен цикл обратной связи',
    ],
    longread: [
      'Хорошая коммуникация по изменениям — это ритм и прозрачность: что делаем, зачем и как измеряем результат. Системная коммуникация снижает тревожность и создает ощущение контроля у сотрудников.',
      'Критично давать не только информацию, но и способ влиять на ход изменений через вопросы и предложения. Каналы обратной связи должны быть доступны и безопасны — только тогда команда будет делиться реальными опасениями.',
    ],
    media: [
      { id: 'm3v', type: 'video', title: 'Видео: Шаблон объявления изменений', description: 'Как говорить о нововведениях понятно.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm3a', type: 'audio', title: 'Подкаст: Сложные вопросы команды', description: 'Примеры ответов без потери доверия.', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 'm3i', type: 'infographic', title: 'Инфографика: Карта коммуникаций', description: 'Кому, что, когда и в каком канале.', url: '' },
    ],
  },
  {
    id: 'base-4',
    title: 'Занятие 4. Быстрые победы и устойчивость',
    shortTitle: 'Быстрые победы',
    goal: 'Запустить пилоты и зафиксировать быстрый эффект.',
    content: 'Здесь обсуждаются критерии быстрой победы, пилотные инициативы и метрики успеха на первые 30 дней.',
    durationMin: 40,
    checklist: [
      'Выбраны быстрые пилоты',
      'Назначены владельцы результата',
      'Зафиксирован план масштабирования',
    ],
    longread: [
      'Быстрая победа — это не показуха, а доказательство работоспособности нового подхода на реальном процессе. Она должна быть видимой, измеримой и значимой для команды.',
      'Для устойчивости нужны регламент, владелец и ритм контроля — иначе система откатится к прежним привычкам. Масштабирование начинается только после подтверждения результатов на пилоте.',
    ],
    media: [
      { id: 'm4v', type: 'video', title: 'Видео: Запуск пилота за 2 недели', description: 'Шаги и точки контроля.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm4a', type: 'audio', title: 'Подкаст: Как закрепить новую практику', description: 'Разбор ошибок масштабирования.', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { id: 'm4i', type: 'infographic', title: 'Инфографика: Воронка быстрых побед', description: 'От пилота к масштабу.', url: '' },
    ],
  },
  {
    id: 'base-5',
    title: 'Занятие 5. Интеграция изменений в культуру',
    shortTitle: 'Интеграция в культуру',
    goal: 'Встроить новые практики в ежедневное управление.',
    content: 'Финальный лонгрид о закреплении изменений: стандарты, роли, обучение новых сотрудников, петля улучшений.',
    durationMin: 50,
    checklist: [
      'Обновлены стандарты и регламенты',
      'Определен владелец поддержки изменений',
      'Запущен цикл пересмотра результатов',
    ],
    longread: [
      'Изменение становится «нормой», когда оно встроено в регулярные процессы управления: планерки, KPI, обучение, аудиты. Без этого шага любые достижения остаются временными.',
      'На этом этапе важно перейти от «проекта изменений» к «системе улучшений», где каждая команда знает, как поддерживать новый стандарт и развивать его дальше.',
    ],
    media: [
      { id: 'm5v', type: 'video', title: 'Видео: Закрепление изменений', description: 'Как не допустить откат к старому подходу.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm5a', type: 'audio', title: 'Подкаст: Культура и привычки', description: 'Как поведение людей связано с результатами.', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 'm5i', type: 'infographic', title: 'Инфографика: Цикл устойчивости', description: 'Стандарт — измерение — обратная связь — улучшение.', url: '' },
    ],
  },
];

const quizQuestions: QuizQuestion[] = [
  { id: 'bq1', question: 'В команде нет понимания, зачем нужны изменения. Первый шаг?', options: ['Запустить пилот без обсуждения', 'Создать ясное обоснование срочности', 'Отложить коммуникацию'], correctIndex: 1, explanation: 'Без понимания «зачем» команда не поддержит изменения. Первый шаг — создать ясное обоснование.' },
  { id: 'bq2', question: 'Какая комбинация дает лучшую диагностику?', options: ['Только интервью', 'Только KPI', 'Интервью + метрики процесса'], correctIndex: 2, explanation: 'Сочетание качественных и количественных данных дает объемную картину.' },
  { id: 'bq3', question: 'Что критично для коммуникации изменений?', options: ['Разовая рассылка', 'Регулярность и обратная связь', 'Только комментарии топов'], correctIndex: 1, explanation: 'Регулярная коммуникация с обратной связью снижает тревожность и повышает вовлеченность.' },
  { id: 'bq4', question: 'Как понять, что быстрая победа удалась?', options: ['Есть измеримый эффект и владелец результата', 'Красивая презентация', 'Меньше жалоб в чате'], correctIndex: 0, explanation: 'Быстрая победа должна быть измеримой и иметь ответственного за результат.' },
  { id: 'bq5', question: 'Что фиксирует изменение в культуре?', options: ['Один успешный пилот', 'Обновленные стандарты, роли и ритм контроля', 'Формальное закрытие проекта'], correctIndex: 1, explanation: 'Устойчивость обеспечивают обновленные стандарты, назначенные роли и регулярный контроль.' },
];

const TOTAL_DURATION = lessons.reduce((s, l) => s + l.durationMin, 0);

export default function CourseBasicsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { learningProgress, addLearningProgress, updateLearningProgress } = useAppStore();
  const courseMaterial = mockLearningMaterials.find((m) => m.id === id) ?? mockLearningMaterials[0];
  const courseId = courseMaterial.id;
  const courseTitle = courseMaterial.title;
  const courseSummary = courseMaterial.content;

  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Record<string, Set<number>>>({});
  const [showQuest, setShowQuest] = useState(false);
  const [questAnswers, setQuestAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [questSubmitted, setQuestSubmitted] = useState(false);

  const userId = user?.id || 'u1';
  const progressRecord = learningProgress.find(lp => lp.user_id === userId && lp.material_id === courseId);
  const overallPercent = Math.round(((completedLessons.size + (questSubmitted ? 1 : 0)) / (lessons.length + 1)) * 100);

  const isLessonUnlocked = (index: number) => index === 0 || completedLessons.has(index - 1);

  const markLessonComplete = (lessonIndex: number) => {
    setCompletedLessons(prev => new Set(prev).add(lessonIndex));
    const pct = Math.round(((completedLessons.size + 1) / (lessons.length + 1)) * 100);
    if (progressRecord) {
      updateLearningProgress(progressRecord.id, { progress_percent: pct });
    } else {
      addLearningProgress({ id: 'ulp' + Date.now(), user_id: userId, material_id: courseId, progress_percent: pct });
    }
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
    if (progressRecord) {
      updateLearningProgress(progressRecord.id, { progress_percent: 100, completed_at: new Date().toISOString() });
    } else {
      addLearningProgress({ id: 'ulp' + Date.now(), user_id: userId, material_id: courseId, progress_percent: 100, completed_at: new Date().toISOString() });
    }
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
                Ваш браузер не поддерживает аудио.
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
      {/* Header */}
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
            <Clock className="h-3 w-3 mr-1" /> ~{TOTAL_DURATION} мин
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Progress value={overallPercent} className="h-2 flex-1" />
          <span className="text-sm font-bold text-primary whitespace-nowrap">{overallPercent}%</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{completedLessons.size}/{lessons.length} занятий</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border bg-card shrink-0 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {lessons.map((lesson, i) => {
                const unlocked = isLessonUnlocked(i);
                const completed = completedLessons.has(i);
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
                      <p className="text-xs text-muted-foreground">{lesson.durationMin} мин</p>
                    </div>
                  </button>
                );
              })}

              <Separator className="my-2" />

              <button
                disabled={completedLessons.size < lessons.length}
                onClick={() => setShowQuest(true)}
                className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors text-sm flex items-center gap-3 ${
                  showQuest
                    ? 'bg-primary/10 text-primary font-medium'
                    : completedLessons.size >= lessons.length
                      ? 'hover:bg-muted text-foreground'
                      : 'text-muted-foreground opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="shrink-0">
                  {questSubmitted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : completedLessons.size < lessons.length ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Trophy className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p>Финальный квест</p>
                  {questSubmitted && <p className="text-xs text-green-600">{questScore}/{quizQuestions.length} правильных</p>}
                </div>
              </button>
            </div>
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 space-y-6">
            {!showQuest ? (
              <>
                {/* Lesson header */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">Занятие {activeLesson + 1}</Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" /> {currentLesson.durationMin} мин
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mt-2">{currentLesson.title}</h2>
                  <p className="text-muted-foreground mt-1">{currentLesson.goal}</p>
                </div>

                <Separator />

                {/* Longread */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Материал занятия</h3>
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

                {/* Media */}
                {currentLesson.media.length > 0 && (
                  <div className="space-y-4">
                    <Separator />
                    {currentLesson.media.map(renderMedia)}
                  </div>
                )}

                {/* Checklist */}
                <div className="space-y-3">
                  <Separator />
                  <h3 className="text-lg font-semibold text-foreground">Практические шаги</h3>
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

                {/* Actions */}
                <Separator />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeLesson === 0}
                    onClick={() => setActiveLesson(prev => prev - 1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Назад
                  </Button>

                  <div className="flex gap-2">
                    {!completedLessons.has(activeLesson) ? (
                      <Button size="sm" onClick={() => markLessonComplete(activeLesson)}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Завершить занятие
                      </Button>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1.5">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Пройдено
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeLesson === lessons.length - 1 || !completedLessons.has(activeLesson)}
                    onClick={() => setActiveLesson(prev => prev + 1)}
                  >
                    Далее <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </>
            ) : (
              /* Quest */
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <CardTitle>Финальный квест</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">Ответьте на вопросы, чтобы закрепить знания курса</p>
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
                      <Trophy className="h-4 w-4 mr-2" /> Отправить ответы
                    </Button>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-lg font-bold text-foreground">
                        Результат: {questScore}/{quizQuestions.length}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {questScore >= 4 ? '🎉 Отлично! Вы отлично усвоили материал.' :
                         questScore >= 3 ? '👍 Хороший результат. Повторите отдельные темы.' :
                         '📚 Рекомендуем пройти занятия ещё раз.'}
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

