import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onMenuClick?: () => void;
}

const routeTitles: Record<string, string> = {
  '/':          'Dashboard',
  '/campaigns': 'Campaigns',
  '/employees': 'Employees',
  '/simulate':  'Email Simulator',
};

function getPageTitle(pathname: string): string {
  if (routeTitles[pathname]) return routeTitles[pathname];
  if (pathname.startsWith('/campaigns/')) return 'Campaign Detail';
  if (pathname.startsWith('/employees/')) return 'Employee Profile';
  if (pathname.startsWith('/training/')) return 'Security Training';
  return 'PhishMind AI';
}

/**
 * Top navigation bar with dynamic page title and theme toggle.
 */
export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 z-30 w-full bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur border-b border-light-border dark:border-dark-border md:pl-64">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left: mobile menu + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex items-center p-2 text-light-secondary dark:text-dark-secondary rounded-lg md:hidden hover:bg-light-bg dark:hover:bg-dark-bg focus:outline-none transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-light-primary dark:text-dark-primary">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right: theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-light-secondary dark:text-dark-secondary rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg focus:outline-none transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
};
