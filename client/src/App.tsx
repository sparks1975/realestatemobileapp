import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import TabBar from "@/components/layout/TabBar";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import PropertyDetails from "@/pages/property-details";
import EditProperty from "@/pages/edit-property";
import Messages from "@/pages/messages";
import Schedule from "@/pages/schedule";
import Profile from "@/pages/profile";
import HomePage from "@/pages/home";
import AdminPanel from "@/pages/admin";

function App() {
  const [location] = useLocation();
  
  // Check if we're on the agent website or mobile app
  const isAgentWebsite = location === "/" || location.startsWith("/website");
  const isMobileApp = location.startsWith("/app") || (!isAgentWebsite && location !== "/");

  if (isAgentWebsite && location === "/") {
    return (
      <TooltipProvider>
        <Toaster />
        <HomePage />
      </TooltipProvider>
    );
  }

  // Admin panel
  if (location === "/admin") {
    return (
      <TooltipProvider>
        <Toaster />
        <AdminPanel />
      </TooltipProvider>
    );
  }

  // Mobile app interface
  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex flex-col h-full max-w-md mx-auto relative overflow-hidden bg-background text-foreground">
        <div className="flex-1 overflow-auto pb-20">
          <Switch>
            <Route path="/app" component={Dashboard} />
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/properties" component={Properties} />
            <Route path="/app/property-details/:id" component={PropertyDetails} />
            <Route path="/app/edit-property/:id" component={EditProperty} />
            <Route path="/app/messages" component={Messages} />
            <Route path="/app/schedule" component={Schedule} />
            <Route path="/app/profile" component={Profile} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/properties" component={Properties} />
            <Route path="/property-details/:id" component={PropertyDetails} />
            <Route path="/edit-property/:id" component={EditProperty} />
            <Route path="/messages" component={Messages} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/profile" component={Profile} />
            
            <Route component={NotFound} />
          </Switch>
        </div>
        <TabBar />
      </div>
    </TooltipProvider>
  );
}

export default App;
