import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Briefcase, Users, Settings, ChevronLeft, Menu, Calendar, UserRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = UserAuth();

  // Determine current mode based on URL path
  const isEmployeeMode = location.pathname.startsWith('/employee');

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Animation variants
  const sidebarVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
    closed: { 
      x: -300, 
      opacity: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  const itemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  // Check if a route is active
  const isActive = (path: string) => {
    if ((path === '/employee' && location.pathname === '/employee') || 
        (path === '/candidate' && location.pathname === '/candidate')) {
      return true;
    }
    return location.pathname.startsWith(path) && (path !== '/employee' && path !== '/candidate');
  };

  // Define menu items based on mode
  const employeeMenuItems = [
    { path: '/employee', icon: <Home size={18} />, label: 'Overview', exact: true },
    { path: '/employee/jobs', icon: <Briefcase size={18} />, label: 'Job Postings' },
    { path: '/employee/candidates', icon: <Users size={18} />, label: 'Candidates' },
    { path: '/employee/settings', icon: <Settings size={18} />, label: 'Settings' }
  ];

  const candidateMenuItems = [
    { path: '/candidate', icon: <Home size={18} />, label: 'Overview', exact: true },
    { path: '/candidate/interviews', icon: <Calendar size={18} />, label: 'Interviews' },
    { path: '/candidate/settings', icon: <Settings size={18} />, label: 'Settings' }
  ];

  // Select the appropriate menu items based on mode
  const menuItems = isEmployeeMode ? employeeMenuItems : candidateMenuItems;

  return (
    <>
      {/* Overlay - only on mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" 
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside 
            className="fixed left-0 top-0 bottom-0 w-64 bg-base-200 shadow-xl z-20 flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            {/* Sidebar Header with Logo and Toggle Button */}
            <div className="px-4 py-4 border-b border-base-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">Interview<span className="text-primary">AI</span></span>
              </div>
              
              {/* Toggle Button */}
              <motion.button 
                onClick={() => setOpen(false)}
                className="btn btn-sm btn-ghost btn-circle hover:bg-base-300"
                whileTap={{ scale: 0.9 }}
                title="Close sidebar"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Sidebar Content */}
            <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-base-300">
              <div className="px-3 py-4">
                <motion.ul 
                  className="space-y-1"
                  variants={itemVariants}
                >
                  {menuItems.map((item, index) => (
                    <motion.li 
                      key={item.path}
                      variants={itemVariants}
                      className="rounded-md overflow-hidden"
                    >
                      <NavLink 
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) => 
                          `flex items-center px-3 py-2.5 transition-all duration-200 ${
                            isActive 
                              ? "bg-primary text-primary-content font-medium" 
                              : "text-base-content hover:bg-primary/10"
                          }`
                        }
                      >
                        <motion.div 
                          className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                          whileHover={{ rotate: 5 }}
                        >
                          {item.icon}
                        </motion.div>
                        <span className="ml-3">{item.label}</span>
                        
                        {/* Active indicator */}
                        {isActive(item.path) && (
                          <motion.div 
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-content"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-base-300">
              <motion.button 
                onClick={handleLogout}
                className="btn btn-sm w-full flex items-center justify-start gap-2 text-error hover:bg-error/10"
                whileHover={{ x: 3 }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Fixed toggle button for mobile */}
      {!open && (
        <div className="fixed bottom-4 right-4 lg:hidden z-30">
          <motion.button 
            onClick={() => setOpen(true)} 
            className="btn btn-primary btn-circle shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} />
          </motion.button>
        </div>
      )}
    </>
  );
};

export default Sidebar;