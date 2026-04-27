import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from './Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Metric card component for the dashboard.
 * Displays an icon, label, main value, and an optional trend indicator.
 */
export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div className={cn("p-6 rounded-xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-light-secondary dark:text-dark-secondary">{title}</h3>
        <Icon className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
      </div>
      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-semibold text-light-primary dark:text-dark-primary">{value}</span>
        {trend && (
          <span className={cn(
            "text-sm font-medium",
            trend.isPositive ? "text-success-light dark:text-success" : "text-danger-light dark:text-danger"
          )}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
