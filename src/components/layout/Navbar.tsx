import React, { useState } from 'react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Menu, Settings, User as UserIcon, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UserAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/signin');
  };

  console.log("SESSION INFO", session?.user)

  // Get user initials for avatar fallback
  const userEmail = session?.user?.email || '';

  const userName = session?.user?.user_metadata?.name || "Unknown Name";
  const getInitials = () => {
    if (!userName) return 'U';
    if (userName.includes('@')) {
      return userName.split('@')[0].substring(0, 2).toUpperCase();
    }
    return userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-2 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <SidebarTrigger className="hidden md:flex" />
        
        <div className="ml-auto flex items-center space-x-1">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-green-50 transition-colors rounded-full"
              >
                <Avatar className="h-8 w-8 border-2 border-green-100 ring-2 ring-green-50">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold line-clamp-1">
                    {userName.includes('@') ? userName.split('@')[0] : userName}
                  </span>
                  <span className="text-xs text-gray-500 line-clamp-1">
                    {userEmail}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <div className="flex items-center gap-3 p-2 rounded-md bg-gradient-to-r from-green-50 to-emerald-50 mb-2">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-green-900">
                    {userName}
                  </span>
                  <span className="text-xs text-green-700">{userEmail}</span>
                </div>
              </div>
              
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md">
                <UserIcon className="h-4 w-4 text-green-600" />
                <span>My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2 px-2 rounded-md" onClick={() => navigate('/dashboard/settings')}>
                <Settings className="h-4 w-4 text-green-600" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2" />
              
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 py-2 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;