import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockUsers } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FeedbackType, Sentiment } from '@/types';
import { MessageSquare, ThumbsUp, AlertCircle, HelpCircle, Award, Send } from 'lucide-react';

const feedbackTypeLabels: Record<string, string> = { suggestion: 'Предложение', concern: 'Опасение', question: 'Вопрос', praise: 'Похвала' };
const feedbackTypeIcons: Record<string, React.ElementType> = { suggestion: ThumbsUp, concern: AlertCircle, question: HelpCircle, praise: Award };
const sentimentLabels: Record<string, string> = { positive: 'Позитивный', neutral: 'Нейтральный', negative: 'Негативный' };
const sentimentColors: Record<string, string> = { positive: 'bg-green-100 text-green-800', neutral: 'bg-yellow-100 text-yellow-800', negative: 'bg-red-100 text-red-800' };
const statusLabels: Record<string, string> = { new: 'Новый', reviewed: 'Рассмотрен', in_progress: 'В работе', resolved: 'Решён' };

export default function FeedbackPage() {
  const { user } = useAuthStore();
  const { feedback, projects, addFeedback } = useAppStore();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FeedbackType>('suggestion');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !projectId) return;

    const sentiments: Sentiment[] = ['positive', 'neutral', 'negative'];
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    addFeedback({
      id: 'f' + Date.now(),
      tenant_id: user?.tenant_id || 't1',
      project_id: projectId,
      user_id: user?.id || 'u1',
      feedback_type: type,
      message: message.trim(),
      status: 'new',
      sentiment: randomSentiment,
      ai_tags: ['авто-тег'],
      created_at: new Date().toISOString(),
    });
    setMessage('');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Обратная связь</h1>
        <p className="text-muted-foreground">Делитесь мнением о проектах изменений</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit form */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Новый отзыв</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue placeholder="Выберите проект" /></SelectTrigger>
                <SelectContent>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={v => setType(v as FeedbackType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(feedbackTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ваш отзыв..." rows={4} />
              <Button type="submit" className="w-full" disabled={!message.trim() || !projectId}>
                <Send className="h-4 w-4 mr-2" /> Отправить
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Feedback list */}
        <div className="lg:col-span-2 space-y-3">
          {feedback.map(fb => {
            const Icon = feedbackTypeIcons[fb.feedback_type] || MessageSquare;
            const author = mockUsers.find(u => u.id === fb.user_id);
            const project = projects.find(p => p.id === fb.project_id);
            return (
              <Card key={fb.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{author?.full_name}</span>
                        <Badge variant="secondary" className="text-xs">{feedbackTypeLabels[fb.feedback_type]}</Badge>
                        <Badge className={`text-xs ${sentimentColors[fb.sentiment]}`}>{sentimentLabels[fb.sentiment]}</Badge>
                        <Badge variant="outline" className="text-xs">{statusLabels[fb.status]}</Badge>
                      </div>
                      <p className="text-sm mt-2">{fb.message}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {fb.ai_tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {project?.name} • {new Date(fb.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
