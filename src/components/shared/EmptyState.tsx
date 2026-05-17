import type { ComponentType } from 'react';

interface Props {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="bento-section py-20 text-center">
      <div className="w-20 h-20 bg-secondary/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-h3 font-bold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-body text-muted-foreground mb-8 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <button onClick={action.onClick} className="btn-primary px-8">
          {action.label}
        </button>
      )}
    </div>
  );
}
