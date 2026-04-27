import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

/**
 * Main application layout wrapping the Sidebar, Navbar, and page content.
 */
export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="antialiased bg-light-bg dark:bg-dark-bg min-h-screen text-light-primary dark:text-dark-primary">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar />
      <main className="p-4 md:ml-64 h-auto pt-20">
        {/* Main content routes are rendered here */}
        <Outlet />
      </main>
    </div>
  );
};
