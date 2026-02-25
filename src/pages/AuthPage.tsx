import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthPage() {
  const [email, setEmail] = useState('admin@progress.ru');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email);
    if (success) {
      navigate('/dashboard');
    }
  };

  const quickLogin = async (email: string) => {
    const success = await login(email);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">CF</div>
          <h1 className="text-2xl font-bold text-foreground">ChangeFlow</h1>
          <p className="text-muted-foreground text-sm">Платформа управления изменениями</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Вход в систему</CardTitle>
            <CardDescription>Введите email для получения Magic Link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.ru" />
              </div>
              <Button type="submit" className="w-full">Войти</Button>
            </form>

            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-3">Быстрый вход (демо):</p>
              <div className="space-y-2">
                {[
                  { email: 'admin@progress.ru', label: 'Админ — Иванов Алексей' },
                  { email: 'manager@progress.ru', label: 'Менеджер — Петрова Мария' },
                  { email: 'employee@progress.ru', label: 'Сотрудник — Сидоров Дмитрий' },
                ].map(u => (
                  <Button key={u.email} variant="outline" size="sm" className="w-full justify-start text-xs" onClick={() => quickLogin(u.email)}>
                    {u.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
