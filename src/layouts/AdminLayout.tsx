import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FileCode2,
  Users,
  LogOut,
  Heart,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AccessDenied } from '@/components/admin/AccessDenied';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/banks', label: 'Banks', icon: Building2 },
  { path: '/admin/parser-configs', label: 'Parser Configs', icon: FileCode2 },
  { path: '/admin/users', label: 'Users', icon: Users },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  return (
    <>
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4 sm:h-16 sm:px-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary sm:h-8 sm:w-8">
          <Heart className="h-3.5 w-3.5 text-primary-foreground sm:h-4 sm:w-4" />
        </div>
        <span className="text-base font-bold text-sidebar-primary-foreground sm:text-lg">Kardio</span>
        <Badge variant="outline" className="ml-auto border-sidebar-border text-[10px] text-sidebar-muted sm:text-xs">
          Admin
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-3 sm:px-3 sm:py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200 sm:gap-3 sm:px-3 sm:py-2.5',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 transition-colors sm:h-5 sm:w-5',
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
      <div className="border-t border-sidebar-border p-3 sm:p-4">
        <div className="mb-2 rounded-lg bg-sidebar-accent/50 p-2.5 sm:mb-3 sm:p-3">
          <p className="text-[10px] text-sidebar-muted sm:text-xs">Logged in as</p>
          <p className="truncate text-xs font-medium text-sidebar-accent-foreground sm:text-sm">
            {currentUser?.email}
          </p>
          <p className="text-[10px] text-sidebar-primary sm:text-xs">{currentUser?.role}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2 text-xs text-sidebar-muted hover:bg-sidebar-accent hover:text-destructive sm:text-sm"
        >
          <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Logout
        </Button>
      </div>
    </>
  );
}

export function AdminLayout() {
  const { isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r border-sidebar-border bg-sidebar lg:flex lg:w-64">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-0">
            <div className="flex h-full flex-col">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
            <Heart className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">Kardio</span>
          <Badge variant="secondary" className="text-[10px]">Admin</Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-14 lg:ml-64 lg:pt-0">
        <div className="container max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
