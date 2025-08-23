import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Menu, X, Search, Filter, Grid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/SkeletonLoader";

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  type: string;
  status: string;
  mainImage?: string;
  images: string[];
  features: string[];
}

export default function PropertiesModernLuxury() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isThemeApplied, setIsThemeApplied] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  // Load properties
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
  });

  // Apply theme settings
  const applyThemeSettings = (settings: any) => {
    if (settings) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', settings.primaryColor);
      root.style.setProperty('--secondary-color', settings.secondaryColor);
      root.style.setProperty('--tertiary-color', settings.tertiaryColor);
      root.style.setProperty('--text-color', settings.textColor);
      root.style.setProperty('--link-color', settings.linkColor);
      root.style.setProperty('--link-hover-color', settings.linkHoverColor);
      root.style.setProperty('--navigation-color', settings.navigationColor || '#1a1a1a');
      root.style.setProperty('--sub-navigation-color', settings.subNavigationColor || '#2a2a2a');
      root.style.setProperty('--header-background-color', settings.headerBackgroundColor || '#ffffff');
      root.style.setProperty('--heading-font', settings.headingFont || 'Inter');
      root.style.setProperty('--body-font', settings.bodyFont || 'Inter');
      root.style.setProperty('--button-font', settings.buttonFont || 'Inter');
      root.style.setProperty('--heading-font-weight', settings.headingFontWeight || '600');
      root.style.setProperty('--body-font-weight', settings.bodyFontWeight || '400');
      root.style.setProperty('--button-font-weight', settings.buttonFontWeight || '500');

      // Load Google Fonts
      const fontsToLoad = new Set([settings.headingFont, settings.bodyFont, settings.buttonFont]);
      let loadedFontsCount = 0;
      const totalFontsToLoad = Array.from(fontsToLoad).filter(font => font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)).length;
      
      if (totalFontsToLoad === 0) {
        setFontsLoaded(true);
      }
      
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          
          link.onload = () => {
            loadedFontsCount++;
            setTimeout(() => {
              if (loadedFontsCount >= totalFontsToLoad) {
                setFontsLoaded(true);
              }
            }, 200);
          };
          link.onerror = () => {
            loadedFontsCount++;
            if (loadedFontsCount >= totalFontsToLoad) {
              setFontsLoaded(true);
            }
          };
        }
      });
      
      setIsThemeApplied(true);
    } else {
      setIsThemeApplied(true);
      setFontsLoaded(true);
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  useEffect(() => {
    const hasRealProperties = properties && properties.length > 0;
    
    if (!isLoading && themeSettings && hasRealProperties && isThemeApplied && fontsLoaded) {
      setShowSkeleton(false);
    }
  }, [isLoading, themeSettings, properties, isThemeApplied, fontsLoaded]);

  // Filter properties based on search and filter criteria
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const hasRealProperties = properties && properties.length > 0;
  const isDataLoading = isLoading || !themeSettings || !hasRealProperties || !isThemeApplied || !fontsLoaded;
  
  if (showSkeleton || isDataLoading) {
    return (
      <div className="properties-page min-h-screen bg-gray-50">
        <div className="fixed top-0 w-full backdrop-blur-sm z-50 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="hidden md:flex items-center space-x-12">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-4 w-16" />)}
              </div>
              <div className="md:hidden">
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded overflow-hidden shadow-lg">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      {/* Navigation */}
      <nav 
        className="fixed top-0 w-full backdrop-blur-sm z-50"
        style={{ backgroundColor: 'var(--header-background-color)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div 
              className="text-2xl font-light tracking-wider"
              style={{ 
                color: 'var(--navigation-color)',
                fontFamily: 'var(--heading-font)',
                fontWeight: 'var(--heading-font-weight)'
              }}
            >
              <a href="/">LUXELEAD</a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <a 
                href="/" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ 
                  color: 'var(--navigation-color)',
                  fontFamily: 'var(--body-font)'
                }}
              >
                Home
              </a>
              <a 
                href="/properties" 
                className="text-sm uppercase tracking-wide transition-colors"
                style={{ 
                  color: 'var(--primary-color)', 
                  fontWeight: 'bold',
                  fontFamily: 'var(--body-font)'
                }}
              >
                Properties
              </a>
              <a 
                href="/agent" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ 
                  color: 'var(--navigation-color)',
                  fontFamily: 'var(--body-font)'
                }}
              >
                Agent
              </a>
              <a 
                href="/#contact" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ 
                  color: 'var(--navigation-color)',
                  fontFamily: 'var(--body-font)'
                }}
              >
                Contact
              </a>
              <a 
                href="/admin" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ 
                  color: 'var(--navigation-color)',
                  fontFamily: 'var(--body-font)'
                }}
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
        </div>

        {/* Mobile Menu */}
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
          <div className="flex flex-col h-full w-full">
            <div 
              className="flex justify-between items-center px-6 py-6 border-b border-opacity-20" 
              style={{ borderColor: 'var(--navigation-color)' }}
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
            
            <div className="flex-1 px-6 py-8">
              <div className="space-y-6">
                <a 
                  href="/" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/properties" 
                  className="block text-lg uppercase tracking-wide transition-colors"
                  style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
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
      </nav>

      {/* Hero Section - Large dramatic image like inspiration */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&h=1200"
            alt="Luxury Properties"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-6">
            <div className="max-w-4xl mx-auto">
              <p 
                className="text-sm uppercase tracking-[0.3em] mb-6 opacity-90"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                ACTIVE LISTINGS
              </p>
              <h1 
                className="text-5xl md:text-7xl leading-tight mb-8"
                style={{ 
                  fontFamily: 'var(--heading-font)',
                  fontWeight: 'var(--heading-font-weight)'
                }}
              >
                Exclusive<br />
                Properties
              </h1>
              <p 
                className="text-xl md:text-2xl opacity-90 leading-relaxed"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                Discover extraordinary homes in Austin's most prestigious neighborhoods
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-none focus:outline-none focus:border-gray-400 transition-colors"
                style={{ 
                  fontFamily: 'var(--body-font)',
                  backgroundColor: 'white'
                }}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-6 py-4 border border-gray-200 rounded-none focus:outline-none focus:border-gray-400 transition-colors bg-white"
              style={{ fontFamily: 'var(--body-font)' }}
            >
              <option value="all">All Types</option>
              <option value="house">Houses</option>
              <option value="condo">Condos</option>
              <option value="townhouse">Townhouses</option>
            </select>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-6xl mx-auto px-6">
          {filteredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <div key={property.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-white">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={property.mainImage || property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=600"}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="p-8">
                      <div className="mb-4">
                        <h3 
                          className="text-xl leading-tight mb-2"
                          style={{ 
                            color: 'var(--text-color)',
                            fontFamily: 'var(--heading-font)',
                            fontWeight: 'var(--heading-font-weight)'
                          }}
                        >
                          {property.title}
                        </h3>
                        <p 
                          className="text-sm opacity-70 flex items-center"
                          style={{ 
                            color: 'var(--text-color)',
                            fontFamily: 'var(--body-font)'
                          }}
                        >
                          <MapPin size={14} className="mr-1" />
                          {property.address}, {property.city}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="text-2xl font-light"
                          style={{ 
                            color: 'var(--text-color)',
                            fontFamily: 'var(--heading-font)'
                          }}
                        >
                          ${property.price.toLocaleString()}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="uppercase tracking-wide"
                          style={{ 
                            borderColor: 'var(--primary-color)',
                            color: 'var(--primary-color)'
                          }}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      
                      <div 
                        className="text-sm space-x-4 opacity-70"
                        style={{ 
                          color: 'var(--text-color)',
                          fontFamily: 'var(--body-font)'
                        }}
                      >
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                        <span>{property.squareFeet.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p 
                className="text-lg opacity-70"
                style={{ 
                  color: 'var(--text-color)',
                  fontFamily: 'var(--body-font)'
                }}
              >
                No properties found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div 
              className="text-3xl font-light tracking-wider mb-6"
              style={{ 
                color: 'var(--tertiary-color)',
                fontFamily: 'var(--heading-font)'
              }}
            >
              LUXELEAD
            </div>
            <p 
              className="text-sm opacity-70"
              style={{ 
                color: 'var(--tertiary-color)',
                fontFamily: 'var(--body-font)'
              }}
            >
              © 2024 LuxeLead. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}