import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { 
  Search, 
  Bell, 
  Plus,
  Calendar,
  Users,
  BookOpen,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  Circle,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore } from '../../store';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [quickActionDropdownOpen, setQuickActionDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { notifications, addNotification } = useAppStore();

  const closeAllDropdowns = () => {
    setUserDropdownOpen(false);
    setNotificationDropdownOpen(false);
    setQuickActionDropdownOpen(false);
    setThemeDropdownOpen(false);
    setMobileSearchOpen(false);
  };

  const notificationsList = notifications || [];

  const themeOptions = [
    { id: 'light', name: 'Light', icon: <Sun className="h-4 w-4" /> },
    { id: 'dark', name: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { id: 'system', name: 'System', icon: <Monitor className="h-4 w-4" /> }
  ] as const;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">

            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Attendance Hunters
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Academic Year 2024-25
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students, classes, or reports..."
                className="pl-10 bg-muted/50 border-0 focus:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Quick Actions - Admin Only */}
            {user?.role === 'admin' && (
              <DropdownMenu open={quickActionDropdownOpen} onOpenChange={setQuickActionDropdownOpen}>
              <DropdownMenuTrigger 
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/80 h-9 px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  if (quickActionDropdownOpen) {
                    setQuickActionDropdownOpen(false);
                  } else {
                    closeAllDropdowns();
                    setQuickActionDropdownOpen(true);
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Add</span>
              </DropdownMenuTrigger>
              {quickActionDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
                  <DropdownMenuContent className="w-48 z-50 bg-background dark:bg-background border-border dark:border-border shadow-lg">
                    <DropdownMenuItem 
                      onClick={() => {
                        closeAllDropdowns();
                        // Add student action
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Add Student
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        closeAllDropdowns();
                        // Create class action
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create Class
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        closeAllDropdowns();
                        // Schedule session action
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </>
              )}
              </DropdownMenu>
            )}

            {/* Notifications */}
            <DropdownMenu open={notificationDropdownOpen} onOpenChange={setNotificationDropdownOpen}>
              <DropdownMenuTrigger 
                className="relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/80 h-9 px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  if (notificationDropdownOpen) {
                    setNotificationDropdownOpen(false);
                  } else {
                    closeAllDropdowns();
                    setNotificationDropdownOpen(true);
                  }
                }}
              >
                <Bell className={`h-4 w-4 ${notificationCount > 0 ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">Notifications</span>
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500 animate-pulse">
                    {notificationCount}
                  </Badge>
                )}
              </DropdownMenuTrigger>
              {notificationDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
                  <DropdownMenuContent className="w-80 z-50 bg-background dark:bg-background border-border dark:border-border shadow-lg">
                    <div className="p-3 border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Notifications</h4>
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                          Mark all read
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{notificationsList.length} unread</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notificationsList.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-1">No notifications</p>
                          <p className="text-xs text-muted-foreground">You're all caught up!</p>
                        </div>
                      ) : (
                        notificationsList.map((notification) => (
                          <DropdownMenuItem 
                            key={notification.id} 
                            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-2 border-l-transparent hover:border-l-primary" 
                            onClick={() => closeAllDropdowns()}
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{notification.type.toUpperCase()}</p>
                                <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground">Just now</p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                    <div className="border-t mx-1" />
                    <DropdownMenuItem 
                      className="p-3 text-center text-sm text-primary cursor-pointer hover:bg-primary/10 transition-colors font-medium" 
                      onClick={() => closeAllDropdowns()}
                    >
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </>
              )}
            </DropdownMenu>



            {/* User Menu */}
            <DropdownMenu open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
              <DropdownMenuTrigger 
                className="relative inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted/80 h-9 w-9"
                onClick={(e) => {
                  e.stopPropagation();
                  if (userDropdownOpen) {
                    setUserDropdownOpen(false);
                  } else {
                    closeAllDropdowns();
                    setUserDropdownOpen(true);
                  }
                }}
              >
                <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={closeAllDropdowns} />
                  <DropdownMenuContent className="w-64 z-50 bg-background dark:bg-background border-border dark:border-border shadow-lg">
                    <div className="p-3 border-b bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user?.role === 'admin' ? 'Admin User' : 
                             user?.role === 'staff' ? 'Staff User' : 'Eldo Macuacua'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user?.role === 'admin' ? 'admin@attendance.com' : 
                             user?.role === 'staff' ? 'staff@university.edu' : 'macuacua.eldo@university.edu'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {user?.role === 'admin' ? 'Administrator' : 
                         user?.role === 'staff' ? 'Faculty Staff' : 'Student'}
                      </Badge>
                    </div>
                    <DropdownMenuItem 
                      onClick={() => closeAllDropdowns()}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Profile Settings
                    </DropdownMenuItem>
                    <div className="relative">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setThemeDropdownOpen(!themeDropdownOpen);
                        }}
                        className="flex items-center justify-between hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center">
                          Theme
                        </div>
                        <ChevronRight className={`h-3 w-3 transition-transform ${themeDropdownOpen ? 'rotate-90' : ''}`} />
                      </DropdownMenuItem>
                      {themeDropdownOpen && (
                        <div className="absolute right-full top-0 mr-1 w-40 bg-background dark:bg-background border border-border dark:border-border rounded-lg shadow-xl z-50 py-1 animate-in slide-in-from-right-2">
                          {themeOptions.map((themeOption) => (
                            <div
                              key={themeOption.id}
                              className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => {
                                setTheme(themeOption.id);
                                setThemeDropdownOpen(false);
                              }}
                            >
                              <div className="flex items-center">
                                <span>{themeOption.name}</span>
                              </div>
                              {theme === themeOption.id ? (
                                <Circle className="h-2 w-2 fill-primary text-primary" />
                              ) : (
                                <Circle className="h-2 w-2 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <DropdownMenuItem 
                      onClick={() => {
                        closeAllDropdowns();
                        window.location.href = '/settings';
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      System Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => closeAllDropdowns()}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Help & Support
                    </DropdownMenuItem>
                    <div className="border-t mx-1" />
                    <DropdownMenuItem 
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                      onClick={() => {
                        closeAllDropdowns();
                        logout();
                        addNotification({ message: 'Logged out successfully', type: 'info' });
                      }}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </>
              )}
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 z-50 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students, classes, or reports..."
                className="pl-10 bg-muted/50 border-0 focus:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};