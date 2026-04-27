import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, Send, Users, FlaskConical } from 'lucide-react';
import { cn } from '../ui/Badge';

const navItems = [
  { name: 'Dashboard',  path: '/',           icon: LayoutDashboard },
  { name: 'Campaigns',  path: '/campaigns',  icon: Send },
  { name: 'Employees',  path: '/employees',  icon: Users },
  { name: 'Simulate',   path: '/simulate',   icon: FlaskConical },
];

/**
 * Sidebar navigation component for PhishMind Dashboard.
 */
export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen border-r border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface flex flex-col md:translate-x-0 -translate-x-full transition-transform">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-light-border dark:border-dark-border shrink-0">
        <div className="p-1.5 bg-accent/10 rounded-lg">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <span className="text-lg font-semibold text-light-primary dark:text-dark-primary tracking-tight">
          PhishMind <span className="text-accent font-bold">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-light-secondary dark:text-dark-secondary">
          Main Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-light-secondary dark:text-dark-secondary hover:bg-light-bg dark:hover:bg-dark-bg hover:text-light-primary dark:hover:text-dark-primary border border-transparent',
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-light-border dark:border-dark-border shrink-0">
        <p className="text-[11px] text-light-secondary dark:text-dark-secondary">
          © 2025 SentraCore LLC
        </p>
      </div>
    </aside>
  );
};
