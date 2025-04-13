import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

interface DashboardLayoutProps {
  // No props needed since we're using Outlet
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const location = useLocation();
  
  // Nav items for sidebar
  const navItems = [
    { to: '/dashboard', icon: 'home', label: 'Overview' },
    { to: '/dashboard/jobs', icon: 'briefcase', label: 'Job Postings' },
    { to: '/dashboard/candidates', icon: 'users', label: 'Candidates' },
    { to: '/dashboard/settings', icon: 'cog', label: 'Settings' },
  ];

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Get initials for avatar
  const getInitials = () => {
    return 'JD'; // Default initials for John Doe
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link to="/dashboard" className="text-2xl font-bold text-green-500">
            InterviewAI
          </Link>
        </div>
        
        <div className="mt-6 flex-grow">
          <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Dashboard
          </div>
          <nav className="mt-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-3 text-sm ${
                  isActive(item.to)
                    ? 'text-green-600 bg-green-50 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">
                  <i className={`fas fa-${item.icon}`}></i>
                </span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Logout button in sidebar */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <Link 
            to="/signin" 
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 py-2 px-4"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Log Out
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-end px-6 py-3">
            <div className="flex items-center space-x-4">
              <button 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Notifications"
              >
                <i className="fas fa-bell"></i>
              </button>
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                    {getInitials()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
     

export default DashboardLayout;