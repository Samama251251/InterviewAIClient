import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './HeaderDashboard';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  theme?: string;
  toggleTheme?: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ theme, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Close sidebar on route change for mobile devices
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Main content */}
      <div className={`flex flex-col min-h-screen ${sidebarOpen ? 'lg:ml-64' : ''} transition-all duration-300`}>
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
      
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
    </div>
  );
};

export default DashboardLayout;
