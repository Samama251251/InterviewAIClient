import React from 'react';
import { LogOut, Menu, Settings, User as UserIcon } from 'lucide-react';
import { UserAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Get user initials for avatar fallback
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || "Unknown Name";
  
  const getInitials = () => {
    if (!userName) return 'U';
    if (userName.includes('@')) {
      return userName.split('@')[0].substring(0, 2).toUpperCase();
    }
    return userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <motion.header 
      className="border-b border-base-300 bg-base-100 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="navbar px-4 md:px-6 h-16">
        <div className="navbar-start">
          <label 
            htmlFor="drawer-toggle" 
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </label>
        </div>
        
        <div className="navbar-center">
          <span className="text-xl font-bold hidden md:inline-block">InterviewAI</span>
        </div>
        
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="avatar placeholder">
                {session?.user?.image ? (
                  <div className="w-10 rounded-full ring ring-primary ring-opacity-10">
                    <img src={session.user.image} alt={userName} />
                  </div>
                ) : (
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <span className="text-xl">{getInitials()}</span>
                  </div>
                )}
              </div>
            </div>
            <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64">
              <div className="p-2 mb-2 bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    {session?.user?.image ? (
                      <div className="w-12 rounded-full ring ring-primary ring-opacity-10">
                        <img src={session.user.image} alt={userName} />
                      </div>
                    ) : (
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span className="text-xl">{getInitials()}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs opacity-70">{userEmail}</p>
                  </div>
                </div>
              </div>
              
              <li>
                <a 
                  className="flex items-center gap-2 px-2 py-2 hover:bg-base-200"
                  onClick={() => navigate('/dashboard/profile')}
                >
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>My Profile</span>
                </a>
              </li>
              
              <li>
                <a 
                  className="flex items-center gap-2 px-2 py-2 hover:bg-base-200" 
                  onClick={() => navigate('/dashboard/settings')}
                >
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Settings</span>
                </a>
              </li>
              
              <div className="divider my-1"></div>
              
              <li>
                <a 
                  className="flex items-center gap-2 px-2 py-2 text-error hover:bg-error hover:bg-opacity-10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;