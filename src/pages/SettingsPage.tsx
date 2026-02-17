import { useAuthStore } from '@/stores/auth-store';
import { mockUsers, mockTenant } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Users, Shield } from 'lucide-react';

const roleLabels: Record<string, string> = { admin: 'Админ', manager: 'Менеджер', employee: 'Сотрудник' };
const roleBadgeColors: Record<string, string> = { admin: 'bg-red-100 text-red-800', manager: 'bg-blue-100 text-blue-800', employee: 'bg-green-100 text-green-800' };

export default function SettingsPage() {
  const { user, switchRole } = useAuthStore();

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
        <p className="text-muted-foreground">Управление организацией и пользователями</p>
      </div>

      {/* Org info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Организация</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><Label className="text-xs text-muted-foreground">Название</Label><p className="font-medium">{mockTenant.name}</p></div>
          <div><Label className="text-xs text-muted-foreground">ИНН</Label><p className="font-medium">{mockTenant.inn}</p></div>
          <div><Label className="text-xs text-muted-foreground">Отрасль</Label><p className="font-medium">{mockTenant.industry}</p></div>
        </CardContent>
      </Card>

      {/* Demo role switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Переключение роли (демо)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(['admin', 'manager', 'employee'] as const).map(role => (
              <Button
                key={role}
                variant={user?.role === role ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchRole(role)}
              >
                {roleLabels[role]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Пользователи</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Отдел</TableHead>
                <TableHead>Роль</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{u.department}</TableCell>
                  <TableCell><Badge className={roleBadgeColors[u.role]}>{roleLabels[u.role]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
