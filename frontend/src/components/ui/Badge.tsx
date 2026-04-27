import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility to merge tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'active'
  | 'draft'
  | 'completed'
  | 'success';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

/**
 * Risk and Status Badge component.
 * Displays a pill-shaped badge with colors corresponding to risk or status.
 */
export const Badge: React.FC<BadgeProps> = ({ variant, className, children, ...props }) => {
  const baseClasses =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border';

  const variantClasses: Record<BadgeVariant, string> = {
    low: 'bg-success-light/10 text-success-light border-success-light/20 dark:bg-success/10 dark:text-success dark:border-success/20',
    completed:
      'bg-success-light/10 text-success-light border-success-light/20 dark:bg-success/10 dark:text-success dark:border-success/20',
    success:
      'bg-success-light/10 text-success-light border-success-light/20 dark:bg-success/10 dark:text-success dark:border-success/20',

    medium:
      'bg-warning-light/10 text-warning-light border-warning-light/20 dark:bg-warning/10 dark:text-warning dark:border-warning/20',

    high: 'bg-accent/10 text-accent border-accent/20 dark:bg-accent/10 dark:text-accent dark:border-accent/20',
    active: 'bg-accent/10 text-accent border-accent/20 dark:bg-accent/10 dark:text-accent dark:border-accent/20',

    critical:
      'bg-danger-light/10 text-danger-light border-danger-light/20 dark:bg-danger/10 dark:text-danger dark:border-danger/20',

    draft:
      'bg-light-secondary/10 text-light-secondary border-light-secondary/20 dark:bg-dark-secondary/10 dark:text-dark-secondary dark:border-dark-secondary/20',
  };

  return (
    <span className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
};
