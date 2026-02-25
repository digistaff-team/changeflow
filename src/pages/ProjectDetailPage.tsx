import { useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { mockTemplates, mockTemplateSteps, mockUsers } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock, Play } from 'lucide-react';
import { t } from '@/lib/i18n';

const statusLabels: Record<string, string> = {
  planning: t('projectDetail.status.planning'),
  in_progress: t('projectDetail.status.in_progress'),
  on_hold: t('projectDetail.status.on_hold'),
  completed: t('projectDetail.status.completed'),
};

const stepStatusIcons: Record<string, React.ElementType> = {
  pending: Circle,
  in_progress: Play,
  completed: CheckCircle2,
  skipped: Clock,
};

const stepStatusColors: Record<string, string> = {
  pending: 'text-muted-foreground',
  in_progress: 'text-primary',
  completed: 'text-green-600',
  skipped: 'text-muted-foreground/50',
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, projectSteps, updateProjectStepStatus } = useAppStore();

  const project = projects.find(p => p.id === id);
  if (!project) return <div className="p-6 text-muted-foreground">{t('projectDetail.notFound')}</div>;

  const template = mockTemplates.find(tp => tp.id === project.template_id);
  const steps = projectSteps.filter(step => step.project_id === project.id);
  const templateSteps = mockTemplateSteps.filter(step => step.template_id === project.template_id);
  const owner = mockUsers.find(user => user.id === project.owner_id);

  const displaySteps = (steps.length > 0
    ? steps
    : templateSteps.map((step, index) => ({
      id: `auto-${index}`,
      project_id: project.id,
      step_number: step.step_number,
      name: step.name,
      status: 'pending' as const,
    }))).sort((a, b) => a.step_number - b.step_number);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
        <p className="text-muted-foreground">{template?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t('projectDetail.status')}</p>
            <p className="font-medium mt-1">{statusLabels[project.status]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t('projectDetail.progress')}</p>
            <div className="mt-1">
              <Progress value={project.progress_percent} className="h-2" />
              <p className="text-sm font-medium mt-1">{project.progress_percent}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{t('projectDetail.owner')}</p>
            <p className="font-medium mt-1">{owner?.full_name || t('projectDetail.ownerFallback')}</p>
          </CardContent>
        </Card>
      </div>

      {project.description && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('projectDetail.stepsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displaySteps.map(step => {
              const Icon = stepStatusIcons[step.status] || Circle;
              return (
                <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                  <Icon className={`h-5 w-5 ${stepStatusColors[step.status]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.step_number}. {step.name}</p>
                    {step.start_date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(step.start_date).toLocaleDateString('ru-RU')}
                        {step.end_date && ` - ${new Date(step.end_date).toLocaleDateString('ru-RU')}`}
                      </p>
                    )}
                  </div>
                  {step.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => updateProjectStepStatus(project.id, step.id, 'in_progress')}>
                      {t('projectDetail.toWork')}
                    </Button>
                  )}
                  {step.status === 'in_progress' && (
                    <Button size="sm" onClick={() => updateProjectStepStatus(project.id, step.id, 'completed')}>
                      {t('projectDetail.complete')}
                    </Button>
                  )}
                  <Badge variant="secondary" className="text-xs capitalize">{step.status.replace('_', ' ')}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
