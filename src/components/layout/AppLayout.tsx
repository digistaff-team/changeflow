import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import {
  LayoutDashboard, FolderKanban, GitBranch, MessageSquare,
  Bot, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { t } from '@/lib/i18n';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: t('layout.nav.dashboard') },
  { to: '/algorithms', icon: GitBranch, label: t('layout.nav.algorithms') },
  { to: '/projects', icon: FolderKanban, label: t('layout.nav.projects') },
  { to: '/feedback', icon: MessageSquare, label: t('layout.nav.feedback') },
  { to: '/ai-assistant', icon: Bot, label: t('layout.nav.aiAssistant') },
  { to: '/learning', icon: BookOpen, label: t('layout.nav.learning') },
  { to: '/settings', icon: Settings, label: t('layout.nav.settings') },
];

const roleLabels: Record<string, string> = {
  admin: t('layout.roles.admin'),
  manager: t('layout.roles.manager'),
  employee: t('layout.roles.employee'),
};

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className={cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}>
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            CF
          </div>
          {!collapsed && <span className="font-semibold text-base tracking-tight">ChangeFlow</span>}
        </div>

        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                <Badge variant="secondary" className="text-xs mt-0.5">{roleLabels[user?.role || 'employee']}</Badge>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground/70 hover:text-sidebar-foreground h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
