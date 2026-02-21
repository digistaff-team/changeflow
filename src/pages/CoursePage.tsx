import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Play, Headphones,
  BarChart3, Trophy, BookOpen, Clock, ChevronDown, ChevronUp,
} from 'lucide-react';

const COURSE_ID = 'lm3'; // "Преодоление сопротивления изменениям"

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  sections: Section[];
}

interface Section {
  type: 'text' | 'video' | 'audio' | 'infographic' | 'quote' | 'tip' | 'list';
  title?: string;
  content?: string;
  items?: string[];
  src?: string;
  author?: string;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Природа сопротивления',
    subtitle: 'Почему люди сопротивляются изменениям и как это распознать',
    duration: '25 мин',
    sections: [
      { type: 'text', title: 'Введение', content: 'Сопротивление изменениям — естественная реакция человека на неопределённость. Согласно исследованиям, до 70% программ организационных изменений терпят неудачу именно из-за сопротивления сотрудников. Понимание природы этого явления — первый шаг к его преодолению.' },
      { type: 'video', title: 'Видео: Психология сопротивления', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { type: 'infographic', title: 'Инфографика: 5 стадий принятия изменений', content: 'denial:Отрицание — «Это нас не коснётся»;anger:Гнев — «Почему именно сейчас?»;bargaining:Торг — «А можно частично?»;depression:Апатия — «Ничего не получится»;acceptance:Принятие — «Давайте попробуем»' },
      { type: 'text', title: 'Виды сопротивления', content: 'Различают активное сопротивление (открытый саботаж, жалобы) и пассивное (затягивание, игнорирование). Менеджеру важно диагностировать оба вида на ранней стадии. Модель ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement) описывает барьеры, которые стоят перед каждым сотрудником в процессе принятия изменений.' },
      { type: 'audio', title: 'Подкаст: Интервью с экспертом по управлению изменениями', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { type: 'quote', content: 'Люди не сопротивляются изменениям — они сопротивляются тому, что их меняют.', author: 'Питер Сенге' },
      { type: 'list', title: 'Ключевые выводы занятия', items: [
        'Сопротивление — нормальная реакция, а не враг',
        'Важно различать активное и пассивное сопротивление',
        'Модель ADKAR помогает диагностировать барьеры',
        'Ранняя диагностика снижает риски провала проекта',
      ]},
    ],
  },
  {
    id: 2,
    title: 'Диагностика и анализ',
    subtitle: 'Инструменты выявления причин и масштабов сопротивления',
    duration: '30 мин',
    sections: [
      { type: 'text', title: 'Методы диагностики', content: 'Для эффективной работы с сопротивлением необходимо провести комплексную диагностику. Ключевые инструменты включают: анкетирование сотрудников, глубинные интервью, анализ поведенческих индикаторов (посещаемость, производительность), фокус-группы. Важно использовать как количественные, так и качественные методы.' },
      { type: 'video', title: 'Видео: Как проводить диагностику сопротивления', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { type: 'infographic', title: 'Инфографика: Карта стейкхолдеров', content: 'champions:Чемпионы — активные сторонники (15-20%);supporters:Сторонники — готовы поддержать при условиях (25-30%);neutral:Нейтральные — ждут результатов (25-30%);resistors:Сопротивляющиеся — открыто против (10-15%);saboteurs:Саботажники — скрытое противодействие (5-10%)' },
      { type: 'text', title: 'Анализ силового поля Левина', content: 'Метод Курта Левина предлагает визуализировать движущие и сдерживающие силы. Составьте две колонки: что толкает организацию к изменениям (конкуренция, технологии, запросы клиентов) и что сдерживает (страх, привычки, недоверие). Цель — усилить движущие и ослабить сдерживающие силы.' },
      { type: 'audio', title: 'Подкаст: Кейс диагностики на промышленном предприятии', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { type: 'tip', title: 'Совет практика', content: 'Проводите диагностику не как разовую акцию, а как регулярный мониторинг. Еженедельные пульс-опросы из 3-5 вопросов дают оперативную картину настроений.' },
      { type: 'list', title: 'Ключевые выводы', items: [
        'Используйте множественные каналы диагностики',
        'Карта стейкхолдеров помогает определить приоритеты',
        'Анализ силового поля визуализирует баланс сил',
        'Регулярный мониторинг лучше разовых замеров',
      ]},
    ],
  },
  {
    id: 3,
    title: 'Стратегии преодоления',
    subtitle: 'Проверенные подходы к работе с разными типами сопротивления',
    duration: '35 мин',
    sections: [
      { type: 'text', title: '6 стратегий Коттера и Шлезингера', content: 'Классическая модель предлагает 6 стратегий в зависимости от ситуации: (1) Обучение и коммуникация — при недостатке информации. (2) Участие и вовлечение — когда у сотрудников есть экспертиза. (3) Поддержка и содействие — при страхе и тревожности. (4) Переговоры и соглашения — когда есть что предложить. (5) Манипуляция и кооптация — в крайних случаях. (6) Принуждение — когда время критично.' },
      { type: 'video', title: 'Видео: Практика вовлечения сотрудников', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { type: 'infographic', title: 'Инфографика: Матрица выбора стратегии', content: 'low_low:Низкое сопротивление + Много времени → Обучение;low_high:Низкое сопротивление + Мало времени → Участие;high_low:Высокое сопротивление + Много времени → Переговоры;high_high:Высокое сопротивление + Мало времени → Принуждение' },
      { type: 'text', title: 'Коммуникационный план', content: 'Эффективная коммуникация — основа любой стратегии. Правило 7×7: сообщение должно быть донесено 7 раз через 7 разных каналов. Используйте каскадное информирование: от топ-менеджмента через линейных руководителей к рядовым сотрудникам. Каждый уровень адаптирует послание под свою аудиторию.' },
      { type: 'audio', title: 'Подкаст: Искусство трудных разговоров', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { type: 'quote', content: 'Самый мощный инструмент изменений — не стратегия, а разговор.', author: 'Дэниел Ким' },
      { type: 'list', title: 'Ключевые выводы', items: [
        'Выбирайте стратегию в зависимости от контекста',
        'Правило 7×7 для эффективной коммуникации',
        'Каскадное информирование усиливает сообщение',
        'Комбинируйте несколько стратегий одновременно',
      ]},
    ],
  },
  {
    id: 4,
    title: 'Роль лидера и команды',
    subtitle: 'Как лидеры могут стать катализаторами изменений',
    duration: '30 мин',
    sections: [
      { type: 'text', title: 'Лидер как агент изменений', content: 'Исследования показывают, что 93% успешных трансформаций имели сильного лидера-спонсора. Лидер изменений должен: формулировать вдохновляющее видение, демонстрировать личный пример, создавать коалицию поддержки, убирать барьеры, праздновать быстрые победы.' },
      { type: 'video', title: 'Видео: Лидерские компетенции в трансформации', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { type: 'infographic', title: 'Инфографика: Команда изменений', content: 'sponsor:Спонсор — обеспечивает ресурсы и полномочия;lead:Лидер проекта — координирует и управляет;agents:Агенты изменений — продвигают на местах;coaches:Коучи — поддерживают эмоционально;analysts:Аналитики — отслеживают прогресс' },
      { type: 'text', title: 'Эмоциональный интеллект лидера', content: 'Управление изменениями — это прежде всего управление эмоциями людей. Лидер должен уметь: распознавать скрытые страхи, проявлять эмпатию без потери курса, управлять собственным стрессом, создавать психологическую безопасность для команды. Инструмент «Лестница вывода» Криса Аргириса помогает избежать ошибочных предположений о мотивах других.' },
      { type: 'audio', title: 'Подкаст: Истории лидеров трансформаций', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { type: 'tip', title: 'Совет практика', content: 'Создайте сеть «агентов изменений» — по 1-2 человека в каждом подразделении. Это неформальные лидеры, которые станут вашими глазами и ушами, а также проводниками изменений на местах.' },
      { type: 'list', title: 'Ключевые выводы', items: [
        'Сильный спонсор — главный фактор успеха',
        'Формируйте кросс-функциональную команду изменений',
        'Эмоциональный интеллект важнее технических навыков',
        'Сеть агентов изменений масштабирует влияние',
      ]},
    ],
  },
  {
    id: 5,
    title: 'Закрепление результатов',
    subtitle: 'Как сделать изменения необратимыми и устойчивыми',
    duration: '35 мин',
    sections: [
      { type: 'text', title: 'Институционализация изменений', content: 'По Коттеру, 8-й шаг — «закрепление в корпоративной культуре» — самый часто игнорируемый. Без него до 80% изменений откатываются в течение 2 лет. Институционализация включает: обновление политик и процедур, изменение системы мотивации, пересмотр KPI, включение новых практик в онбординг.' },
      { type: 'video', title: 'Видео: Создание устойчивых изменений', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { type: 'infographic', title: 'Инфографика: Цикл закрепления', content: 'standardize:Стандартизация — документирование новых процессов;measure:Измерение — мониторинг KPI и отклонений;recognize:Признание — поощрение за следование новым практикам;improve:Улучшение — непрерывное совершенствование (кайдзен);share:Распространение — тиражирование успешного опыта' },
      { type: 'text', title: 'Управление рецидивами', content: 'Откат к старым привычкам неизбежен. Подготовьтесь к нему заранее: определите «триггеры отката», создайте систему раннего предупреждения, разработайте план быстрого реагирования. Регулярные ретроспективы (каждые 2-4 недели) помогают своевременно выявлять проблемы.' },
      { type: 'audio', title: 'Подкаст: Как не потерять достигнутое', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { type: 'quote', content: 'Культура ест стратегию на завтрак.', author: 'Питер Друкер' },
      { type: 'list', title: 'Ключевые выводы', items: [
        'Закрепление — самый критичный и игнорируемый этап',
        'Обновите системы мотивации и KPI',
        'Подготовьтесь к рецидивам заранее',
        'Регулярные ретроспективы — ваш главный инструмент',
      ]},
    ],
  },
];

// Quest data
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  { question: 'Какой процент программ изменений терпит неудачу из-за сопротивления сотрудников?', options: ['30%', '50%', '70%', '90%'], correct: 2, explanation: 'Исследования показывают, что до 70% программ организационных изменений терпят неудачу.' },
  { question: 'Какая модель описывает 5 барьеров принятия изменений?', options: ['Модель Левина', 'ADKAR', '8 шагов Коттера', 'Модель Бриджеса'], correct: 1, explanation: 'ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement) описывает последовательные барьеры.' },
  { question: 'Что означает правило 7×7 в коммуникации изменений?', options: ['7 встреч по 7 минут', '7 сообщений через 7 каналов', '7 дней по 7 часов', '7 команд по 7 человек'], correct: 1, explanation: 'Сообщение должно быть донесено 7 раз через 7 разных каналов для усвоения.' },
  { question: 'Какой фактор является главным предиктором успеха трансформации?', options: ['Бюджет проекта', 'Технология', 'Сильный спонсор-лидер', 'Внешние консультанты'], correct: 2, explanation: '93% успешных трансформаций имели сильного лидера-спонсора.' },
  { question: 'По Коттеру, какой шаг чаще всего игнорируется?', options: ['Создание видения', 'Формирование коалиции', 'Быстрые победы', 'Закрепление в культуре'], correct: 3, explanation: '8-й шаг — закрепление в корпоративной культуре — самый часто игнорируемый.' },
  { question: 'Какой инструмент помогает визуализировать движущие и сдерживающие силы?', options: ['SWOT-анализ', 'Анализ силового поля Левина', 'Матрица Эйзенхауэра', 'Диаграмма Ганта'], correct: 1, explanation: 'Метод Курта Левина визуализирует баланс движущих и сдерживающих сил.' },
  { question: 'Что такое «агенты изменений»?', options: ['Внешние консультанты', 'Неформальные лидеры в подразделениях', 'Топ-менеджеры', 'HR-специалисты'], correct: 1, explanation: 'Агенты изменений — 1-2 человека в каждом подразделении, продвигающие изменения на местах.' },
  { question: 'Без закрепления, какой процент изменений откатывается в течение 2 лет?', options: ['30%', '50%', '65%', '80%'], correct: 3, explanation: 'Без институционализации до 80% изменений откатываются в течение 2 лет.' },
];

export default function CoursePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { learningProgress, addLearningProgress, updateLearningProgress } = useAppStore();
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [showQuest, setShowQuest] = useState(false);
  const [questAnswers, setQuestAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [questSubmitted, setQuestSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const progressRecord = learningProgress.find(lp => lp.user_id === user?.id && lp.material_id === COURSE_ID);
  const overallPercent = Math.round(((completedLessons.size + (questSubmitted ? 1 : 0)) / (lessons.length + 1)) * 100);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const markLessonComplete = (lessonId: number) => {
    setCompletedLessons(prev => new Set(prev).add(lessonId));
    const pct = Math.round(((completedLessons.size + 1) / (lessons.length + 1)) * 100);
    if (progressRecord) {
      updateLearningProgress(progressRecord.id, { progress_percent: pct });
    } else {
      addLearningProgress({ id: 'ulp' + Date.now(), user_id: user?.id || 'u1', material_id: COURSE_ID, progress_percent: pct });
    }
  };

  const handleQuestSubmit = () => {
    setQuestSubmitted(true);
    const pct = 100;
    if (progressRecord) {
      updateLearningProgress(progressRecord.id, { progress_percent: pct, completed_at: new Date().toISOString() });
    } else {
      addLearningProgress({ id: 'ulp' + Date.now(), user_id: user?.id || 'u1', material_id: COURSE_ID, progress_percent: pct, completed_at: new Date().toISOString() });
    }
  };

  const questScore = questAnswers.reduce<number>((acc, a, i) => acc + (a === quizQuestions[i].correct ? 1 : 0), 0);

  const renderSection = (section: Section, idx: number) => {
    const key = `${activeLesson}-${idx}`;
    switch (section.type) {
      case 'text':
        return (
          <div key={key} className="space-y-2">
            {section.title && <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>}
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
          </div>
        );
      case 'video':
        return (
          <div key={key} className="space-y-2">
            {section.title && (
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              </div>
            )}
            <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
              <iframe src={section.src} className="w-full h-full" allowFullScreen title={section.title} />
            </div>
          </div>
        );
      case 'audio':
        return (
          <div key={key} className="space-y-2">
            {section.title && (
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              </div>
            )}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <audio controls className="w-full" src={section.src}>
                Ваш браузер не поддерживает аудио.
              </audio>
            </div>
          </div>
        );
      case 'infographic': {
        const items = section.content?.split(';').map(item => {
          const [, label] = item.split(':');
          return label;
        }) || [];
        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item, i) => {
                const [title, desc] = item.split(' — ');
                return (
                  <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-1 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                      <span className="font-medium text-foreground text-sm">{title}</span>
                    </div>
                    {desc && <p className="text-xs text-muted-foreground pl-10">{desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
      case 'quote':
        return (
          <blockquote key={key} className="border-l-4 border-primary pl-4 py-2 my-2 bg-primary/5 rounded-r-lg">
            <p className="italic text-foreground">«{section.content}»</p>
            {section.author && <p className="text-sm text-muted-foreground mt-1">— {section.author}</p>}
          </blockquote>
        );
      case 'tip':
        return (
          <div key={key} className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-1">
            <h4 className="font-semibold text-primary text-sm">💡 {section.title}</h4>
            <p className="text-sm text-foreground">{section.content}</p>
          </div>
        );
      case 'list':
        return (
          <div key={key} className="space-y-2">
            {section.title && <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>}
            <ul className="space-y-1.5">
              {section.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/learning')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Преодоление сопротивления изменениям</h1>
          <p className="text-muted-foreground text-sm">Курс из 5 занятий + финальный квест</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          <Clock className="h-3 w-3 mr-1" /> ~155 мин
        </Badge>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Прогресс курса</span>
            <span className="text-sm font-bold text-primary">{overallPercent}%</span>
          </div>
          <Progress value={overallPercent} className="h-2" />
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>{completedLessons.size} из {lessons.length} занятий</span>
            {questSubmitted && <span className="text-primary font-medium">Квест пройден ({questScore}/{quizQuestions.length})</span>}
          </div>
        </CardContent>
      </Card>

      {/* Navigation tabs */}
      <div className="flex gap-2 flex-wrap">
        {lessons.map((lesson, i) => {
          const isLocked = i > 0 && !completedLessons.has(lessons[i - 1].id);
          return (
            <Button
              key={lesson.id}
              variant={activeLesson === i && !showQuest ? 'default' : 'outline'}
              size="sm"
              className="relative"
              disabled={isLocked}
              onClick={() => { setActiveLesson(i); setShowQuest(false); }}
            >
              {completedLessons.has(lesson.id) && (
                <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
              )}
              {isLocked && '🔒 '}
              Занятие {lesson.id}
            </Button>
          );
        })}
        <Button
          variant={showQuest ? 'default' : 'outline'}
          size="sm"
          disabled={completedLessons.size < lessons.length}
          onClick={() => setShowQuest(true)}
        >
          <Trophy className="h-3 w-3 mr-1" />
          {completedLessons.size < lessons.length ? '🔒 ' : ''}Квест
        </Button>
      </div>

      {/* Content */}
      {!showQuest ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">Занятие {lessons[activeLesson].id}</Badge>
                <CardTitle className="text-xl">{lessons[activeLesson].title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{lessons[activeLesson].subtitle}</p>
              </div>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" /> {lessons[activeLesson].duration}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {lessons[activeLesson].sections.map((section, idx) => renderSection(section, idx))}

            <Separator />

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={activeLesson === 0}
                onClick={() => setActiveLesson(prev => prev - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Предыдущее
              </Button>

              <div className="flex gap-2">
                {!completedLessons.has(lessons[activeLesson].id) && (
                  <Button size="sm" onClick={() => markLessonComplete(lessons[activeLesson].id)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Завершить занятие
                  </Button>
                )}
                {completedLessons.has(lessons[activeLesson].id) && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Пройдено
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={activeLesson === lessons.length - 1 || !completedLessons.has(lessons[activeLesson].id)}
                onClick={() => setActiveLesson(prev => prev + 1)}
              >
                Следующее <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
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
                    const isCorrect = questSubmitted && oi === q.correct;
                    const isWrong = questSubmitted && selected && oi !== q.correct;
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
                  <p className={`text-xs ${questAnswers[qi] === q.correct ? 'text-green-600' : 'text-destructive'}`}>
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
                  {questScore >= 6 ? '🎉 Отлично! Вы отлично усвоили материал.' :
                   questScore >= 4 ? '👍 Хороший результат. Повторите отдельные темы.' :
                   '📚 Рекомендуем пройти занятия ещё раз.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
