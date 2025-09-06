import React, { useState } from 'react';
import { ROUTES } from '../../constants';
import { BarChart3, GraduationCap, FileText, Trophy, Settings, Users, Target, UserCheck, Building2, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useAppStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState(window.location.pathname);
  const { addNotification } = useAppStore();
  const { user } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: BarChart3, badge: null },
        { name: 'Attendance', path: ROUTES.ATTENDANCE, icon: Target, badge: null },
        { name: 'Classes', path: ROUTES.CLASSES, icon: GraduationCap, badge: null },
        { name: 'Students', path: '/students', icon: Users, badge: null },
        { name: 'Faculty', path: '/faculty', icon: UserCheck, badge: null },
        { name: 'Departments', path: '/departments', icon: Building2, badge: null },
        { name: 'Calendar', path: '/calendar', icon: Calendar, badge: null },
      ];
    } else if (user?.role === 'staff') {
      return [
        { name: 'Dashboard', path: '/staff-dashboard', icon: BarChart3, badge: null },
        { name: 'Attendance', path: ROUTES.ATTENDANCE, icon: Target, badge: null },
        { name: 'Classes', path: ROUTES.CLASSES, icon: GraduationCap, badge: null },
        { name: 'Reports', path: ROUTES.REPORTS, icon: FileText, badge: null },
      ];
    } else if (user?.role === 'student') {
      return [
        { name: 'Dashboard', path: '/student-dashboard', icon: BarChart3, badge: null },
        { name: 'Attendance', path: ROUTES.ATTENDANCE, icon: Target, badge: null },
        { name: 'Leaderboard', path: ROUTES.LEADERBOARD, icon: Trophy, badge: null },
      ];
    }
    return [];
  };

  const mainMenuItems = getMenuItems();

  const analyticsItems = user?.role === 'admin' ? [
    { name: 'Reports', path: ROUTES.REPORTS, icon: FileText, badge: null },
    { name: 'Leaderboard', path: ROUTES.LEADERBOARD, icon: Trophy, badge: null },
  ] : [];

  const systemItems = [
    { name: 'Settings', path: ROUTES.SETTINGS, icon: Settings, badge: null },
  ];

  const handleItemClick = (path: string) => {
    setActiveItem(path);
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
              className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-primary-foreground' : 'group-hover:text-foreground'
                }`} />
                <span>{item.name}</span>
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
    <aside className="w-64 bg-background/95 backdrop-blur-sm border-r border-border/50">
      <div className="h-full flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto pt-6">
          {renderMenuGroup('Main', mainMenuItems)}
          {analyticsItems.length > 0 && renderMenuGroup('Analytics', analyticsItems)}
          {user?.role === 'admin' && renderMenuGroup('System', systemItems)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Academic Year</p>
            {/* Dynamic year */}
          </div>
        </div>
      </div>
    </aside>
  );
};