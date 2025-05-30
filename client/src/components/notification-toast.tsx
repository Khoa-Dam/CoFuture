import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: "success" | "info" | "warning" | "error";
}

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ notifications, onDismiss }: NotificationToastProps) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800 border border-cyan-400 rounded-lg p-4 shadow-lg max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                <Check className="text-slate-900 text-sm" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">{notification.title}</div>
                <div className="text-sm text-gray-400">{notification.message}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(notification.id)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
}
