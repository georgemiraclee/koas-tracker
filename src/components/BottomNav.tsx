import { cn } from '@/lib/utils';
import { Home, BookOpen, BarChart3, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Beranda' },
  { path: '/departments', icon: BookOpen, label: 'Departemen' },
  { path: '/analytics', icon: BarChart3, label: 'Analitik' },
  { path: '/settings', icon: Settings, label: 'Pengaturan' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show nav on onboarding/splash
  if (['/onboarding', '/splash', '/profile-setup'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'animate-scale-in')} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
