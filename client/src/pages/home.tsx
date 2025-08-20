import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  lotSize?: number;
  yearBuilt?: number;
  parkingSpaces?: string;
  description: string;
  type: string;
  status: string;
  mainImage?: string;
  images: string[];
  features: string[];
  listedById: number;
  createdAt: string;
}

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: true,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true
  });

  // Load theme settings with aggressive cache busting
  const { data: themeSettings, refetch: refetchTheme } = useQuery({
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

  // Load page content from database
  const { data: pageContent = {}, refetch: refetchPageContent } = useQuery({
    queryKey: ['/api/pages/home/content'],
    queryFn: async () => {
      const response = await fetch(`/api/pages/home/content?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to fetch page content');
      const contentArray = await response.json();
      
      // Convert array to object structure for easier access
      const contentObj: any = {};
      contentArray.forEach((item: any) => {
        if (!contentObj[item.sectionName]) {
          contentObj[item.sectionName] = {};
        }
        contentObj[item.sectionName][item.contentKey] = item.contentValue;
      });
      return contentObj;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true
  });

  // Apply theme settings to CSS variables
  const applyThemeSettings = (settings: any) => {
    if (settings) {
      console.log('🎨 Applying theme settings:', settings);
      const root = document.documentElement;
      
      // Set CSS variables with debugging
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

      // Debug: Check if variables were actually set
      console.log('🔍 CSS Variables set:', {
        '--primary-color': root.style.getPropertyValue('--primary-color'),
        '--link-color': root.style.getPropertyValue('--link-color'),
        '--text-color': root.style.getPropertyValue('--text-color'),
        '--navigation-color': root.style.getPropertyValue('--navigation-color'),
        '--sub-navigation-color': root.style.getPropertyValue('--sub-navigation-color'),
        '--header-background-color': root.style.getPropertyValue('--header-background-color'),
        '--heading-font': root.style.getPropertyValue('--heading-font'),
        '--body-font': root.style.getPropertyValue('--body-font'),
        '--button-font': root.style.getPropertyValue('--button-font'),
        '--heading-font-weight': root.style.getPropertyValue('--heading-font-weight'),
        '--body-font-weight': root.style.getPropertyValue('--body-font-weight'),
        '--button-font-weight': root.style.getPropertyValue('--button-font-weight')
      });

      // Load Google Fonts dynamically with all font weights
      const fontsToLoad = new Set([settings.headingFont, settings.bodyFont, settings.buttonFont]);
      
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          console.log('🔤 Loading font:', font, 'URL:', fontUrl);
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          
          // Add load event listener to verify font loading
          link.onload = () => {
            console.log('✅ Font loaded successfully:', font);
            // Force a re-render by updating a state or triggering a style recalculation
            document.documentElement.style.setProperty('--font-load-trigger', Math.random().toString());
          };
          link.onerror = () => {
            console.error('❌ Failed to load font:', font);
          };
        } else {
          console.log('🔤 Font already loaded or is Inter:', font);
        }
      });
    } else {
      console.log('⚠️ No theme settings to apply');
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  // Listen for theme updates from admin panel
  useEffect(() => {
    const handleThemeUpdate = (event: any) => {
      console.log('🎨 Theme update event received:', event.detail);
      // Force refetch theme settings
      refetchTheme();
    };

    window.addEventListener('theme-updated', handleThemeUpdate);
    return () => window.removeEventListener('theme-updated', handleThemeUpdate);
  }, [refetchTheme]);

  const featuredProperties = properties.slice(0, 6);
  const currentInventory = properties.slice(0, 3);

  return (
    <div id="home" className="agent-website min-h-screen dynamic-content" style={{ backgroundColor: 'var(--tertiary-color)' }} data-theme-managed>
      {/* Navigation */}
      <nav 
        className="fixed top-0 w-full backdrop-blur-sm z-50"
        style={{ backgroundColor: 'var(--header-background-color)' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div 
              className="text-2xl font-light tracking-wider"
              style={{ color: 'var(--navigation-color)' }}
            >
              LUXELEAD
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <a 
                href="#home" 
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
                href="#contact" 
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
                  href="#home" 
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
                  href="#contact" 
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
      </nav>

      {/* Hero Section - Inspired by Kumara */}
      <section className="relative h-screen dynamic-content" data-theme-managed>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&h=1080')`
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="relative z-10 h-full flex items-end">
          <div className="w-full max-w-[1200px] mx-auto px-6 pb-24">
            <div className="max-w-2xl">
              <p 
                className="text-sm uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--tertiary-color)' }}
              >
                {pageContent?.hero?.subheadline || "Austin's #1 Luxury Realtor"}
              </p>
              <h1 
                className="text-5xl md:text-7xl mb-8 leading-tight hero-heading"
                style={{ 
                  color: 'var(--tertiary-color)'
                }}
              >
{pageContent?.hero?.headline ? (
                  pageContent.hero.headline.split('\n').map((line: string, index: number) => (
                    <span key={index}>
                      {line}
                      {index < pageContent.hero.headline.split('\n').length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <>
                    Exceptional<br />
                    Properties<br />
                    Await
                  </>
                )}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section - About LuxeLead */}
      <section className="py-24 dynamic-content" style={{ backgroundColor: 'var(--tertiary-color)' }} data-theme-managed>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p 
                  className="text-sm uppercase tracking-[0.2em] mb-4"
                  style={{ color: 'var(--secondary-color)' }}
                >
                  {pageContent?.about?.subtitle || "About LuxeLead"}
                </p>
                <h2 
                  className="text-4xl md:text-5xl font-light leading-tight mb-6"
                  style={{ color: 'var(--text-color)' }}
                >
                  {pageContent?.about?.title ? (
                    pageContent.about.title.split('\n').map((line: string, index: number) => (
                      <span key={index}>
                        {line}
                        {index < pageContent.about.title.split('\n').length - 1 && <br />}
                      </span>
                    ))
                  ) : (
                    <>
                      Expert<br />
                      Real Estate<br />
                      Guidance
                    </>
                  )}
                </h2>
                <p 
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: 'var(--text-color)' }}
                >
                  {pageContent?.about?.description || "With over a decade of experience in Austin's luxury real estate market, we provide unparalleled expertise and personalized service to help you find your perfect home or investment opportunity."}
                </p>
                <Button 
                  variant="outline" 
                  className="uppercase tracking-wide border-2 px-8 py-3 hover:bg-opacity-10"
                  style={{ 
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--primary-color)',
                    backgroundColor: 'transparent'
                  }}
                >
                  {pageContent?.about?.buttonText || "Learn More"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src={pageContent?.about?.image1 || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=500"}
                  alt="Luxury Interior"
                  className="w-full h-64 object-cover"
                />
                <img 
                  src={pageContent?.about?.image2 || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&h=300"}
                  alt="Modern Kitchen"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src={pageContent?.about?.image3 || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=300"}
                  alt="Living Room"
                  className="w-full h-48 object-cover"
                />
                <img 
                  src={pageContent?.about?.image4 || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&h=500"}
                  alt="Master Bedroom"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-light tracking-wider">SOTHEBY'S</div>
            <div className="text-2xl font-light tracking-wider">CHRISTIE'S</div>
            <div className="text-2xl font-light tracking-wider">COMPASS</div>
            <div className="text-2xl font-light tracking-wider">COLDWELL</div>
            <div className="text-2xl font-light tracking-wider">KELLER</div>
          </div>
        </div>
      </section>

      {/* Current Inventory */}
      <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--tertiary-color)' }}
            >
              {pageContent?.['featured-properties']?.subtitle || "LuxeLead's Current Inventory"}
            </p>
            <h2 
              className="text-4xl md:text-5xl font-light leading-tight"
              style={{ color: 'var(--tertiary-color)' }}
            >
              {pageContent?.['featured-properties']?.title || "Featured Properties"}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700 h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {currentInventory.map((property) => (
                <a 
                  key={property.id} 
                  href={`/property/${property.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative overflow-hidden mb-4">
                    <img 
                      src={property.images?.[0] || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400`}
                      alt={property.title}
                      className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-6 text-white"
                      style={{
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                      }}
                    >
                      <div className="text-sm uppercase tracking-wide mb-2">
                        {property.address}
                      </div>
                      <div className="text-2xl font-light">
                        ${property.price?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a href="/properties">
              <Button 
                variant="outline" 
                className="uppercase tracking-wide border-2 px-8 py-3"
                style={{ 
                  borderColor: 'var(--tertiary-color)', 
                  color: 'var(--tertiary-color)' 
                }}
              >
                View Additional
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section 
        className="py-24"
        style={{ backgroundColor: '#E5D5C8' }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--secondary-color)' }}
            >
              {pageContent?.newsletter?.subtitle || "View Spotlight"}
            </p>
            <h2 
              className="text-4xl md:text-5xl font-light leading-tight mb-8"
              style={{ color: 'var(--text-color)' }}
            >
              {pageContent?.newsletter?.title || "Stay Updated on the First to Know"}
            </h2>
            <div className="max-w-md mx-auto">
              <div className="flex h-12 gap-3">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="flex-1 px-6 h-12 text-center bg-transparent border border-gray-400 focus:outline-none focus:border-gray-600"
                  style={{ color: 'var(--text-color)' }}
                />
                <Button 
                  className="px-8 h-12 text-white uppercase tracking-wide border-0"
                  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--secondary-color)' }}
            >
              {pageContent?.communities?.subtitle || "Featured Communities"}
            </p>
            <h2 
              className="text-4xl md:text-5xl font-light leading-tight"
              style={{ color: 'var(--text-color)' }}
            >
              {pageContent?.communities?.title || "The Advisor"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProperties.slice(0, 3).map((property) => (
              <a 
                key={property.id} 
                href={`/property/${property.id}`}
                className="group cursor-pointer block"
              >
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src={property.images?.[0] || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400`}
                    alt={property.title}
                    className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div 
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    style={{
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                    }}
                  >
                    <div className="text-lg font-light mb-2" style={{ 
                      color: 'white', 
                      backgroundColor: 'red',
                      padding: '4px',
                      border: '2px solid yellow',
                      zIndex: 1000,
                      position: 'relative'
                    }}>
                      TITLE: {property.title || 'NO TITLE FOUND'}
                    </div>
                    <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
                      {property.address}
                    </div>
                    <div className="text-2xl font-light">
                      ${property.price?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="uppercase tracking-wide border-2 px-8 py-3 hover:bg-opacity-10"
              style={{ 
                borderColor: 'var(--secondary-color)', 
                color: 'var(--secondary-color)',
                backgroundColor: 'transparent'
              }}
            >
              View Additional
            </Button>
          </div>
        </div>
      </section>

      {/* Agent Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=700"
                alt="LuxeLead Agent"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <p 
                className="text-sm uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--tertiary-color)' }}
              >
                LuxeLead
              </p>
              <h2 
                className="text-4xl md:text-5xl font-light leading-tight mb-6"
                style={{ color: 'var(--tertiary-color)' }}
              >
                Alex Rodriguez
              </h2>
              <p 
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'var(--tertiary-color)' }}
              >
                With over 15 years of experience in Austin's luxury real estate market, 
                Alex brings unparalleled expertise and a passion for exceptional service 
                to every client relationship.
              </p>
              <div className="flex space-x-6 mb-8">
                <div className="text-center">
                  <div 
                    className="text-3xl font-light mb-2"
                    style={{ color: 'var(--tertiary-color)' }}
                  >
                    500+
                  </div>
                  <div 
                    className="text-sm uppercase tracking-wide"
                    style={{ color: 'var(--tertiary-color)' }}
                  >
                    Properties Sold
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-3xl font-light mb-2"
                    style={{ color: 'var(--tertiary-color)' }}
                  >
                    $2.5B
                  </div>
                  <div 
                    className="text-sm uppercase tracking-wide"
                    style={{ color: 'var(--tertiary-color)' }}
                  >
                    Total Sales
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="uppercase tracking-wide border-2 px-8 py-3"
                style={{ 
                  borderColor: 'var(--tertiary-color)', 
                  color: 'var(--tertiary-color)' 
                }}
              >
                Contact Alex
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <div 
              className="text-3xl font-light mb-8 tracking-wider"
              style={{ color: 'var(--text-color)' }}
            >
              LUXELEAD
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
                href="#" 
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
    </div>
  );
}