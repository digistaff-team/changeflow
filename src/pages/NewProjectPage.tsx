import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { mockTemplates, mockTemplateSteps } from '@/data/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { t } from '@/lib/i18n';

export default function NewProjectPage() {
  const [searchParams] = useSearchParams();
  const preselectedTemplate = searchParams.get('template') || '';
  const [templateId, setTemplateId] = useState(preselectedTemplate);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const { user } = useAuthStore();
  const { addProject } = useAppStore();
  const navigate = useNavigate();

  const selectedTemplate = mockTemplates.find(tp => tp.id === templateId);
  const steps = mockTemplateSteps.filter(step => step.template_id === templateId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateId || !name) return;

    addProject({
      id: `p${Date.now()}`,
      tenant_id: user?.tenant_id || 't1',
      template_id: templateId,
      name,
      description,
      start_date: startDate,
      owner_id: user?.id || 'u1',
      status: 'planning',
      progress_percent: 0,
    });

    navigate('/projects');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('newProject.title')}</h1>
        <p className="text-muted-foreground">{t('newProject.subtitle')}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('newProject.template')}</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger><SelectValue placeholder={t('newProject.templatePlaceholder')} /></SelectTrigger>
                <SelectContent>
                  {mockTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && (
              <div className="p-3 rounded-lg bg-muted text-sm">
                <p className="font-medium">{selectedTemplate.name}</p>
                <p className="text-muted-foreground text-xs mt-1">{selectedTemplate.description}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('newProject.duration')}: {selectedTemplate.duration_weeks} {t('newProject.weeks')} • {steps.length} {t('newProject.steps')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>{t('newProject.name')}</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder={t('newProject.namePlaceholder')} required />
            </div>

            <div className="space-y-2">
              <Label>{t('newProject.description')}</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t('newProject.descriptionPlaceholder')} />
            </div>

            <div className="space-y-2">
              <Label>{t('newProject.startDate')}</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={!templateId || !name}>{t('newProject.create')}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/projects')}>{t('newProject.cancel')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
