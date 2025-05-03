import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="drawer lg:drawer-open">
      <input 
        id="drawer-toggle" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col bg-base-100">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <motion.main 
          className="flex-1 overflow-y-auto p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
    </div>
  );
};

export default DashboardLayout;
