import { useQuery } from "@tanstack/react-query";
import PropertyDetailPage from './property-detail';
import PropertyDetailModern from './property-detail-modern';

export default function PropertyDetailWrapper() {
  // Load active theme
  const { data: activeTheme } = useQuery({
    queryKey: ['/api/website-themes/active'],
    queryFn: async () => {
      const response = await fetch('/api/website-themes/active');
      if (!response.ok) throw new Error('Failed to fetch active theme');
      return response.json();
    }
  });

  // Default to Classic Luxury theme if no theme is loaded yet
  if (!activeTheme || activeTheme.name === 'Classic Luxury') {
    return <PropertyDetailPage />;
  }

  // Use Modern Luxury theme
  return <PropertyDetailModern />;
}