import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PropertiesList from "./properties-list";
import PropertiesListModern from "./properties-list-modern";

export default function PropertiesListWrapper() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  // Load active theme
  const { data: themeData } = useQuery({
    queryKey: ['/api/website-themes/active'],
    queryFn: async () => {
      const response = await fetch('/api/website-themes/active');
      if (!response.ok) return null;
      return response.json();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (themeData?.name) {
      setActiveTheme(themeData.name);
    }
  }, [themeData]);

  // Show Modern Luxury theme
  if (activeTheme === 'Modern Luxury') {
    return <PropertiesListModern />;
  }

  // Default to Classic Luxury theme
  return <PropertiesList />;
}