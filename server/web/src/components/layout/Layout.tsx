import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { StudentSidebar } from './StudentSidebar';
import { StaffSidebar } from './StaffSidebar';
import { Header } from './Header';
import { useAppStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { TableSkeleton } from '../ui/table-skeleton';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useAppStore();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const renderSidebar = () => {
    const sidebarProps = {
      isMobileOpen: isMobileMenuOpen,
      setIsMobileOpen: setIsMobileMenuOpen
    };
    
    switch (user?.role) {
      case 'student':
        return <StudentSidebar {...sidebarProps} />;
      case 'staff':
        return <StaffSidebar {...sidebarProps} />;
      case 'admin':
      default:
        return <Sidebar {...sidebarProps} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex h-[calc(100vh-4rem)]">
        {renderSidebar()}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
          <div className="p-4 md:pl-6 md:p-8">
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  <div className="h-8 bg-muted rounded animate-pulse" />
                  <TableSkeleton rows={8} columns={6} />
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};