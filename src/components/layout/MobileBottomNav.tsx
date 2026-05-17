import type { ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface Props {
  items: NavItem[];
}

export default function MobileBottomNav({ items }: Props) {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path || (path !== '/app/profile' && pathname.startsWith(`${path}/`));

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-xl border-t border-sidebar-border/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 py-2">
        {items.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
