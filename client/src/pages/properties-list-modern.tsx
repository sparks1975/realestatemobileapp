import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/SkeletonLoader";
import { useLocation } from "wouter";

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

export default function PropertiesListModern() {
  const [, navigate] = useLocation();
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

  // Hide skeleton after data loads
  useEffect(() => {
    const hasRealProperties = properties && properties.length > 0;
    
    if (!isLoading && themeSettings && hasRealProperties && isThemeApplied && fontsLoaded) {
      setShowSkeleton(false);
    }
  }, [isLoading, themeSettings, properties, isThemeApplied, fontsLoaded]);

  // Filter properties
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
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 w-full backdrop-blur-sm z-50 bg-white">
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
            <div className="text-center mb-16">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="relative">
                  <Skeleton className="h-80 w-full rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-sm z-50 bg-white/95">
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
                className="text-sm uppercase tracking-wide transition-colors font-bold"
                style={{ 
                  color: 'var(--primary-color)',
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
                href="/app" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ 
                  color: 'var(--navigation-color)',
                  fontFamily: 'var(--body-font)'
                }}
              >
                Mobile App
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
          style={{ backgroundColor: 'var(--header-background-color)' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-6 py-6 border-b border-opacity-20"
                 style={{ borderColor: 'var(--navigation-color)' }}>
              <div 
                className="text-xl font-light tracking-wider"
                style={{ 
                  color: 'var(--navigation-color)',
                  fontFamily: 'var(--heading-font)'
                }}
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
                  style={{ 
                    color: 'var(--navigation-color)',
                    fontFamily: 'var(--body-font)'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/properties" 
                  className="block text-lg uppercase tracking-wide transition-colors font-bold"
                  style={{ 
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--body-font)'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Properties
                </a>
                <a 
                  href="/agent" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ 
                    color: 'var(--navigation-color)',
                    fontFamily: 'var(--body-font)'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agent
                </a>
                <a 
                  href="/#contact" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ 
                    color: 'var(--navigation-color)',
                    fontFamily: 'var(--body-font)'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <a 
                  href="/app" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ 
                    color: 'var(--navigation-color)',
                    fontFamily: 'var(--body-font)'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mobile App
                </a>
                <a 
                  href="/admin" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ 
                    color: 'var(--navigation-color)',
                    fontFamily: 'var(--body-font)'
                  }}
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

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-6 opacity-60"
            style={{ 
              color: 'var(--text-color)',
              fontFamily: 'var(--body-font)'
            }}
          >
            ACTIVE LISTINGS
          </p>
          <h1 
            className="text-5xl md:text-7xl leading-tight mb-8"
            style={{ 
              color: 'var(--text-color)',
              fontFamily: 'var(--heading-font)',
              fontWeight: 'var(--heading-font-weight)'
            }}
          >
            Exceptional<br />
            Properties
          </h1>
          <p 
            className="text-lg leading-relaxed max-w-2xl mx-auto opacity-80"
            style={{ 
              color: 'var(--text-color)',
              fontFamily: 'var(--body-font)'
            }}
          >
            Discover our curated collection of luxury real estate opportunities across Austin's most desirable neighborhoods.
          </p>
        </div>
      </section>

      {/* Property Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout matching design reference */}
          <div className="grid md:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <div 
                key={property.id} 
                className={`relative cursor-pointer group ${
                  index === 3 || index === 4 ? 'md:col-span-1' : // First row bottom cards
                  index === 5 ? 'md:col-span-2' : // Large card in second row
                  index === 6 ? 'md:col-span-1' : // Small card in second row
                  'md:col-span-1'
                }`}
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className={`relative overflow-hidden rounded-lg ${
                  index === 5 ? 'h-96' : 'h-80'
                }`}>
                  <img 
                    src={property.mainImage || property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=600"}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Badge */}
                  {property.status && (
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className="text-xs px-3 py-1 bg-white/90 text-black border-0"
                        style={{ fontFamily: 'var(--body-font)' }}
                      >
                        {property.status.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Property Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 
                      className="text-xl font-medium mb-2"
                      style={{ 
                        fontFamily: 'var(--heading-font)',
                        fontWeight: 'var(--heading-font-weight)'
                      }}
                    >
                      {property.title}
                    </h3>
                    <p 
                      className="text-sm opacity-90 mb-3"
                      style={{ fontFamily: 'var(--body-font)' }}
                    >
                      {property.city}, {property.state}
                    </p>
                    <div 
                      className="text-2xl font-light"
                      style={{ 
                        fontFamily: 'var(--heading-font)',
                        fontWeight: '300'
                      }}
                    >
                      {formatPrice(property.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Section */}
          {filteredProperties.length > 9 && (
            <div className="text-center mt-16">
              <button 
                className="text-sm uppercase tracking-[0.2em] px-8 py-3 border transition-colors hover:bg-black hover:text-white"
                style={{ 
                  color: 'var(--text-color)',
                  borderColor: 'var(--text-color)',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 
            className="text-4xl md:text-5xl font-light mb-6"
            style={{ 
              fontFamily: 'var(--heading-font)',
              fontWeight: '300'
            }}
          >
            Stay Informed
          </h2>
          <p 
            className="text-lg opacity-80 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'var(--body-font)' }}
          >
            Subscribe to receive exclusive property listings and market insights directly to your inbox.
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white"
              style={{ fontFamily: 'var(--body-font)' }}
            />
            <button 
              className="px-8 py-3 bg-white text-black hover:bg-gray-100 transition-colors"
              style={{ 
                fontFamily: 'var(--button-font)',
                fontWeight: 'var(--button-font-weight)'
              }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}