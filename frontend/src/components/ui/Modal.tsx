import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './Badge';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Modal / slide-in drawer component.
 * On mobile: centred dialog. On desktop: right-aligned drawer panel.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center lg:items-stretch lg:justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-light-surface dark:bg-dark-surface flex flex-col shadow-2xl',
          // Mobile: bottom sheet with rounded top
          'rounded-t-2xl max-h-[90vh]',
          // ≥sm: centred dialog, fully rounded
          'sm:rounded-2xl sm:max-h-[85vh]',
          // ≥lg: full-height right drawer
          'lg:h-full lg:max-h-full lg:rounded-none lg:border-l lg:border-light-border dark:lg:border-dark-border',
          maxWidthClasses[maxWidth],
          'lg:max-w-md',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-light-border dark:border-dark-border shrink-0">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-light-secondary dark:text-dark-secondary" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-5 border-t border-light-border dark:border-dark-border flex justify-end gap-3 bg-light-bg/40 dark:bg-dark-bg/40 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
