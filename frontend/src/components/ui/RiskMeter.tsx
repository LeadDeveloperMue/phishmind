import React from 'react';
import { cn } from './Badge';

interface RiskMeterProps {
  score: number;
  label: string;
  className?: string;
}

/**
 * Visual risk score gauge component.
 * Displays a score from 0-100 with a corresponding colored circle stroke.
 */
export const RiskMeter: React.FC<RiskMeterProps> = ({ score, label, className }) => {
  // Determine color based on score thresholds
  let colorClass = "text-success-light dark:text-success"; // 0-30
  if (score > 30 && score <= 60) colorClass = "text-warning-light dark:text-warning";
  if (score > 60 && score <= 80) colorClass = "text-accent";
  if (score > 80) colorClass = "text-danger-light dark:text-danger";

  // SVG Circle calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative inline-flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            className="text-light-border dark:text-dark-border"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
          />
          {/* Progress Circle */}
          <circle
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
          />
        </svg>
        {/* Score Text */}
        <span className="absolute text-2xl font-bold text-light-primary dark:text-dark-primary">
          {score}
        </span>
      </div>
      {/* Label */}
      <span className="mt-2 text-sm font-medium text-light-secondary dark:text-dark-secondary uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};
