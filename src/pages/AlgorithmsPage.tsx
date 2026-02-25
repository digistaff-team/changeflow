import { mockTemplates, mockTemplateSteps } from '@/data/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Cog, Monitor, Users, Factory, Network } from 'lucide-react';
import { t } from '@/lib/i18n';

const iconMap: Record<string, React.ElementType> = { Cog, Monitor, Users, Factory, Network };

export default function AlgorithmsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('algorithms.title')}</h1>
        <p className="text-muted-foreground">{t('algorithms.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTemplates.map(template => {
          const steps = mockTemplateSteps.filter(step => step.template_id === template.id);
          const Icon = iconMap[template.icon] || Cog;
          return (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${template.color}20` }}>
                    <Icon className="h-6 w-6" style={{ color: template.color }} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {template.duration_weeks} {t('algorithms.weeksShort')}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-3">{template.name}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{t('algorithms.steps', { count: steps.length })}</p>
                  {steps.map(step => (
                    <div key={step.id} className="flex items-center gap-2 text-xs text-foreground/80">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">{step.step_number}</span>
                      <span className="truncate">{step.name}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full" onClick={() => navigate(`/projects/new?template=${template.id}`)}>
                  {t('algorithms.createProject')} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
