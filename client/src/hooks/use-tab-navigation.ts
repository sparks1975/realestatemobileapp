import { useCallback, useEffect, useState } from "react";
import { useLocation } from "wouter";

export type TabRoute = {
  path: string;
  label: string;
};

export function useTabNavigation(tabs: TabRoute[]) {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  
  // Set active tab based on current location
  useEffect(() => {
    const currentPath = location.split("/")[1] || "/";
    const index = tabs.findIndex(tab => {
      // Handle root path special case
      if (tab.path === "/" && currentPath === "/") {
        return true;
      }
      
      // For other paths check if the current path starts with tab path
      return currentPath.startsWith(tab.path.replace("/", ""));
    });
    
    if (index !== -1) {
      setActiveTab(index);
    }
  }, [location, tabs]);
  
  // Navigate to tab
  const goToTab = useCallback((index: number) => {
    if (index >= 0 && index < tabs.length) {
      navigate(tabs[index].path);
      setActiveTab(index);
    }
  }, [navigate, tabs]);
  
  return {
    activeTab,
    goToTab
  };
}
