import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import {
  NotificationToast,
  useNotifications,
} from "@/components/notification-toast";
import Dashboard from "@/pages/dashboard";
import SendCapsule from "@/pages/send-capsule";
import CapsuleList from "@/pages/capsule-list";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/send" component={SendCapsule} />
      <Route path="/capsules" component={CapsuleList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        <Navigation />
        <Router />
        <NotificationToast
          notifications={notifications}
          onDismiss={dismissNotification}
        />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

export default App;
