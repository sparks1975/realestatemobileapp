import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award, Bed, Bath, Square, User } from "lucide-react";
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

export default function HomeTheme2() {
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
      
      // Load Google Fonts dynamically if needed
      const loadFont = (fontFamily: string) => {
        if (fontFamily && !document.querySelector(`link[href*="${fontFamily}"]`)) {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          
          link.onload = () => {
            console.log(`✓ Font loaded: ${fontFamily}`);
            setFontsLoaded(true);
          };
        } else {
          setFontsLoaded(true);
        }
      };

      // Set font families and weights
      root.style.setProperty('--heading-font', settings.headingFont || 'Inter');
      root.style.setProperty('--body-font', settings.bodyFont || 'Inter');
      root.style.setProperty('--button-font', settings.buttonFont || 'Inter');
      root.style.setProperty('--heading-font-weight', settings.headingFontWeight || '600');
      root.style.setProperty('--body-font-weight', settings.bodyFontWeight || '400');
      root.style.setProperty('--button-font-weight', settings.buttonFontWeight || '500');

      // Load fonts
      if (settings.headingFont && settings.headingFont !== 'Inter') loadFont(settings.headingFont);
      if (settings.bodyFont && settings.bodyFont !== 'Inter') loadFont(settings.bodyFont);
      if (settings.buttonFont && settings.buttonFont !== 'Inter') loadFont(settings.buttonFont);
      
      setIsThemeApplied(true);
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  // Show skeleton for 2 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get featured properties (first 3)
  const featuredProperties = properties.slice(0, 3);
  
  // Get featured communities (first 3)  
  const featuredCommunities = communities.slice(0, 3);

  // Show skeleton while loading
  if (showSkeleton || !isThemeApplied || !fontsLoaded) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="theme2-homepage min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      {/* Header */}
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero Section - Large Image with Overlay (Modern Luxury Style) */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${pageContent.hero?.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&h=1200'}')`
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div className="max-w-4xl px-6">
            <h1 
              className="text-5xl md:text-7xl font-light leading-tight mb-6"
              style={{ fontFamily: 'var(--heading-font)', fontWeight: 'var(--heading-font-weight)' }}
            >
              {pageContent.hero?.heroHeadline || 'Find Your Dream Home'}
            </h1>
            <div className="w-24 h-px bg-white/60 mx-auto mb-8"></div>
            <p 
              className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed opacity-90"
              style={{ fontFamily: 'var(--body-font)', fontWeight: 'var(--body-font-weight)' }}
            >
              {pageContent.hero?.heroSubheadline || 'Discover exceptional properties with our expert real estate services'}
            </p>
            <Button
              className="px-8 py-4 text-lg font-light border-2 border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300"
              style={{ fontFamily: 'var(--button-font)', fontWeight: 'var(--button-font-weight)' }}
            >
              {pageContent.hero?.heroButtonText || 'Browse Properties'}
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section - About LuxeLead (Modern Luxury Style) */}
      <section className="py-24 dynamic-content" style={{ backgroundColor: 'var(--tertiary-color)' }} data-theme-managed>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p 
                  className="text-sm uppercase tracking-[0.2em] mb-4"
                  style={{ color: 'var(--secondary-color)', fontFamily: 'var(--body-font)' }}
                >
                  {pageContent?.about?.subtitle || "About LuxeLead"}
                </p>
                <h2 
                  className="text-4xl md:text-5xl font-light leading-tight mb-6"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
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
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  {pageContent?.about?.description || "With over a decade of experience in Austin's luxury real estate market, we provide unparalleled expertise and personalized service to help you find your perfect home or investment opportunity."}
                </p>
                <Button 
                  className="uppercase tracking-wide border-2 px-8 py-3 bg-transparent hover:bg-opacity-10 hover:scale-105 transition-all duration-300"
                  style={{ 
                    borderColor: 'var(--primary-color)', 
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--button-font)'
                  }}
                >
                  {pageContent?.about?.buttonText || "Learn More"}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img 
                  src={pageContent?.about?.image1 || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=500"}
                  alt="Luxury Interior"
                  className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <img 
                  src={pageContent?.about?.image2 || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&h=300"}
                  alt="Modern Kitchen"
                  className="w-full h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
              <div className="space-y-6 pt-8">
                <img 
                  src={pageContent?.about?.image3 || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=300"}
                  alt="Living Room"
                  className="w-full h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <img 
                  src={pageContent?.about?.image4 || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&h=500"}
                  alt="Master Bedroom"
                  className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners (Modern Luxury Style) */}
      <section className="py-20" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-center items-center space-x-16 opacity-50">
            <div className="text-2xl font-light tracking-[0.2em]" style={{ fontFamily: 'var(--heading-font)' }}>SOTHEBY'S</div>
            <div className="text-2xl font-light tracking-[0.2em]" style={{ fontFamily: 'var(--heading-font)' }}>CHRISTIE'S</div>
            <div className="text-2xl font-light tracking-[0.2em]" style={{ fontFamily: 'var(--heading-font)' }}>COMPASS</div>
            <div className="text-2xl font-light tracking-[0.2em]" style={{ fontFamily: 'var(--heading-font)' }}>COLDWELL</div>
            <div className="text-2xl font-light tracking-[0.2em]" style={{ fontFamily: 'var(--heading-font)' }}>KELLER</div>
          </div>
        </div>
      </section>

      {/* Current Inventory (Modern Luxury Style) */}
      <section className="py-32" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
            >
              {pageContent?.['featured-properties']?.subtitle || "LuxeLead's Current Inventory"}
            </p>
            <h2 
              className="text-5xl md:text-6xl font-light leading-tight"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
            >
              {pageContent?.['featured-properties']?.title || "Featured Properties"}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700 h-96 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <Card key={property.id} className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                  <div className="relative">
                    <img 
                      src={property.mainImage || property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400"}
                      alt={property.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className="px-3 py-1 text-xs font-medium bg-black/80 text-white border-0"
                        style={{ fontFamily: 'var(--body-font)' }}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge 
                        className="px-3 py-1 text-xs font-medium"
                        style={{ 
                          backgroundColor: 'var(--primary-color)', 
                          color: 'white',
                          fontFamily: 'var(--body-font)'
                        }}
                      >
                        ${property.price.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 
                      className="text-xl font-light mb-2 group-hover:text-opacity-80 transition-colors"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      {property.title}
                    </h3>
                    <p 
                      className="text-sm mb-4 flex items-center"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}, {property.city}
                    </p>
                    <div className="flex justify-between items-center text-sm mb-4">
                      <div className="flex space-x-4">
                        <span className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms}
                        </span>
                        <span className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms}
                        </span>
                        <span className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.squareFeet.toLocaleString()} sq ft
                        </span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-transparent border border-current hover:bg-current hover:text-white transition-all duration-300"
                      style={{ 
                        color: 'var(--primary-color)',
                        fontFamily: 'var(--button-font)'
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Communities Section (Modern Luxury Style) */}
      <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--secondary-color)', fontFamily: 'var(--body-font)' }}
            >
              Featured Neighborhoods
            </p>
            <h2 
              className="text-4xl md:text-5xl font-light leading-tight"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
            >
              Luxury Communities
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCommunities.map((community: any) => (
              <Card key={community.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={community.image} 
                    alt={community.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 
                      className="text-xl font-light mb-1"
                      style={{ fontFamily: 'var(--heading-font)' }}
                    >
                      {community.name}
                    </h3>
                    <p className="text-sm opacity-90">{community.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Contact Section (Modern Luxury Style) */}
      <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 
                className="text-4xl md:text-5xl font-light leading-tight mb-6"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Ready to Find Your Next Home?
              </h2>
              <p 
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Let our experienced team guide you through Austin's luxury real estate market. Contact us today for a personalized consultation.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" style={{ color: 'var(--tertiary-color)' }} />
                  <span style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}>(512) 555-LUXE</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3" style={{ color: 'var(--tertiary-color)' }} />
                  <span style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}>info@luxelead.com</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center border-0 shadow-lg" style={{ backgroundColor: 'var(--tertiary-color)' }}>
                <Home className="h-8 w-8 mx-auto mb-4" style={{ color: 'var(--secondary-color)' }} />
                <h3 
                  className="text-2xl font-light mb-2"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  500+
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Homes Sold
                </p>
              </Card>
              
              <Card className="p-6 text-center border-0 shadow-lg" style={{ backgroundColor: 'var(--tertiary-color)' }}>
                <Users className="h-8 w-8 mx-auto mb-4" style={{ color: 'var(--secondary-color)' }} />
                <h3 
                  className="text-2xl font-light mb-2"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  1000+
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Happy Clients
                </p>
              </Card>
              
              <Card className="p-6 text-center border-0 shadow-lg" style={{ backgroundColor: 'var(--tertiary-color)' }}>
                <Award className="h-8 w-8 mx-auto mb-4" style={{ color: 'var(--secondary-color)' }} />
                <h3 
                  className="text-2xl font-light mb-2"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  #1
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Top Agent
                </p>
              </Card>
              
              <Card className="p-6 text-center border-0 shadow-lg" style={{ backgroundColor: 'var(--tertiary-color)' }}>
                <Star className="h-8 w-8 mx-auto mb-4" style={{ color: 'var(--secondary-color)' }} />
                <h3 
                  className="text-2xl font-light mb-2"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  5.0
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Average Rating
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}