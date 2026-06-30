import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardPage({ children }: { children: React.ReactNode }) {
  return <div className="dashboard-page">{children}</div>;
}

export function DashboardHero({
  badge,
  badgeIcon: BadgeIcon,
  name,
  subtitle,
  meta,
  actions,
  stats,
}: {
  badge?: string;
  badgeIcon?: LucideIcon;
  name: string;
  subtitle: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  stats?: { label: string; value: string; hint?: string }[];
}) {
  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero-glow" aria-hidden />
      <div className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {badge && (
                <span className="dashboard-role-badge">
                  {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
                  {badge}
                </span>
              )}
              {meta}
            </div>
            <p className="text-caption text-muted-foreground leading-normal">{getGreeting()},</p>
            <h1 className="text-h1 font-bold text-foreground mt-1.5 leading-tight">{name}</h1>
            <p className="text-body-sm text-muted-foreground mt-2.5 max-w-xl leading-relaxed">{subtitle}</p>
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">{actions}</div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <div className="dashboard-stat-strip">
            {stats.map((s) => (
              <div key={s.label} className="dashboard-stat-item">
                <p className="dashboard-stat-label">{s.label}</p>
                <p className="dashboard-stat-value">{s.value}</p>
                {s.hint && <p className="dashboard-stat-hint">{s.hint}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function QuickActionGrid({
  items,
}: {
  items: { to: string; icon: LucideIcon; label: string; grad: string }[];
}) {
  return (
    <div className="quick-action-grid">
      {items.map((q) => (
        <Link key={q.to} to={q.to} className="quick-action-card group">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${q.grad} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
          >
            <q.icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-body-sm font-semibold text-foreground text-center">{q.label}</span>
        </Link>
      ))}
    </div>
  );
}

export function PeriodTabs<T extends string>({
  periods,
  value,
  onChange,
}: {
  periods: readonly T[];
  value: T;
  onChange: (p: T) => void;
}) {
  return (
    <div className="period-tabs" role="tablist" aria-label="Time period">
      {periods.map((p) => (
        <button
          key={p}
          type="button"
          role="tab"
          aria-selected={value === p}
          onClick={() => onChange(p)}
          className={`period-tab ${value === p ? 'period-tab--active' : ''}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export function LiveIndicator({ label = 'Live' }: { label?: string }) {
  return (
    <span className="live-indicator">
      <span className="live-dot" aria-hidden />
      {label}
    </span>
  );
}

export function CommandStrip({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="command-strip">
      <div className="min-w-0">
        <p className="text-body-sm font-semibold text-foreground">{title}</p>
        <p className="text-caption text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}
