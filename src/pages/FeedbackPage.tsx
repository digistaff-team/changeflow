import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockUsers } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FeedbackType, Sentiment } from '@/types';
import { MessageSquare, ThumbsUp, AlertCircle, HelpCircle, Award, Send } from 'lucide-react';
import { t, tm } from '@/lib/i18n';

const feedbackTypeLabels: Record<string, string> = {
  suggestion: t('feedback.type.suggestion'),
  concern: t('feedback.type.concern'),
  question: t('feedback.type.question'),
  praise: t('feedback.type.praise'),
};

const feedbackTypeIcons: Record<string, React.ElementType> = {
  suggestion: ThumbsUp,
  concern: AlertCircle,
  question: HelpCircle,
  praise: Award,
};

const sentimentLabels: Record<string, string> = {
  positive: t('feedback.sentiment.positive'),
  neutral: t('feedback.sentiment.neutral'),
  negative: t('feedback.sentiment.negative'),
};

const sentimentColors: Record<string, string> = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-yellow-100 text-yellow-800',
  negative: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  new: t('feedback.status.new'),
  reviewed: t('feedback.status.reviewed'),
  in_progress: t('feedback.status.in_progress'),
  resolved: t('feedback.status.resolved'),
};

const analysisLabels: Record<string, string> = {
  pending: t('feedback.analysis.pending'),
  completed: t('feedback.analysis.completed'),
  analysis_failed: t('feedback.analysis.analysis_failed'),
};

const analysisColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  analysis_failed: 'bg-slate-100 text-slate-700',
};

const NEGATIVE_HINTS = tm<string[]>('feedback.hints.negative');
const POSITIVE_HINTS = tm<string[]>('feedback.hints.positive');

async function analyzeFeedback(message: string): Promise<{ sentiment: Sentiment; score: number; tags: string[] }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  if (Math.random() < 0.2) throw new Error('AI analysis unavailable');

  const lower = message.toLowerCase();
  const hasNegative = NEGATIVE_HINTS.some(hint => lower.includes(hint));
  const hasPositive = POSITIVE_HINTS.some(hint => lower.includes(hint));

  if (hasNegative) {
    return { sentiment: 'negative', score: 0.82, tags: tm<string[]>('feedback.tags.negative') };
  }
  if (hasPositive) {
    return { sentiment: 'positive', score: 0.76, tags: tm<string[]>('feedback.tags.positive') };
  }

  return { sentiment: 'neutral', score: 0.53, tags: tm<string[]>('feedback.tags.neutral') };
}

export default function FeedbackPage() {
  const { user } = useAuthStore();
  const { feedback, projects, addFeedback, updateFeedback } = useAppStore();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FeedbackType>('suggestion');
  const [projectId, setProjectId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !projectId || isSubmitting) return;

    setIsSubmitting(true);
    const feedbackId = `f${Date.now()}`;

    addFeedback({
      id: feedbackId,
      tenant_id: user?.tenant_id || 't1',
      project_id: projectId,
      user_id: user?.id || 'u1',
      feedback_type: type,
      message: message.trim(),
      status: 'new',
      sentiment: 'neutral',
      sentiment_score: 0,
      ai_tags: [],
      analysis_status: 'pending',
      created_at: new Date().toISOString(),
    });

    try {
      const result = await analyzeFeedback(message.trim());
      updateFeedback(feedbackId, {
        sentiment: result.sentiment,
        sentiment_score: result.score,
        ai_tags: result.tags,
        analysis_status: 'completed',
      });
    } catch {
      updateFeedback(feedbackId, {
        sentiment: 'neutral',
        sentiment_score: 0,
        ai_tags: [],
        analysis_status: 'analysis_failed',
      });
    }

    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('feedback.title')}</h1>
        <p className="text-muted-foreground">{t('feedback.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">{t('feedback.new')}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger><SelectValue placeholder={t('feedback.projectPlaceholder')} /></SelectTrigger>
                <SelectContent>
                  {projects.map(project => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={type} onValueChange={value => setType(value as FeedbackType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(feedbackTypeLabels).map(([key, value]) => <SelectItem key={key} value={key}>{value}</SelectItem>)}
                </SelectContent>
              </Select>

              <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t('feedback.messagePlaceholder')} rows={4} />

              <Button type="submit" className="w-full" disabled={!message.trim() || !projectId || isSubmitting}>
                <Send className="h-4 w-4 mr-2" /> {t('feedback.send')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-3">
          {feedback.map(fb => {
            const Icon = feedbackTypeIcons[fb.feedback_type] || MessageSquare;
            const author = mockUsers.find(userItem => userItem.id === fb.user_id);
            const project = projects.find(projectItem => projectItem.id === fb.project_id);

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
                        <Badge className={`text-xs ${analysisColors[fb.analysis_status]}`}>{analysisLabels[fb.analysis_status]}</Badge>
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
