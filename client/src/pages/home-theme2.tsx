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

      {/* Hero Section - Massive Full-Width Image (Ginger Martin Style) */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${pageContent.hero?.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&h=1600'}')`
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Minimal text overlay */}
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 text-white max-w-lg">
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-2 opacity-80"
            style={{ fontFamily: 'var(--body-font)' }}
          >
            {pageContent?.hero?.subheadline || "Austin's #1 Luxury Realtor"}
          </p>
          <h1 
            className="text-4xl md:text-6xl leading-tight hero-heading"
            style={{ 
              color: 'var(--tertiary-color)',
              fontFamily: 'var(--heading-font)',
              fontWeight: 'var(--heading-font-weight)'
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
      </section>

      {/* About Section - Large Image + Text Side by Side (Ginger Martin Style) */}
      <section className="relative h-screen flex">
        {/* Massive image takes up 60% */}
        <div className="w-3/5 relative">
          <img 
            src={pageContent?.about?.image1 || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&h=1200"}
            alt="Luxury Interior"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content takes up 40% */}
        <div className="w-2/5 flex items-center" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="px-16 py-24">
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-6 opacity-60"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
            >
              {pageContent?.about?.subtitle || "About LuxeLead"}
            </p>
            <h2 
              className="about-heading-modern text-3xl md:text-4xl leading-tight mb-8"
              style={{ 
                color: 'var(--text-color)'
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
              className="text-base leading-relaxed mb-10 opacity-80"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
            >
              {pageContent?.about?.description || "With over a decade of experience in Austin's luxury real estate market, we provide unparalleled expertise and personalized service to help you find your perfect home or investment opportunity."}
            </p>
            <div className="w-12 h-px bg-current opacity-30 mb-8"></div>
            <p 
              className="text-sm uppercase tracking-[0.2em] opacity-60"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
            >
              LOCAL EXPERTISE
            </p>
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

      {/* Featured Properties - Full Width Images (Ginger Martin Style) */}
      <section>
        {/* Section header */}
        <div className="py-24 text-center" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <p 
            className="text-sm uppercase tracking-[0.4em] mb-4 opacity-60"
            style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
          >
            {pageContent?.['featured-properties']?.subtitle || "LuxeLead's Current Inventory"}
          </p>
          <h2 
            className="text-4xl md:text-5xl"
            style={{ 
              color: 'var(--text-color)', 
              fontFamily: 'var(--heading-font)', 
              fontWeight: 'var(--heading-font-weight)' 
            }}
          >
            {pageContent?.['featured-properties']?.title || "Featured Properties"}
          </h2>
        </div>

        {/* Property cards as large lifestyle images */}
        {isLoading ? (
          <div className="space-y-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-300 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {featuredProperties.map((property, index) => (
              <a 
                key={property.id} 
                href={`/property/${property.id}`}
                className={`relative h-screen flex ${index % 2 === 0 ? '' : 'flex-row-reverse'} group cursor-pointer`}
              >
                {/* Massive property image takes up 65% */}
                <div className="w-3/5 relative">
                  <img 
                    src={property.mainImage || property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&h=1200"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
                  
                  {/* Property status overlay */}
                  <div className="absolute top-8 left-8">
                    <div 
                      className="px-4 py-2 text-xs uppercase tracking-wider bg-white/90 text-black"
                      style={{ fontFamily: 'var(--body-font)' }}
                    >
                      {property.status}
                    </div>
                  </div>
                </div>
                
                {/* Property details take up 35% */}
                <div className="w-2/5 flex items-center" style={{ backgroundColor: 'var(--tertiary-color)' }}>
                  <div className="px-16 py-24">
                    <p 
                      className="text-sm uppercase tracking-[0.3em] mb-4 opacity-60"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                    >
                      <MapPin className="h-3 w-3 inline mr-2" />
                      {property.address}, {property.city}
                    </p>
                    <h3 
                      className="text-3xl md:text-4xl leading-tight mb-6"
                      style={{ 
                        color: 'var(--text-color)', 
                        fontFamily: 'var(--heading-font)', 
                        fontWeight: 'var(--heading-font-weight)' 
                      }}
                    >
                      {property.title}
                    </h3>
                    
                    {/* Property stats */}
                    <div className="flex space-x-8 mb-8 text-sm opacity-80">
                      <div style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}>
                        <div className="font-light">{property.bedrooms}</div>
                        <div className="uppercase tracking-wider text-xs">Bedrooms</div>
                      </div>
                      <div style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}>
                        <div className="font-light">{property.bathrooms}</div>
                        <div className="uppercase tracking-wider text-xs">Bathrooms</div>
                      </div>
                      <div style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}>
                        <div className="font-light">{property.squareFeet.toLocaleString()}</div>
                        <div className="uppercase tracking-wider text-xs">Sq Ft</div>
                      </div>
                    </div>
                    
                    <div className="w-16 h-px bg-current opacity-30 mb-8"></div>
                    
                    <div className="flex items-center justify-between">
                      <p 
                        className="text-2xl"
                        style={{ 
                          color: 'var(--text-color)', 
                          fontFamily: 'var(--heading-font)', 
                          fontWeight: 'var(--heading-font-weight)' 
                        }}
                      >
                        ${property.price.toLocaleString()}
                      </p>
                      <div 
                        className="text-xs uppercase tracking-wider opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
                        style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                      >
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Communities Section - Three Wide Images (Ginger Martin Style) */}
      <section>
        {/* Section header */}
        <div className="py-24 text-center" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <p 
            className="text-sm uppercase tracking-[0.4em] mb-4 opacity-60"
            style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
          >
            LOCAL EXPERTISE • GLOBAL CONNECTIONS
          </p>
          <h2 
            className="text-4xl md:text-5xl"
            style={{ 
              color: 'var(--text-color)', 
              fontFamily: 'var(--heading-font)', 
              fontWeight: 'var(--heading-font-weight)' 
            }}
          >
            Luxury Communities
          </h2>
        </div>

        {/* Three wide community images */}
        <div className="grid grid-cols-3 h-screen">
          {featuredCommunities.map((community: any, index: number) => (
            <div key={community.id} className="relative group">
              <img 
                src={community.image} 
                alt={community.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
              
              {/* Community info overlay */}
              <div className="absolute bottom-8 left-8 text-white">
                <h3 
                  className="text-xl mb-2"
                  style={{ 
                    fontFamily: 'var(--heading-font)', 
                    fontWeight: 'var(--heading-font-weight)' 
                  }}
                >
                  {community.name}
                </h3>
                <p 
                  className="text-sm opacity-80 max-w-xs"
                  style={{ fontFamily: 'var(--body-font)' }}
                >
                  {community.description}
                </p>
              </div>
              
              {/* Explore indicator */}
              <div className="absolute top-8 right-8 opacity-60 group-hover:opacity-100 transition-opacity">
                <div 
                  className="text-xs uppercase tracking-wider text-white"
                  style={{ fontFamily: 'var(--body-font)' }}
                >
                  Explore →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Lifestyle Section - Large Image with Contact (Ginger Martin Style) */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${pageContent?.contact?.backgroundImage || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&h=1600'}')`
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Contact content overlay */}
        <div className="absolute bottom-24 left-8 text-white max-w-md">
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80"
            style={{ fontFamily: 'var(--body-font)' }}
          >
            EXPERIENCE DISTINCTION
          </p>
          <h2 
            className="text-4xl md:text-5xl leading-tight mb-6"
            style={{ 
              fontFamily: 'var(--heading-font)', 
              fontWeight: 'var(--heading-font-weight)' 
            }}
          >
            {pageContent?.contact?.title || "Ready to Find Your Dream Home?"}
          </h2>
          <p 
            className="text-base mb-8 opacity-90 leading-relaxed"
            style={{ fontFamily: 'var(--body-font)' }}
          >
            {pageContent?.contact?.description || "Contact our team today to start your journey toward finding the perfect luxury property in Austin's most prestigious neighborhoods."}
          </p>
          <div className="w-16 h-px bg-white opacity-50 mb-8"></div>
          <div 
            className="text-sm uppercase tracking-wider opacity-80 cursor-pointer hover:opacity-100 transition-opacity"
            style={{ fontFamily: 'var(--body-font)' }}
          >
            {pageContent?.contact?.primaryButtonText || "Get Started"} →
          </div>
        </div>

        {/* Stats overlay */}
        <div className="absolute top-24 right-8 text-white">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <div 
                className="text-2xl mb-1"
                style={{ 
                  fontFamily: 'var(--heading-font)', 
                  fontWeight: 'var(--heading-font-weight)' 
                }}
              >
                {pageContent?.stats?.stat1Value || "500+"}
              </div>
              <div 
                className="text-xs uppercase tracking-wider opacity-80"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                {pageContent?.stats?.stat1Label || "Homes Sold"}
              </div>
            </div>
            <div>
              <div 
                className="text-2xl mb-1"
                style={{ 
                  fontFamily: 'var(--heading-font)', 
                  fontWeight: 'var(--heading-font-weight)' 
                }}
              >
                {pageContent?.stats?.stat2Value || "15+"}
              </div>
              <div 
                className="text-xs uppercase tracking-wider opacity-80"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                {pageContent?.stats?.stat2Label || "Years Experience"}
              </div>
            </div>
            <div>
              <div 
                className="text-2xl mb-1"
                style={{ 
                  fontFamily: 'var(--heading-font)', 
                  fontWeight: 'var(--heading-font-weight)' 
                }}
              >
                {pageContent?.stats?.stat3Value || "$2.5B+"}
              </div>
              <div 
                className="text-xs uppercase tracking-wider opacity-80"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                {pageContent?.stats?.stat3Label || "Sales Volume"}
              </div>
            </div>
            <div>
              <div 
                className="text-2xl mb-1"
                style={{ 
                  fontFamily: 'var(--heading-font)', 
                  fontWeight: 'var(--heading-font-weight)' 
                }}
              >
                {pageContent?.stats?.stat4Value || "98%"}
              </div>
              <div 
                className="text-xs uppercase tracking-wider opacity-80"
                style={{ fontFamily: 'var(--body-font)' }}
              >
                {pageContent?.stats?.stat4Label || "Client Satisfaction"}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom branding */}
        <div className="absolute bottom-8 right-8 text-white opacity-60">
          <p 
            className="text-xs uppercase tracking-[0.3em]"
            style={{ fontFamily: 'var(--body-font)' }}
          >
            BE IN THE KNOW
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}