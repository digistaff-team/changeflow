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
  article: FileText,
  video: Video,
  course: GraduationCap,
  guide: BookOpen,
  checklist: CheckSquare,
  instruction: BookOpen,
  document: FileText,
};

export default function LearningPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { learningProgress } = useAppStore();

  const userId = user?.id || 'u1';

  const getUserProgress = (materialId: string) => {
    return learningProgress.find((lp) => lp.user_id === userId && lp.material_id === materialId);
  };

  const completedCount = learningProgress.filter((lp) => lp.user_id === userId && lp.completed_at).length;
  const visibleMaterials = mockLearningMaterials.filter((m) => m.target_roles.includes(user?.role || 'employee'));
  const totalCount = visibleMaterials.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{'\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435'}</h1>
          <p className="text-muted-foreground">{'\u041e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b \u043f\u043e \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044e \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f\u043c\u0438'}</p>
        </div>
        <Card className="px-4 py-2">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold">{completedCount}/{totalCount}</p>
              <p className="text-xs text-muted-foreground">{'\u041f\u0440\u043e\u0439\u0434\u0435\u043d\u043e'}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleMaterials.map((material) => {
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
                    <Badge variant="outline" className="text-xs">{material.category}</Badge>
                  </div>
                </div>
                <CardTitle className="text-sm mt-2">{material.title}</CardTitle>
                <CardDescription className="text-xs">{material.content}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{material.duration_min} {'\u043c\u0438\u043d.'}</span>
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
                  onClick={() => navigate(`/learning/course/${material.id}`)}
                >
                  {'\u041e\u0442\u043a\u0440\u044b\u0442\u044c'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
