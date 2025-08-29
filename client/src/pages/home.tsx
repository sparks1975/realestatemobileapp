import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { HomePageSkeleton } from "@/components/SkeletonLoader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";


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
  const [isThemeApplied, setIsThemeApplied] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: true,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true
  });

  // Load communities
  const { data: communities = [], isLoading: communitiesLoading } = useQuery({
    queryKey: ['/api/communities'],
    queryFn: async () => {
      const response = await fetch('/api/communities');
      if (!response.ok) throw new Error('Failed to fetch communities');
      return response.json();
    }
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
      root.style.setProperty('--section-background-color', settings.sectionBackgroundColor || '#f8f8f8');
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
      let loadedFontsCount = 0;
      const totalFontsToLoad = Array.from(fontsToLoad).filter(font => font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)).length;
      
      // If no fonts to load, mark as loaded
      if (totalFontsToLoad === 0) {
        setFontsLoaded(true);
      }
      
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
            loadedFontsCount++;
            
            // Wait for font to actually be applied by the browser
            setTimeout(() => {
              if (loadedFontsCount >= totalFontsToLoad) {
                console.log('🎉 All fonts loaded successfully');
                setFontsLoaded(true);
              }
            }, 200);
          };
          link.onerror = () => {
            console.error('❌ Failed to load font:', font);
            loadedFontsCount++;
            if (loadedFontsCount >= totalFontsToLoad) {
              setFontsLoaded(true);
            }
          };
        } else {
          console.log('🔤 Font already loaded or is Inter:', font);
        }
      });
      
      // Mark theme as applied immediately since we're tracking fonts separately
      setIsThemeApplied(true);
    } else {
      console.log('⚠️ No theme settings to apply');
      setIsThemeApplied(true);
      setFontsLoaded(true); // No fonts to load
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  // Hide skeleton after minimum duration and when all data and fonts are loaded
  useEffect(() => {
    // Check if we have actual content data, not just empty objects
    const hasRealContent = pageContent && Object.keys(pageContent).length > 0;
    const hasRealProperties = properties && properties.length > 0;
    const hasRealCommunities = communities && communities.length > 0;
    
    // Log current state for debugging
    console.log('🔍 Skeleton conditions check:', {
      isLoading,
      communitiesLoading,
      hasThemeSettings: !!themeSettings,
      hasRealContent,
      hasRealProperties,
      hasRealCommunities,
      isThemeApplied,
      fontsLoaded
    });
    
    if (!isLoading && !communitiesLoading && themeSettings && hasRealContent && hasRealProperties && hasRealCommunities && isThemeApplied && fontsLoaded) {
      console.log('🎯 All conditions met with real content, hiding skeleton');
      setShowSkeleton(false);
    }
  }, [isLoading, communitiesLoading, themeSettings, pageContent, properties, communities, isThemeApplied, fontsLoaded]);

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

  // Check if we have actual content data, not just empty objects
  const hasRealContent = pageContent && Object.keys(pageContent).length > 0;
  const hasRealProperties = properties && properties.length > 0;
  const hasRealCommunities = communities && communities.length > 0;
  
  // Show skeleton loader while data is loading, theme is not applied, fonts not loaded, or real content not available
  const isDataLoading = isLoading || communitiesLoading || !themeSettings || !hasRealContent || !hasRealProperties || !hasRealCommunities || !isThemeApplied || !fontsLoaded;
  
  if (showSkeleton || isDataLoading) {
    return <HomePageSkeleton />;
  }

  return (
    <div id="home" className="agent-website min-h-screen dynamic-content" style={{ backgroundColor: 'var(--section-background-color)' }} data-theme-managed>
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero Section - Inspired by Kumara */}
      <section className="relative h-screen dynamic-content" data-theme-managed>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${pageContent?.hero?.image || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&h=1080'}')`
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
      <section className="py-24 dynamic-content" style={{ backgroundColor: 'var(--section-background-color)' }} data-theme-managed>
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
                  className="text-4xl md:text-5xl leading-tight mb-6"
                  style={{ 
                    color: 'var(--text-color)', 
                    fontFamily: 'var(--heading-font)', 
                    fontWeight: 'var(--heading-font-weight)' 
                  }}
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
                    borderColor: 'var(--secondary-color)', 
                    color: 'var(--secondary-color)',
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
      <section className="py-16" style={{ backgroundColor: 'var(--section-background-color)' }}>
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
      <section className="py-24" style={{ backgroundColor: 'var(--section-background-color)' }}>
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
                      <div className="text-lg mb-2 card-title">
                        {property.title}
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
      <section className="py-24" style={{ backgroundColor: 'var(--section-background-color)' }}>
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
            {communitiesLoading ? (
              // Loading state
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-80 rounded" />
              ))
            ) : (
              communities.map((community: any) => (
                <div 
                  key={community.id} 
                  className="group cursor-pointer block"
                >
                  <div className="relative overflow-hidden mb-4">
                    <img 
                      src={community.image}
                      alt={community.name}
                      className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-6 text-white"
                      style={{
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                      }}
                    >
                      <div className="text-lg mb-2 card-title">
                        {community.name}
                      </div>
                      <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
                        {community.location}
                      </div>
                      <div className="text-2xl font-light">
                        {community.priceRange}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
      <section className="py-24" style={{ backgroundColor: 'var(--section-background-color)' }}>
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

      <Footer />
    </div>
  );
}