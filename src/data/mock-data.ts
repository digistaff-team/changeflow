import type {
  Tenant, User, ChangeAlgorithmTemplate, TemplateStep,
  Project, ProjectStep, Feedback, LearningMaterial, UserLearningProgress
} from '@/types';

export const mockTenant: Tenant = {
  id: 't1',
  name: 'ООО «Прогресс»',
  inn: '7712345678',
  industry: 'Производство',
};

export const mockUsers: User[] = [
  { id: 'u1', tenant_id: 't1', email: 'admin@progress.ru', full_name: 'Иванов Алексей', role: 'admin', department: 'Управление' },
  { id: 'u2', tenant_id: 't1', email: 'manager@progress.ru', full_name: 'Петрова Мария', role: 'manager', department: 'Производство' },
  { id: 'u3', tenant_id: 't1', email: 'employee@progress.ru', full_name: 'Сидоров Дмитрий', role: 'employee', department: 'Логистика' },
  { id: 'u4', tenant_id: 't1', email: 'employee2@progress.ru', full_name: 'Козлова Анна', role: 'employee', department: 'HR' },
  { id: 'u5', tenant_id: 't1', email: 'manager2@progress.ru', full_name: 'Волков Сергей', role: 'manager', department: 'IT' },
];

export const mockTemplates: ChangeAlgorithmTemplate[] = [
  {
    id: 'tmpl1', name: 'Бережливое производство (Lean)',
    description: 'Внедрение принципов бережливого производства: устранение потерь, оптимизация потоков создания ценности, стандартизация процессов. Основан на методологии Toyota Production System.',
    transformation_type: 'lean', duration_weeks: 24, icon: 'Cog', color: 'hsl(142, 76%, 36%)',
  },
  {
    id: 'tmpl2', name: 'Цифровая трансформация',
    description: 'Комплексная цифровизация бизнес-процессов: внедрение ERP/CRM, автоматизация документооборота, цифровые рабочие места, аналитика данных.',
    transformation_type: 'digital', duration_weeks: 36, icon: 'Monitor', color: 'hsl(224, 76%, 48%)',
  },
  {
    id: 'tmpl3', name: 'Трансформация корпоративной культуры',
    description: 'Изменение ценностей и поведенческих моделей: от иерархической к адаптивной культуре. Развитие лидерства, вовлечённости и кросс-функционального взаимодействия.',
    transformation_type: 'culture', duration_weeks: 48, icon: 'Users', color: 'hsl(280, 67%, 51%)',
  },
  {
    id: 'tmpl4', name: 'Производственная система предприятия (ПСС)',
    description: 'Создание целостной производственной системы: стандартизация, визуальное управление, TPM, встроенное качество, непрерывное совершенствование.',
    transformation_type: 'pss', duration_weeks: 52, icon: 'Factory', color: 'hsl(38, 92%, 50%)',
  },
  {
    id: 'tmpl5', name: 'Организационная реструктуризация',
    description: 'Перестройка организационной структуры: переход к процессному управлению, оптимизация уровней управления, создание центров компетенций.',
    transformation_type: 'structure', duration_weeks: 20, icon: 'Network', color: 'hsl(0, 84%, 60%)',
  },
];

export const mockTemplateSteps: TemplateStep[] = [
  // Lean
  { id: 'ts1', template_id: 'tmpl1', step_number: 1, name: 'Диагностика текущего состояния', description: 'Картирование потоков создания ценности', duration_days: 21 },
  { id: 'ts2', template_id: 'tmpl1', step_number: 2, name: 'Определение потерь', description: 'Выявление 8 видов потерь в процессах', duration_days: 14 },
  { id: 'ts3', template_id: 'tmpl1', step_number: 3, name: 'Разработка целевого состояния', description: 'Проектирование оптимизированных процессов', duration_days: 21 },
  { id: 'ts4', template_id: 'tmpl1', step_number: 4, name: 'Пилотное внедрение', description: 'Запуск на одном участке', duration_days: 42 },
  { id: 'ts5', template_id: 'tmpl1', step_number: 5, name: 'Масштабирование и стандартизация', description: 'Тиражирование на все подразделения', duration_days: 70 },
  // Digital
  { id: 'ts6', template_id: 'tmpl2', step_number: 1, name: 'Аудит цифровой зрелости', description: 'Оценка текущего уровня цифровизации', duration_days: 14 },
  { id: 'ts7', template_id: 'tmpl2', step_number: 2, name: 'Разработка дорожной карты', description: 'Приоритизация инициатив цифровизации', duration_days: 21 },
  { id: 'ts8', template_id: 'tmpl2', step_number: 3, name: 'Выбор и настройка платформ', description: 'Подбор технологических решений', duration_days: 42 },
  { id: 'ts9', template_id: 'tmpl2', step_number: 4, name: 'Обучение и адаптация', description: 'Подготовка персонала к работе с новыми системами', duration_days: 35 },
  { id: 'ts10', template_id: 'tmpl2', step_number: 5, name: 'Полное развёртывание', description: 'Запуск систем в промышленную эксплуатацию', duration_days: 56 },
  // Culture
  { id: 'ts11', template_id: 'tmpl3', step_number: 1, name: 'Исследование текущей культуры', description: 'Опросы, интервью, анализ артефактов', duration_days: 28 },
  { id: 'ts12', template_id: 'tmpl3', step_number: 2, name: 'Формулирование целевых ценностей', description: 'Воркшопы с лидерами', duration_days: 21 },
  { id: 'ts13', template_id: 'tmpl3', step_number: 3, name: 'Программа лидерства', description: 'Развитие лидеров-агентов изменений', duration_days: 56 },
  { id: 'ts14', template_id: 'tmpl3', step_number: 4, name: 'Каскадирование изменений', description: 'Вовлечение всех уровней организации', duration_days: 84 },
  { id: 'ts15', template_id: 'tmpl3', step_number: 5, name: 'Закрепление и мониторинг', description: 'Ритуалы, признание, метрики культуры', duration_days: 70 },
  // PSS
  { id: 'ts16', template_id: 'tmpl4', step_number: 1, name: 'Формирование команды ПСС', description: 'Отбор и обучение внутренних экспертов', duration_days: 21 },
  { id: 'ts17', template_id: 'tmpl4', step_number: 2, name: 'Диагностика производства', description: 'Анализ OEE, качества, безопасности', duration_days: 28 },
  { id: 'ts18', template_id: 'tmpl4', step_number: 3, name: 'Внедрение базовых инструментов', description: '5S, визуальное управление, стандартные операции', duration_days: 56 },
  { id: 'ts19', template_id: 'tmpl4', step_number: 4, name: 'Продвинутые практики', description: 'TPM, SMED, встроенное качество', duration_days: 84 },
  { id: 'ts20', template_id: 'tmpl4', step_number: 5, name: 'Система непрерывного улучшения', description: 'Кайдзен, A3, система предложений', duration_days: 70 },
  // Structure
  { id: 'ts21', template_id: 'tmpl5', step_number: 1, name: 'Анализ текущей структуры', description: 'Аудит оргструктуры и функций', duration_days: 14 },
  { id: 'ts22', template_id: 'tmpl5', step_number: 2, name: 'Проектирование новой структуры', description: 'Моделирование вариантов', duration_days: 21 },
  { id: 'ts23', template_id: 'tmpl5', step_number: 3, name: 'План перехода', description: 'Дорожная карта трансформации', duration_days: 14 },
  { id: 'ts24', template_id: 'tmpl5', step_number: 4, name: 'Реализация изменений', description: 'Поэтапный переход', duration_days: 56 },
  { id: 'ts25', template_id: 'tmpl5', step_number: 5, name: 'Стабилизация', description: 'Адаптация и оптимизация', duration_days: 35 },
];

export const mockProjects: Project[] = [
  { id: 'p1', tenant_id: 't1', template_id: 'tmpl1', name: 'Оптимизация склада', start_date: '2025-09-01', owner_id: 'u2', status: 'in_progress', progress_percent: 45, description: 'Внедрение lean-принципов на складе готовой продукции' },
  { id: 'p2', tenant_id: 't1', template_id: 'tmpl2', name: 'Внедрение CRM', start_date: '2025-10-15', owner_id: 'u5', status: 'planning', progress_percent: 10, description: 'Цифровизация процессов продаж и работы с клиентами' },
  { id: 'p3', tenant_id: 't1', template_id: 'tmpl3', name: 'Культура безопасности', start_date: '2025-07-01', owner_id: 'u2', status: 'in_progress', progress_percent: 65, description: 'Развитие культуры безопасности на производстве' },
  { id: 'p4', tenant_id: 't1', template_id: 'tmpl4', name: 'ПСС Цех №3', start_date: '2025-06-01', owner_id: 'u2', status: 'completed', progress_percent: 100, description: 'Создание производственной системы в цехе №3' },
];

export const mockProjectSteps: ProjectStep[] = [
  { id: 'ps1', project_id: 'p1', step_number: 1, name: 'Диагностика текущего состояния', status: 'completed', start_date: '2025-09-01', end_date: '2025-09-21' },
  { id: 'ps2', project_id: 'p1', step_number: 2, name: 'Определение потерь', status: 'completed', start_date: '2025-09-22', end_date: '2025-10-05' },
  { id: 'ps3', project_id: 'p1', step_number: 3, name: 'Разработка целевого состояния', status: 'in_progress', start_date: '2025-10-06' },
  { id: 'ps4', project_id: 'p1', step_number: 4, name: 'Пилотное внедрение', status: 'pending' },
  { id: 'ps5', project_id: 'p1', step_number: 5, name: 'Масштабирование', status: 'pending' },
];

export const mockFeedback: Feedback[] = [
  { id: 'f1', tenant_id: 't1', project_id: 'p1', user_id: 'u3', feedback_type: 'suggestion', message: 'Предлагаю добавить визуальные индикаторы на складе для ускорения поиска товаров', status: 'reviewed', sentiment: 'positive', ai_tags: ['визуальное управление', '5S', 'склад'], created_at: '2025-11-15T10:30:00Z' },
  { id: 'f2', tenant_id: 't1', project_id: 'p1', user_id: 'u4', feedback_type: 'concern', message: 'Сотрудники склада обеспокоены возможным сокращением штата после оптимизации', status: 'in_progress', sentiment: 'negative', ai_tags: ['сопротивление', 'коммуникация', 'персонал'], created_at: '2025-11-16T14:20:00Z' },
  { id: 'f3', tenant_id: 't1', project_id: 'p3', user_id: 'u3', feedback_type: 'praise', message: 'Новые инструктажи по безопасности стали намного понятнее и интереснее', status: 'resolved', sentiment: 'positive', ai_tags: ['обучение', 'безопасность', 'обратная связь'], created_at: '2025-11-17T09:15:00Z' },
  { id: 'f4', tenant_id: 't1', project_id: 'p2', user_id: 'u5', feedback_type: 'question', message: 'Когда начнётся обучение работе в новой CRM-системе?', status: 'new', sentiment: 'neutral', ai_tags: ['обучение', 'CRM', 'планирование'], created_at: '2025-11-18T11:00:00Z' },
  { id: 'f5', tenant_id: 't1', project_id: 'p1', user_id: 'u4', feedback_type: 'suggestion', message: 'Можно использовать цветовую маркировку зон хранения по типу товаров', status: 'new', sentiment: 'positive', ai_tags: ['визуальное управление', 'маркировка', 'организация'], created_at: '2025-11-19T16:45:00Z' },
];

export const mockLearningMaterials: LearningMaterial[] = [
  { id: 'lm1', title: 'Основы управления изменениями', content_type: 'course', target_roles: ['admin', 'manager', 'employee'], content: 'Курс охватывает модели Коттера, ADKAR и Левина. Практические кейсы внедрения изменений на российских предприятиях.', duration_min: 120, category: 'Основы' },
  { id: 'lm2', title: '8 шагов Коттера для трансформации', content_type: 'article', target_roles: ['admin', 'manager'], content: 'Детальный разбор 8 шагов Джона Коттера с примерами из практики.', duration_min: 30, category: 'Методологии' },
  { id: 'lm3', title: 'Преодоление сопротивления изменениям', content_type: 'guide', target_roles: ['manager'], content: 'Практическое руководство по работе с сопротивлением: диагностика, стратегии, коммуникация.', duration_min: 45, category: 'Коммуникация' },
  { id: 'lm4', title: 'Картирование потока создания ценности (VSM)', content_type: 'video', target_roles: ['manager', 'employee'], content: 'Видеоурок по составлению карт потоков создания ценности.', duration_min: 60, category: 'Lean' },
  { id: 'lm5', title: 'Цифровая трансформация: с чего начать', content_type: 'course', target_roles: ['admin', 'manager'], content: 'Пошаговое руководство по запуску цифровой трансформации предприятия.', duration_min: 90, category: 'Цифровизация' },
  { id: 'lm6', title: 'Чек-лист запуска проекта изменений', content_type: 'checklist', target_roles: ['manager'], content: '25 пунктов для проверки готовности к запуску проекта трансформации.', duration_min: 15, category: 'Инструменты' },
  { id: 'lm7', title: 'Лидерство в период изменений', content_type: 'article', target_roles: ['admin', 'manager'], content: 'Роль лидера в трансформации: от спонсора до агента изменений.', duration_min: 25, category: 'Лидерство' },
  { id: 'lm8', title: 'Метрики эффективности изменений', content_type: 'guide', target_roles: ['admin', 'manager'], content: 'KPI для оценки эффективности программ трансформации: adoption rate, time-to-value, ROI.', duration_min: 35, category: 'Аналитика' },
  { id: 'lm9', title: 'Производственная система: основы TPS', content_type: 'video', target_roles: ['manager', 'employee'], content: 'Введение в Toyota Production System: история, принципы, инструменты.', duration_min: 75, category: 'Lean' },
  { id: 'lm10', title: 'Коммуникация изменений: шаблоны и скрипты', content_type: 'guide', target_roles: ['manager', 'employee'], content: 'Готовые шаблоны писем, презентаций и скриптов для коммуникации изменений.', duration_min: 20, category: 'Коммуникация' },
];

export const mockLearningProgress: UserLearningProgress[] = [
  { id: 'ulp1', user_id: 'u1', material_id: 'lm1', completed_at: '2025-10-01T12:00:00Z', progress_percent: 100 },
  { id: 'ulp2', user_id: 'u1', material_id: 'lm2', completed_at: '2025-10-05T15:00:00Z', progress_percent: 100 },
  { id: 'ulp3', user_id: 'u2', material_id: 'lm1', progress_percent: 60 },
  { id: 'ulp4', user_id: 'u2', material_id: 'lm4', completed_at: '2025-10-10T09:00:00Z', progress_percent: 100 },
  { id: 'ulp5', user_id: 'u3', material_id: 'lm1', progress_percent: 30 },
];
