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
} from '@/components/ui/sidebar';
import { LogOut, Home, Briefcase, Users, Settings } from 'lucide-react';
import Logo from '../Logo';

const Sidebar: React.FC = () => {
  return (
    <SidebarComponent>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"
                    }
                  >
                    <Home size={20} />
                    <span>Overview</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/jobs"
                    className={({ isActive }) => 
                      isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"
                    }
                  >
                    <Briefcase size={20} />
                    <span>Job Postings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/candidates"
                    className={({ isActive }) => 
                      isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"
                    }
                  >
                    <Users size={20} />
                    <span>Candidates</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) => 
                      isActive ? "text-interviewai-green" : "text-gray-600 hover:text-interviewai-green"
                    }
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <button className="flex items-center text-gray-600 hover:text-interviewai-green">
          <LogOut size={20} className="mr-2" />
          <span>Log Out</span>
        </button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;