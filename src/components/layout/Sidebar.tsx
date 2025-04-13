import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { LogOut, Home, Briefcase, Users, Settings, ChevronLeft } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const { toggleSidebar, open } = useSidebar();

  // We're importing useSidebar to ensure proper connection with the sidebar context
  // but not actively using the variables in this component as the toggle is in Navbar
  
  return (
    <SidebarComponent 
      className={`h-full transition-all duration-300 ${open ? 'w-64' : 'w-16'}`}
    >
      <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b">
        <div className={`flex items-center ${!open && 'hidden'}`}>
          <Logo />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className={`rounded-full hover:bg-gray-100 ${open ? 'ml-2' : 'mx-auto'}`}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft className={`h-5 w-5 transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup> 
          <SidebarGroupLabel className={!open ? 'sr-only' : ''}>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `flex items-center gap-2 p-2 rounded-md ${isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"}`
                    }
                  >
                    <Home size={20} />
                    <span className={!open ? 'hidden' : ''}>Overview</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/jobs"
                    className={({ isActive }) => 
                      `flex items-center gap-2 p-2 rounded-md ${isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"}`
                    }
                  >
                    <Briefcase size={20} />
                    <span className={!open ? 'hidden' : ''}>Job Postings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/candidates"
                    className={({ isActive }) => 
                      `flex items-center gap-2 p-2 rounded-md ${isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"}`
                    }
                  >
                    <Users size={20} />
                    <span className={!open ? 'hidden' : ''}>Candidates</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) => 
                      `flex items-center gap-2 p-2 rounded-md ${isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"}`
                    }
                  >
                    <Settings size={20} />
                    <span className={!open ? 'hidden' : ''}>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <button className="flex items-center text-gray-600 hover:text-interviewai-green w-full">
          <LogOut size={20} className="mr-2" />
          <span className={!open ? 'hidden' : ''}>Log Out</span>
        </button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;