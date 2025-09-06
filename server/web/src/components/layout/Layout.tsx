import React from 'react';
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
  
  const renderSidebar = () => {
    switch (user?.role) {
      case 'student':
        return <StudentSidebar />;
      case 'staff':
        return <StaffSidebar />;
      case 'admin':
      default:
        return <Sidebar />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        {renderSidebar()}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
          <div className="p-6 lg:p-8">
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