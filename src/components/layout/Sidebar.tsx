import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Home, Briefcase, Users, Settings, ChevronLeft } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { motion } from 'framer-motion';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  return (
    <div className="drawer-side z-20">
      <label htmlFor="drawer-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
      <motion.aside 
        className="bg-base-200 w-64 h-full"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-5 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>
          <button 
            onClick={() => setOpen(!open)}
            className="btn btn-ghost btn-circle lg:hidden"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
          </button>
        </div>
        
        <div className="p-4">
          <ul className="menu p-0 [&_li>*]:rounded-lg">
            <li className="menu-title">
              <span>Dashboard</span>
            </li>
            
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  isActive ? "active bg-primary text-primary-content" : ""
                }
              >
                <Home size={20} />
                <span>Overview</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/dashboard/jobs"
                className={({ isActive }) => 
                  isActive ? "active bg-primary text-primary-content" : ""
                }
              >
                <Briefcase size={20} />
                <span>Job Postings</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/dashboard/candidates"
                className={({ isActive }) => 
                  isActive ? "active bg-primary text-primary-content" : ""
                }
              >
                <Users size={20} />
                <span>Candidates</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) => 
                  isActive ? "active bg-primary text-primary-content" : ""
                }
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-base-300">
          <button className="btn btn-ghost w-full flex items-center gap-2 text-error hover:bg-error hover:bg-opacity-10">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </motion.aside>
    </div>
  );
};

export default Sidebar;