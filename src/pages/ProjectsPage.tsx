import { useAppStore } from '@/stores/app-store';
import { mockTemplates } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const statusLabels: Record<string, string> = {
  planning: 'Планирование', in_progress: 'В работе', on_hold: 'На паузе', completed: 'Завершён', cancelled: 'Отменён',
};
const statusColors: Record<string, string> = {
  planning: 'bg-blue-100 text-blue-800', in_progress: 'bg-amber-100 text-amber-800', on_hold: 'bg-gray-100 text-gray-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
};

export default function ProjectsPage() {
  const { projects } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Проекты</h1>
          <p className="text-muted-foreground">Управление программами изменений</p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="h-4 w-4 mr-2" /> Новый проект
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => {
          const template = mockTemplates.find(t => t.id === project.template_id);
          return (
            <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/projects/${project.id}`)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{template?.name}</p>
              </CardHeader>
              <CardContent>
                {project.description && <p className="text-sm text-muted-foreground mb-3">{project.description}</p>}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Прогресс</span>
                    <span>{project.progress_percent}%</span>
                  </div>
                  <Progress value={project.progress_percent} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Начало: {new Date(project.start_date).toLocaleDateString('ru-RU')}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
