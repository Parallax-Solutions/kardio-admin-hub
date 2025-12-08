import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FileCode2,
  Users,
  LogOut,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AccessDenied } from '@/components/admin/AccessDenied';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/banks', label: 'Banks', icon: Building2 },
  { path: '/admin/parser-configs', label: 'Parser Configs', icon: FileCode2 },
  { path: '/admin/users', label: 'Users', icon: Users },
];

export function AdminLayout() {
  const location = useLocation();
  const { currentUser, isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-primary-foreground">Kardio</span>
          <Badge variant="outline" className="ml-auto border-sidebar-border text-xs text-sidebar-muted">
            Admin
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-sidebar-primary' : 'text-sidebar-muted group-hover:text-sidebar-primary'
                  )}
                />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 text-sidebar-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-xs text-sidebar-muted">Logged in as</p>
            <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
              {currentUser?.email}
            </p>
            <p className="text-xs text-sidebar-primary">{currentUser?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start gap-2 text-sidebar-muted hover:bg-sidebar-accent hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="container max-w-7xl py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
