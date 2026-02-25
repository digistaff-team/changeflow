import { useAuthStore } from '@/stores/auth-store';
import { mockUsers, mockTenant } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Users, Shield } from 'lucide-react';
import { t } from '@/lib/i18n';

const roleLabels: Record<string, string> = {
  admin: t('settings.roles.admin'),
  manager: t('settings.roles.manager'),
  employee: t('settings.roles.employee'),
};

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  employee: 'bg-green-100 text-green-800',
};

export default function SettingsPage() {
  const { user, switchRole } = useAuthStore();

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> {t('settings.organization')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><Label className="text-xs text-muted-foreground">{t('settings.fields.name')}</Label><p className="font-medium">{mockTenant.name}</p></div>
          <div><Label className="text-xs text-muted-foreground">{t('settings.fields.inn')}</Label><p className="font-medium">{mockTenant.inn}</p></div>
          <div><Label className="text-xs text-muted-foreground">{t('settings.fields.industry')}</Label><p className="font-medium">{mockTenant.industry}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> {t('settings.roleSwitch')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(['admin', 'manager', 'employee'] as const).map(role => (
              <Button key={role} variant={user?.role === role ? 'default' : 'outline'} size="sm" onClick={() => switchRole(role)}>
                {roleLabels[role]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> {t('settings.users')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('settings.fields.fullName')}</TableHead>
                <TableHead>{t('settings.fields.email')}</TableHead>
                <TableHead>{t('settings.fields.department')}</TableHead>
                <TableHead>{t('settings.fields.role')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map(userItem => (
                <TableRow key={userItem.id}>
                  <TableCell className="font-medium">{userItem.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{userItem.email}</TableCell>
                  <TableCell>{userItem.department}</TableCell>
                  <TableCell><Badge className={roleBadgeColors[userItem.role]}>{roleLabels[userItem.role]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
