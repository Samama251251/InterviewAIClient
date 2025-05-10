import React from 'react';
import { LogOut, Menu, Settings, User as UserIcon, Sun, Moon, Briefcase, UserRound, Building2, ChevronDown } from 'lucide-react';
import { UserAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCompanyContext } from '@/contexts/CompanyContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  theme?: string;
  toggleTheme?: () => void;
  sidebarOpen?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, theme, toggleTheme, sidebarOpen }) => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployeeMode = location.pathname.startsWith('/employee');
  
  // Get company context if in employee mode
  const companyContext = isEmployeeMode ? useCompanyContext() : null;
  const { companies = [], selectedCompany, setSelectedCompany } = companyContext || {};

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Handle mode switch
  const handleModeSwitch = () => {    
    // Navigate to the other mode with the same path
    if (isEmployeeMode) {
      navigate(`/candidate`);
    } else {
      navigate(`/employee`);
    }
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
          {/* Show hamburger menu on all screen sizes when sidebar is closed */}
          {!sidebarOpen && (
            <motion.button 
              onClick={onToggleSidebar}
              className="btn btn-sm btn-ghost btn-circle mr-2 hover:bg-primary/10"
              whileTap={{ scale: 0.9 }}
              title="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          )}
        
          {/* Company selector for employee mode */}
          {isEmployeeMode && selectedCompany && (
            <div className="dropdown dropdown-bottom">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost px-3 py-1 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold truncate max-w-[150px]">
                    {selectedCompany.name}
                  </span>
                  <span className="text-xs text-base-content/60 truncate max-w-[150px]">
                    {selectedCompany.role === 'owner' ? 'Owner' : 'Employee'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </div>
              
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 mt-1">
                <div className="p-2 text-xs text-base-content/70 border-b border-base-300 mb-1">
                  Select Company
                </div>
                {companies.map(company => (
                  <li key={company._id}>
                    <button 
                      className={`flex items-center gap-2 py-2 px-3 ${selectedCompany?._id === company._id ? 'bg-primary/10 text-primary' : ''}`}
                      onClick={() => setSelectedCompany?.(company)}
                    >
                      <div className="w-6 h-6 rounded-full bg-base-200 flex items-center justify-center">
                        <Building2 className="h-3 w-3" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{company.name}</span>
                        <span className="text-xs text-base-content/60">
                          {company.role === 'owner' ? 'Owner' : 'Employee'}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
                
                {companies.length === 0 && (
                  <li className="text-center py-2 text-sm text-base-content/70">
                    No companies available
                  </li>
                )}
                
                <div className="divider my-1"></div>
                
                <li>
                  <button
                    className="flex items-center gap-2 text-primary"
                    onClick={() => navigate('/employee/companies/new')}
                  >
                    <span>Create New Company</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="navbar-center">
          {/* Empty center section for balance */}
        </div>
        
        <div className="navbar-end space-x-2">
          {/* Mode switch button */}
          <motion.button
            onClick={handleModeSwitch}
            className="btn btn-sm btn-outline border-primary text-primary hover:bg-primary hover:text-primary-content gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEmployeeMode ? (
              <>
                <UserRound className="h-4 w-4" />
                <span className="hidden sm:inline">Switch to Candidate</span>
                <span className="inline sm:hidden">Candidate</span>
              </>
            ) : (
              <>
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Switch to Employee</span>
                <span className="inline sm:hidden">Employee</span>
              </>
            )}
          </motion.button>
          
          {/* Theme toggle button */}
          {toggleTheme && (
            <motion.button 
              onClick={toggleTheme} 
              className="btn btn-ghost btn-circle"
              whileTap={{ scale: 0.9 }}
              title={theme === 'lemonade' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'lemonade' 
                ? <Moon className="h-5 w-5 text-base-content" /> 
                : <Sun className="h-5 w-5 text-base-content" />
              }
            </motion.button>
          )}
          
          {/* User dropdown */}
          <div className="dropdown dropdown-end">
            <motion.div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost px-2 py-0 rounded-btn flex items-center gap-2"
              whileHover={{ backgroundColor: 'rgba(var(--primary-color), 0.05)' }}
            >
              <div className="avatar">
                {session?.user?.image ? (
                  <div className="w-10 h-10 rounded-full border-2 border-primary/10 ring-2 ring-primary/5">
                    <img 
                      src={session.user.image} 
                      alt={getInitials()}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-primary/10 ring-2 ring-primary/5 bg-gradient-to-br from-primary to-primary/80 text-primary-content flex items-center justify-center">
                    <span className="text-sm font-medium select-none text-center">
                      {getInitials()}
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold truncate max-w-[120px]">
                  {userName}
                </span>
                <span className="text-xs text-base-content/60 truncate max-w-[120px]">
                  {userEmail}
                </span>
              </div>
            </motion.div>
            
            <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64">
              <div className="p-3 mb-2 bg-base-200/70 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    {session?.user?.image ? (
                      <div className="w-12 rounded-full ring-2 ring-primary ring-opacity-20">
                        <img 
                          src={session.user.image} 
                          alt={getInitials()}
                          className="object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="bg-primary text-primary-content rounded-full w-12 flex items-center justify-center ring-2 ring-primary ring-opacity-20 shadow-md border-2 border-white">
                        <span className="text-2xl font-bold tracking-wide select-none">
                          {getInitials()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-base-content/70">{userEmail}</p>
                  </div>
                </div>
              </div>
              <li>
                <motion.a 
                  className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10"
                  onClick={() => navigate(`/${isEmployeeMode ? 'employee' : 'candidate'}/profile`)}
                  whileHover={{ x: 3 }}
                >
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>My Profile</span>
                </motion.a>
              </li>
              
              <li>
                <motion.a 
                  className="flex items-center gap-2 px-2 py-2 hover:bg-primary/10" 
                  onClick={() => navigate(`/${isEmployeeMode ? 'employee' : 'candidate'}/settings`)}
                  whileHover={{ x: 3 }}
                >
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Settings</span>
                </motion.a>
              </li>
              
              <div className="divider my-1"></div>
              
              <li>
                <motion.a 
                  className="flex items-center gap-2 px-2 py-2 text-error hover:bg-error/10"
                  onClick={handleLogout}
                  whileHover={{ x: 3 }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </motion.a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;