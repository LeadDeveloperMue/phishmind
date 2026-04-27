import React from 'react';
import { cn } from './Badge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

/**
 * Reusable Button component with different visual variants and loading state.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none';

    const variantClasses = {
      primary: 'bg-accent text-white hover:bg-accent/90',
      secondary:
        'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-bg dark:hover:bg-dark-bg text-light-primary dark:text-dark-primary',
      danger: 'bg-danger-light dark:bg-danger text-white hover:bg-danger-light/90 dark:hover:bg-danger/90',
    };

    const sizeClasses = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 py-2 px-4 text-sm',
      lg: 'h-11 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
