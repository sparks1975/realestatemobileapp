import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import TabBar from "@/components/layout/TabBar";
import Dashboard from "@/pages/dashboard";
import Properties from "@/pages/properties";
import PropertiesListWrapper from "@/pages/properties-list-wrapper";
import PropertyDetails from "@/pages/property-details";
import EditProperty from "@/pages/edit-property";
import Messages from "@/pages/messages";
import Schedule from "@/pages/schedule";
import Profile from "@/pages/profile";
import HomeWrapper from "@/pages/home-wrapper";
import AdminPanel from "@/pages/admin";
import PropertyDetailWrapper from "@/pages/property-detail-wrapper";
import AgentPage from "@/pages/agent";
import ContactPage from "@/pages/contact";

function App() {
  const [location] = useLocation();
  
  // Check if we're on the agent website or mobile app
  const isAgentWebsite = location === "/" || location.startsWith("/website") || location.startsWith("/property/") || location === "/properties" || location === "/agent" || location === "/contact";
  const isMobileApp = location.startsWith("/app") || (!isAgentWebsite && location !== "/" && !location.startsWith("/property/") && !location.startsWith("/admin") && location !== "/properties" && location !== "/agent" && location !== "/contact");

  if (isAgentWebsite && location === "/") {
    return (
      <TooltipProvider>
        <Toaster />
        <HomeWrapper />
      </TooltipProvider>
    );
  }

  // Properties list page
  if (location === "/properties") {
    return (
      <TooltipProvider>
        <Toaster />
        <PropertiesListWrapper />
      </TooltipProvider>
    );
  }

  // Agent page
  if (location === "/agent") {
    return (
      <TooltipProvider>
        <Toaster />
        <AgentPage />
      </TooltipProvider>
    );
  }

  // Contact page
  if (location === "/contact") {
    return (
      <TooltipProvider>
        <Toaster />
        <ContactPage />
      </TooltipProvider>
    );
  }

  // Property detail pages
  if (location.startsWith("/property/")) {
    return (
      <TooltipProvider>
        <Toaster />
        <PropertyDetailWrapper />
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
