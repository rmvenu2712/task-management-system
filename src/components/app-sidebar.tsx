import { Home, FolderKanban, BarChart3, User, Plus, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ProjectDialog } from './ProjectDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import vLogo from "../../public/assets/venu-logo.png"

export function AppSidebar() {
  const { projects, selectedProjectId, setSelectedProject, userProfile } = useTaskStore();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const mainNavItems = [
    { title: 'Dashboard', url: '/', icon: Home },
    { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'Profile', url: '/profile', icon: User },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <img src={vLogo} alt="vLogo" className='w-8'/>
          {/* <div className="p-2 bg-primary rounded-lg">
            <FolderKanban className="h-5 w-5 text-primary-foreground" />
          </div> */}
          <div>
            <h2 className="font-bold text-lg">TaskFlow </h2>
            <p className="text-xs text-muted-foreground">Advanced PM</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted'
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setProjectDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setSelectedProject(null)}
                  className={!selectedProjectId ? 'bg-primary/10 text-primary font-medium' : ''}
                >
                  <FolderKanban className="h-4 w-4" />
                  <span>All Projects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton
                    onClick={() => setSelectedProject(project.id)}
                    className={selectedProjectId === project.id ? 'bg-primary/10 text-primary font-medium' : ''}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <NavLink to="/profile" className="flex items-center gap-3 hover:bg-muted p-2 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userProfile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userProfile.name}</p>
            <p className="text-xs text-muted-foreground truncate">{userProfile.role}</p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </NavLink>
      </SidebarFooter>

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
      />
    </Sidebar>
  );
}
