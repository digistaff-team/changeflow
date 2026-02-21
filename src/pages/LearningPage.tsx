import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockLearningMaterials } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Video, FileText, CheckSquare, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = {
  article: FileText, video: Video, course: GraduationCap, guide: BookOpen, checklist: CheckSquare,
};
const typeLabels: Record<string, string> = {
  article: 'Статья', video: 'Видео', course: 'Курс', guide: 'Руководство', checklist: 'Чек-лист',
};

export default function LearningPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { learningProgress, addLearningProgress, updateLearningProgress } = useAppStore();

  const getUserProgress = (materialId: string) => {
    return learningProgress.find(lp => lp.user_id === user?.id && lp.material_id === materialId);
  };

  const handleStart = (materialId: string) => {
    const existing = getUserProgress(materialId);
    if (!existing) {
      addLearningProgress({
        id: 'ulp' + Date.now(),
        user_id: user?.id || 'u1',
        material_id: materialId,
        progress_percent: 10,
      });
    }
  };

  const handleComplete = (materialId: string) => {
    const existing = getUserProgress(materialId);
    if (existing) {
      updateLearningProgress(existing.id, { progress_percent: 100, completed_at: new Date().toISOString() });
    } else {
      addLearningProgress({
        id: 'ulp' + Date.now(),
        user_id: user?.id || 'u1',
        material_id: materialId,
        progress_percent: 100,
        completed_at: new Date().toISOString(),
      });
    }
  };

  const completedCount = learningProgress.filter(lp => lp.user_id === user?.id && lp.completed_at).length;
  const totalCount = mockLearningMaterials.filter(m => m.target_roles.includes(user?.role || 'employee')).length;

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
        {mockLearningMaterials.map(material => {
          const Icon = typeIcons[material.content_type] || BookOpen;
          const progress = getUserProgress(material.id);
          const isCompleted = !!progress?.completed_at;

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
                    <Badge variant="secondary" className="text-xs">{typeLabels[material.content_type]}</Badge>
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
                {progress && (
                  <div className="space-y-1">
                    <Progress value={progress.progress_percent} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">{progress.progress_percent}%</p>
                  </div>
                )}
                <Button size="sm" variant="outline" className="w-full" onClick={() => {
                    handleStart(material.id);
                    if (material.content_type === 'guide' || material.content_type === 'course') {
                      navigate(`/learning/course/${material.id}`);
                    }
                  }}>Открыть</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
