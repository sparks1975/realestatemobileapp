import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
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
    <nav 
      className="fixed top-0 w-full backdrop-blur-sm z-50"
      style={{ backgroundColor: 'var(--header-background-color)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/">
              {themeSettings?.headerLogo && themeSettings[`${themeSettings.headerLogo}Logo`] ? (
                <img 
                  src={themeSettings[`${themeSettings.headerLogo}Logo`]}
                  alt="LuxeLead Logo"
                  className="h-8 w-auto object-contain"
                  style={{ maxWidth: '200px' }}
                />
              ) : (
                <div 
                  className="text-2xl font-light tracking-wider"
                  style={{ color: 'var(--navigation-color)' }}
                >
                  LUXELEAD
                </div>
              )}
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <a 
              href="/#home" 
              className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
              style={{ color: 'var(--navigation-color)' }}
            >
              Home
            </a>
            <a 
              href="/properties" 
              className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
              style={{ color: 'var(--navigation-color)' }}
            >
              Properties
            </a>
            <a 
              href="/agent" 
              className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
              style={{ color: 'var(--navigation-color)' }}
            >
              Agent
            </a>
            <a 
              href="/#contact" 
              className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
              style={{ color: 'var(--navigation-color)' }}
            >
              Contact
            </a>
            <a 
              href="/app" 
              className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
              style={{ color: 'var(--navigation-color)' }}
            >
              Mobile App
            </a>
            <a 
              href="/admin" 
              className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
              style={{ color: 'var(--navigation-color)' }}
            >
              Admin
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: 'var(--navigation-color)' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Off-Canvas Menu */}
        <div 
          className={`fixed inset-y-0 right-0 w-64 transform transition-transform duration-300 ease-in-out z-50 md:hidden shadow-2xl ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ 
            backgroundColor: 'var(--header-background-color)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div 
            className="flex flex-col h-full w-full"
            style={{ backgroundColor: 'var(--header-background-color)' }}
          >
            {/* Close Button Header */}
            <div 
              className="flex justify-between items-center px-6 py-6 border-b border-opacity-20 w-full" 
              style={{ 
                borderColor: 'var(--navigation-color)',
                backgroundColor: 'var(--header-background-color)'
              }}
            >
              <div 
                className="text-xl font-light tracking-wider"
                style={{ color: 'var(--navigation-color)' }}
              >
                MENU
              </div>
              <button
                className="p-2 hover:opacity-70 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: 'var(--navigation-color)' }}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Menu Items */}
            <div 
              className="flex-1 px-6 py-8 w-full"
              style={{ backgroundColor: 'var(--header-background-color)' }}
            >
              <div className="space-y-6">
                <a 
                  href="/#home" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/properties" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Properties
                </a>
                <a 
                  href="/agent" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agent
                </a>
                <a 
                  href="/#contact" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <a 
                  href="/app" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mobile App
                </a>
                <a 
                  href="/admin" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}