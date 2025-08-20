import { useLocation } from "wouter";
import { 
  Home, 
  Building2, 
  MessageSquare, 
  Calendar, 
  User
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Dashboard", path: "/app" },
  { icon: Building2, label: "Properties", path: "/app/properties" },
  { icon: MessageSquare, label: "Messages", path: "/app/messages" },
  { icon: Calendar, label: "Schedule", path: "/app/schedule" },
  { icon: User, label: "Profile", path: "/app/profile" }
];

export default function TabBar() {
  const [location, navigate] = useLocation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  
  // Determine active tab based on current location
  useEffect(() => {
    const pathSegments = location.split("/");
    const appPath = pathSegments[2] || ""; // Get the segment after /app/
    const pathToTabIndex = {
      "": 0, // /app
      "properties": 1, // /app/properties
      "messages": 2, // /app/messages
      "schedule": 3, // /app/schedule
      "profile": 4 // /app/profile
    } as Record<string, number>;
    
    // Only update if we're on a main tab path 
    // (not for nested routes like property details)
    if (location.startsWith("/app") && pathToTabIndex[appPath] !== undefined) {
      setActiveTabIndex(pathToTabIndex[appPath]);
    }
  }, [location]);
  
  // Handle tab click
  const handleTabClick = useCallback((path: string, index: number) => {
    navigate(path);
    setActiveTabIndex(index);
  }, [navigate]);
  
  // Calculate indicator position
  const indicatorPosition = useMemo(() => {
    return `${activeTabIndex * 100}%`;
  }, [activeTabIndex]);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card ios-blur shadow-lg border-t border-border max-w-md mx-auto">
      <div className="relative">
        {/* Animated indicator */}
        <motion.div 
          className="absolute h-1 w-1/5 bg-primary rounded-full top-0 tab-indicator"
          animate={{ x: indicatorPosition }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        
        {/* Tabs */}
        <div className="flex justify-between px-2">
          {tabs.map((tab, index) => {
            const isActive = activeTabIndex === index;
            const Icon = tab.icon;
            
            return (
              <button 
                key={tab.path}
                className="py-3 px-2 flex flex-col items-center justify-center w-1/5 relative z-10"
                onClick={() => handleTabClick(tab.path, index)}
              >
                <Icon 
                  size={20} 
                  className={isActive ? "text-primary" : "text-muted-foreground"}
                />
                <span 
                  className={`text-xs mt-1 ${
                    isActive ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
