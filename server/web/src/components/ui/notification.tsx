import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useAppStore } from '../../store';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: { id: string; message: string; type: 'success' | 'error' | 'info' };
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case 'success': return 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-500/50';
      case 'error': return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-500/50';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-500/50';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${getBgColor()} shadow-lg animate-in slide-in-from-right-2 pointer-events-auto`}>
      {getIcon()}
      <span className="text-sm font-medium text-foreground">{notification.message}</span>
      <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};