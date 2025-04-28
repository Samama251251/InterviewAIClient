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
      className={`h-full transition-all duration-300 bg-sidebar-background border-r border-border ${open ? 'w-64' : 'w-16'}`}
    >
      <SidebarHeader className="p-4 flex flex-row items-center justify-between border-b border-border">
        <div className={`flex items-center ${!open && 'hidden'}`}>
          <Logo />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className={`rounded-full hover:bg-primary/5 transition-colors duration-300 ${open ? 'ml-2' : 'mx-auto'}`}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup> 
          <SidebarGroupLabel className={!open ? 'sr-only' : 'text-muted-foreground font-medium'}>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `flex items-center gap-2 p-2 rounded-md transition-colors duration-300 ${isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5 hover:text-primary"}`
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
                      `flex items-center gap-2 p-2 rounded-md transition-colors duration-300 ${isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5 hover:text-primary"}`
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
                      `flex items-center gap-2 p-2 rounded-md transition-colors duration-300 ${isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5 hover:text-primary"}`
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
                      `flex items-center gap-2 p-2 rounded-md transition-colors duration-300 ${isActive ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-primary/5 hover:text-primary"}`
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
      <SidebarFooter className="p-4 border-t border-border">
        <button className="flex items-center gap-2 p-2 w-full rounded-md text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-colors duration-300">
          <LogOut size={20} />
          <span className={!open ? 'hidden' : ''}>Log Out</span>
        </button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;