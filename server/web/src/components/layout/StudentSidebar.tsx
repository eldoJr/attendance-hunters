import React, { useState } from 'react';
import { BarChart3, Target, Trophy, User, Calendar, BookOpen } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useAppStore } from '../../store';

interface StudentSidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ isMobileOpen = false, setIsMobileOpen }) => {
  const [activeItem, setActiveItem] = useState(window.location.pathname);
  const { addNotification } = useAppStore();

  const mainMenuItems = [
    { name: 'Dashboard', path: '/student-dashboard', icon: BarChart3, badge: null },
    { name: 'My Attendance', path: '/attendance', icon: Target, badge: null },
    { name: 'My Classes', path: '/classes', icon: BookOpen, badge: null },
    { name: 'Schedule', path: '/calendar', icon: Calendar, badge: null },
  ];

  const academicItems = [
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, badge: null },
    { name: 'Profile', path: '/profile', icon: User, badge: null },
  ];

  const handleItemClick = (path: string) => {
    setActiveItem(path);
    setIsMobileOpen?.(false);
    addNotification({ message: `Navigated to ${path.replace('/', '').replace('-', ' ')}`, type: 'info' });
  };

  const renderMenuGroup = (title: string, items: any[]) => (
    <div className="mb-6">
      <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.path;
          return (
            <a
              key={item.path}
              href={item.path}
              onClick={() => handleItemClick(item.path)}
              className={`group flex items-center justify-between px-3 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-primary-foreground' : 'group-hover:text-foreground'
                }`} />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <Badge 
                  variant={item.badge === 'Live' ? 'default' : 'secondary'} 
                  className={`text-xs px-1.5 py-0.5 ${
                    item.badge === 'Live' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse' 
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30" 
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-16 md:top-0 inset-y-0 left-0 z-30 md:z-auto
        w-64 md:w-56
        bg-background/95 backdrop-blur-sm border-r border-border/50
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        max-h-screen overflow-hidden
      `}>
        <div className="h-full flex flex-col">
          <nav className="flex-1 p-3 md:p-4 overflow-y-auto pt-4 md:pt-6">
            {renderMenuGroup('Main', mainMenuItems)}
            {renderMenuGroup('Academic', academicItems)}
          </nav>
          <div className="p-3 md:p-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Academic Year 2024-25</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};