import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockTemplates } from '@/data/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderKanban, MessageSquare, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { t } from '@/lib/i18n';

const statusLabels: Record<string, string> = {
  planning: t('dashboard.status.planning'),
  in_progress: t('dashboard.status.in_progress'),
  on_hold: t('dashboard.status.on_hold'),
  completed: t('dashboard.status.completed'),
  cancelled: t('dashboard.status.cancelled'),
};

const statusColors: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
  on_hold: 'bg-gray-100 text-gray-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { projects, feedback } = useAppStore();

  const activeProjects = projects.filter(p => p.status === 'in_progress');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const sentimentData = [
    { name: t('dashboard.sentiment.positive'), value: feedback.filter(f => f.sentiment === 'positive').length, color: 'hsl(142, 76%, 36%)' },
    { name: t('dashboard.sentiment.neutral'), value: feedback.filter(f => f.sentiment === 'neutral').length, color: 'hsl(38, 92%, 50%)' },
    { name: t('dashboard.sentiment.negative'), value: feedback.filter(f => f.sentiment === 'negative').length, color: 'hsl(0, 84%, 60%)' },
  ];

  const projectProgressData = projects.map(p => ({
    name: p.name.length > 15 ? `${p.name.slice(0, 15)}...` : p.name,
    progress: p.progress_percent,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('dashboard.welcome', { name: user?.full_name?.split(' ')[0] || '' })}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.totalProjects')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProjects.length}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.active')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedProjects.length}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.completed')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{feedback.length}</p>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.feedback')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dashboard.charts.projectProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(215, 16%, 47%)' }} />
                <YAxis tick={{ fill: 'hsl(215, 16%, 47%)' }} />
                <Tooltip />
                <Bar dataKey="progress" fill="hsl(224, 76%, 48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('dashboard.charts.sentiment')}</CardTitle>
            <CardDescription>{t('dashboard.charts.sentimentDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sentimentData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {sentimentData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('dashboard.recentProjects')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map(project => {
              const template = mockTemplates.find(tp => tp.id === project.template_id);
              return (
                <div key={project.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-primary-foreground text-xs font-bold" style={{ backgroundColor: template?.color }}>
                    {project.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{template?.name}</p>
                  </div>
                  <div className="w-32">
                    <Progress value={project.progress_percent} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{project.progress_percent}%</p>
                  </div>
                  <Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
