import { useQuery } from "@tanstack/react-query";

export function Footer() {
  // Load theme settings
  const { data: themeSettings } = useQuery({
    queryKey: ['/api/theme-settings/1'],
    queryFn: async () => {
      const response = await fetch(`/api/theme-settings/1?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to fetch theme settings');
      return response.json();
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true
  });

  return (
    <footer className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            {themeSettings?.footerLogo && themeSettings[`${themeSettings.footerLogo}Logo`] ? (
              <img 
                src={themeSettings[`${themeSettings.footerLogo}Logo`]}
                alt="LuxeLead Logo"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div 
                className="text-3xl font-light tracking-wider"
                style={{ color: 'var(--text-color)' }}
              >
                LUXELEAD
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-8 mb-8">
            <a 
              href="/properties" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-color)' }}
            >
              Properties
            </a>
            <a 
              href="/agent" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-color)' }}
            >
              Agent
            </a>
            <a 
              href="/#contact" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-color)' }}
            >
              Contact
            </a>
            <a 
              href="/admin" 
              className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-color)' }}
            >
              Admin
            </a>
          </div>
          <div className="flex justify-center space-x-6 mb-8">
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">f</span>
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">in</span>
            </div>
            <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
              <span className="text-xs">ig</span>
            </div>
          </div>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-color)' }}
          >
            © 2024 LuxeLead. All rights reserved. Austin's premier luxury real estate professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}