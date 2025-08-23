import { useQuery } from '@tanstack/react-query';
import PropertiesPage from './properties-list';
import PropertiesModernLuxury from './properties-list-modern';

export default function PropertiesWrapper() {
  // Load active website theme
  const { data: activeTheme, isLoading } = useQuery({
    queryKey: ['/api/website-themes/active'],
    queryFn: async () => {
      const response = await fetch('/api/website-themes/active');
      if (!response.ok) return null; // No active theme, use default
      return response.json();
    }
  });

  // Show loading state while fetching theme
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render appropriate theme component
  if (activeTheme && activeTheme.name === 'Modern Luxury') {
    return <PropertiesModernLuxury />;
  }

  // Default to Classic Luxury theme
  return <PropertiesPage />;
}