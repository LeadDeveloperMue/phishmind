import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Empty state component with an icon, message, and optional CTA button.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
      <div className="w-12 h-12 mb-4 rounded-full bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <Icon className="w-6 h-6 text-light-secondary dark:text-dark-secondary" />
      </div>
      <h3 className="text-lg font-medium text-light-primary dark:text-dark-primary mb-1">{title}</h3>
      <p className="text-sm text-light-secondary dark:text-dark-secondary max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
