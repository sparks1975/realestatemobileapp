import { Route, Switch } from "wouter";
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

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex flex-col h-full max-w-md mx-auto relative overflow-hidden bg-background text-foreground">
        <div className="flex-1 overflow-auto pb-20">
          <Switch>
            <Route path="/" component={Dashboard} />
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
