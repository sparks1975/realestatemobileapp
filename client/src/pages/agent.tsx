import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award, MessageCircle, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getContrastingTextColor } from "@/lib/utils";

// Agent Page Skeleton Component
function AgentPageSkeleton() {
  return (
    <div className="agent-page min-h-screen bg-white">
      {/* Navigation Skeleton */}
      <div className="fixed top-0 w-full backdrop-blur-sm z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32 bg-gray-200" />
            <div className="hidden md:flex items-center space-x-12">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-4 w-16 bg-gray-200" />)}
            </div>
            <div className="md:hidden">
              <Skeleton className="h-6 w-6 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="pt-24 pb-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <Skeleton className="w-full h-96 bg-gray-200" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24">
                <Skeleton className="w-full h-full bg-gray-200" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-4 bg-gray-200" />
              <Skeleton className="h-12 w-64 mb-6 bg-gray-200" />
              <Skeleton className="h-6 w-full mb-2 bg-gray-200" />
              <Skeleton className="h-6 w-3/4 mb-8 bg-gray-200" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 w-32 bg-gray-200" />
                <Skeleton className="h-12 w-32 bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-16 mx-auto mb-4 bg-gray-200" />
                <Skeleton className="h-6 w-24 mx-auto bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section Skeleton */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-48 mx-auto mb-4 bg-gray-200" />
            <Skeleton className="h-6 w-96 mx-auto bg-gray-200" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-8 text-center border border-gray-200 rounded-lg">
                <Skeleton className="h-12 w-12 mx-auto mb-6 bg-gray-200" />
                <Skeleton className="h-6 w-32 mx-auto mb-4 bg-gray-200" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                <Skeleton className="h-4 w-3/4 mx-auto bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeApplied, setIsThemeApplied] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Load theme settings
  const { data: themeSettings, isLoading, refetch: refetchTheme } = useQuery({
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
      
      // Section Background Color and Text Color
      root.style.setProperty('--section-background-color', settings.sectionBackgroundColor || settings.secondaryColor);
      const sectionTextColor = getContrastingTextColor(settings.sectionBackgroundColor || settings.secondaryColor);
      root.style.setProperty('--section-text-color', sectionTextColor);

      // Load Google Fonts
      const fontsToLoad = new Set([settings.headingFont, settings.bodyFont, settings.buttonFont]);
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      });
      setIsThemeApplied(true);
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  // Hide skeleton after theme is loaded and applied
  useEffect(() => {
    if (!isLoading && themeSettings && isThemeApplied) {
      // Small delay to ensure smooth transition
      setTimeout(() => setShowSkeleton(false), 500);
    }
  }, [isLoading, themeSettings, isThemeApplied]);

  // Show skeleton while loading
  if (showSkeleton || isLoading || !themeSettings) {
    return <AgentPageSkeleton />;
  }

  return (
    <div className="agent-page min-h-screen" style={{ backgroundColor: 'var(--secondary-color)' }}>
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Main Content */}
      <div className="pt-0">
        {/* Hero Section */}
        <section className="pt-24 pb-24" style={{ backgroundColor: 'var(--section-background-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=700"
                  alt="Alex Rodriguez - LuxeLead Agent"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute -bottom-8 -right-8 w-24 h-24 flex items-center justify-center text-white"
                     style={{ backgroundColor: 'var(--primary-color)' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15+</div>
                    <div className="text-xs uppercase">Years</div>
                  </div>
                </div>
              </div>
              <div>
                <p 
                  className="text-sm uppercase tracking-[0.2em] mb-4"
                  style={{ color: 'var(--section-text-color)' }}
                >
                  LuxeLead Agent
                </p>
                <h1 
                  className="text-4xl md:text-6xl font-light leading-tight mb-6"
                  style={{ color: 'var(--section-text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Alex Rodriguez
                </h1>
                <p 
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: 'var(--section-text-color)', fontFamily: 'var(--body-font)' }}
                >
                  With over 15 years of experience in Austin's luxury real estate market, 
                  Alex brings unparalleled expertise and a passion for exceptional service 
                  to every client relationship.
                </p>
                
                {/* Contact Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="px-8 py-3 text-white uppercase tracking-wide border-0"
                    style={{ 
                      backgroundColor: 'var(--primary-color)',
                      fontFamily: 'var(--button-font)',
                      fontWeight: 'var(--button-font-weight)'
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Alex
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-8 py-3 uppercase tracking-wide border-2 hover:bg-opacity-10"
                    style={{ 
                      borderColor: 'var(--section-text-color)',
                      color: 'var(--section-text-color)',
                      backgroundColor: 'transparent',
                      fontFamily: 'var(--button-font)',
                      fontWeight: 'var(--button-font-weight)'
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24" style={{ backgroundColor: 'var(--section-background-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="text-center">
                <div 
                  className="text-4xl font-light mb-4"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  250+
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Properties Sold
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-4xl font-light mb-4"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  $85M+
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Total Sales
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-4xl font-light mb-4"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  15+
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-4xl font-light mb-4"
                  style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                >
                  98%
                </div>
                <div 
                  className="text-sm uppercase tracking-wide"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Client Satisfaction
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 
                className="text-3xl md:text-4xl font-light mb-6"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Premium Services
              </h2>
              <p 
                className="text-lg leading-relaxed max-w-2xl mx-auto"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Comprehensive real estate services tailored to meet your unique needs 
                in Austin's competitive luxury market.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card 
                className="p-8 text-center border-0"
                style={{ backgroundColor: 'var(--tertiary-color)' }}
              >
                <CardContent className="p-0">
                  <Home 
                    size={48} 
                    className="mx-auto mb-6"
                    style={{ color: 'var(--primary-color)' }}
                  />
                  <h3 
                    className="text-xl font-medium mb-4"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    Buyer Representation
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                  >
                    Expert guidance through every step of your home buying journey, 
                    from market analysis to closing.
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="p-8 text-center border-0"
                style={{ backgroundColor: 'var(--tertiary-color)' }}
              >
                <CardContent className="p-0">
                  <Star 
                    size={48} 
                    className="mx-auto mb-6"
                    style={{ color: 'var(--primary-color)' }}
                  />
                  <h3 
                    className="text-xl font-medium mb-4"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    Luxury Marketing
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                  >
                    Sophisticated marketing strategies designed to showcase your property 
                    to qualified luxury buyers.
                  </p>
                </CardContent>
              </Card>

              <Card 
                className="p-8 text-center border-0"
                style={{ backgroundColor: 'var(--tertiary-color)' }}
              >
                <CardContent className="p-0">
                  <Users 
                    size={48} 
                    className="mx-auto mb-6"
                    style={{ color: 'var(--primary-color)' }}
                  />
                  <h3 
                    className="text-xl font-medium mb-4"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    Investment Advisory
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                  >
                    Strategic investment advice backed by deep market knowledge 
                    and proven analytical expertise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24" style={{ backgroundColor: 'var(--section-background-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 
                  className="text-3xl md:text-4xl font-light mb-6"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                >
                  Ready to Get Started?
                </h2>
                <p 
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Let's discuss your real estate goals and create a customized strategy 
                  that delivers exceptional results.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Phone 
                      size={20} 
                      className="mr-4"
                      style={{ color: 'var(--primary-color)' }}
                    />
                    <span 
                      className="text-lg"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                    >
                      (512) 555-0123
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail 
                      size={20} 
                      className="mr-4"
                      style={{ color: 'var(--primary-color)' }}
                    />
                    <span 
                      className="text-lg"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                    >
                      alex@luxelead.com
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin 
                      size={20} 
                      className="mr-4"
                      style={{ color: 'var(--primary-color)' }}
                    />
                    <span 
                      className="text-lg"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                    >
                      Downtown Austin, TX
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  className="px-12 py-4 text-lg text-white uppercase tracking-wide border-0 mb-4"
                  style={{ 
                    backgroundColor: 'var(--primary-color)',
                    fontFamily: 'var(--button-font)',
                    fontWeight: 'var(--button-font-weight)'
                  }}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Schedule Consultation
                </Button>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                >
                  Free 30-minute consultation
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}