import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, ArrowRight, Phone, Mail, User } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomeTheme2() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeApplied, setIsThemeApplied] = useState(false);

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
  const { data: properties = [] } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
  });

  // Load communities
  const { data: communities = [] } = useQuery({
    queryKey: ['/api/communities'],
    queryFn: async () => {
      const response = await fetch('/api/communities');
      if (!response.ok) throw new Error('Failed to fetch communities');
      return response.json();
    }
  });

  // Load page content
  const { data: pageContent = [] } = useQuery({
    queryKey: ['/api/pages/home/content'],
    queryFn: async () => {
      const response = await fetch('/api/pages/home/content');
      if (!response.ok) throw new Error('Failed to fetch page content');
      return response.json();
    }
  });

  // Helper function to get content value
  const getContentValue = (sectionName: string, contentKey: string, defaultValue: string = '') => {
    const content = pageContent.find(
      (item: any) => item.sectionName === sectionName && item.contentKey === contentKey
    );
    return content?.contentValue || defaultValue;
  };

  // Apply theme settings to CSS variables
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
      setIsThemeApplied(true);
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  // Get featured properties (first 3)
  const featuredProperties = properties.slice(0, 3);
  
  // Get featured communities (first 3)
  const featuredCommunities = communities.slice(0, 3);

  return (
    <div className="theme2-homepage min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      {/* Header */}
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero Section - Large Image with Overlay */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${getContentValue('hero', 'background-image', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&h=1200')}')`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div className="max-w-4xl px-6">
            <h1 
              className="text-6xl md:text-8xl font-light leading-tight mb-6"
              style={{ fontFamily: 'var(--heading-font)' }}
            >
              {getContentValue('hero', 'title', 'LUXURY REAL ESTATE')}
            </h1>
            <div className="w-32 h-px bg-white/60 mx-auto mb-8"></div>
            <p 
              className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--body-font)' }}
            >
              {getContentValue('hero', 'subtitle', 'DISCOVER EXCEPTIONAL PROPERTIES IN SONOMA VALLEY')}
            </p>
            <Button
              className="px-8 py-4 text-lg font-light border border-white bg-transparent hover:bg-white hover:text-black transition-all duration-300"
              style={{ fontFamily: 'var(--button-font)' }}
            >
              {getContentValue('hero', 'cta-text', 'VIEW PROPERTIES')}
            </Button>
          </div>
        </div>
      </section>

      {/* Location Expertise Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
            >
              LOCAL EXPERTISE • GLOBAL CONNECTIONS
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredCommunities.map((community: any, index: number) => (
              <Card key={community.id} className="group overflow-hidden border-0 shadow-lg">
                <div className="relative">
                  <img 
                    src={community.image} 
                    alt={community.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 
                      className="text-xl font-light mb-2"
                      style={{ fontFamily: 'var(--heading-font)' }}
                    >
                      {community.name}
                    </h3>
                    <p className="text-sm opacity-90">{community.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wine Country Section */}
      <section className="py-32" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p 
                className="text-sm uppercase tracking-[0.3em] mb-6"
                style={{ color: 'var(--primary-color)', fontFamily: 'var(--body-font)' }}
              >
                WINE COUNTRY
              </p>
              <h2 
                className="text-5xl md:text-6xl font-light leading-tight mb-8"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                LUXURY REAL ESTATE
              </h2>
              <p 
                className="text-xl leading-relaxed mb-8 opacity-90"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Experience the finest properties in Sonoma Valley, where sophisticated architecture meets breathtaking natural beauty.
              </p>
              <Button
                className="px-8 py-4 text-lg font-light border bg-transparent hover:bg-white hover:text-black transition-all duration-300"
                style={{ 
                  borderColor: 'var(--tertiary-color)',
                  color: 'var(--tertiary-color)',
                  fontFamily: 'var(--button-font)'
                }}
              >
                EXPLORE COLLECTION
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&h=600"
                alt="Wine Country Estate"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
            >
              UNPARALLELED EXPERTISE
            </p>
            <h2 
              className="text-5xl font-light"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
            >
              Featured Properties
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property: any) => (
              <Card key={property.id} className="group overflow-hidden border-0 shadow-lg">
                <div className="relative">
                  <img 
                    src={property.mainImage} 
                    alt={property.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge 
                    className="absolute top-4 left-4 text-xs"
                    style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                  >
                    {property.status}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 
                      className="text-xl font-light mb-2"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      {property.title}
                    </h3>
                    <p 
                      className="text-sm opacity-70 flex items-center"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4 text-sm">
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
                        {property.squareFootage?.toLocaleString()} sq ft
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span 
                      className="text-2xl font-light"
                      style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      ${property.price?.toLocaleString()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs uppercase tracking-wide"
                      style={{ color: 'var(--text-color)' }}
                    >
                      VIEW DETAILS <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&h=600"
                alt="Modern Interior"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <p 
                className="text-sm uppercase tracking-[0.3em] mb-6"
                style={{ color: 'var(--primary-color)', fontFamily: 'var(--body-font)' }}
              >
                EXPERIENCE OUR CULTIVATED PROPERTIES
              </p>
              <h2 
                className="text-4xl font-light leading-tight mb-8"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Curated for the discerning buyer who values exceptional quality and impeccable design.
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-3"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  ></div>
                  <p style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}>
                    Exclusive access to premier properties
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-3"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  ></div>
                  <p style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}>
                    Personalized service throughout your journey
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-2 h-2 rounded-full mt-3"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  ></div>
                  <p style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}>
                    Deep local market knowledge and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 
              className="text-5xl font-light mb-8"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
            >
              EXPLORE THE LIFESTYLE
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=400"
                  alt="Dining"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 
                    className="text-xl font-light"
                    style={{ fontFamily: 'var(--heading-font)' }}
                  >
                    DINING
                  </h3>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&h=400"
                  alt="Wellness"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 
                    className="text-xl font-light"
                    style={{ fontFamily: 'var(--heading-font)' }}
                  >
                    WELLNESS
                  </h3>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1600607688960-3ad4316e5b3b?auto=format&fit=crop&w=600&h=400"
                  alt="Culture"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 
                    className="text-xl font-light"
                    style={{ fontFamily: 'var(--heading-font)' }}
                  >
                    CULTURE
                  </h3>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Agent Section */}
      <section className="py-32" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.3em] mb-6"
              style={{ color: 'var(--primary-color)', fontFamily: 'var(--body-font)' }}
            >
              BE IN THE KNOW
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 
                className="text-4xl font-light leading-tight mb-8"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Stay updated on the first to know about new luxury listings and market insights.
              </h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  className="px-6 py-3 text-sm uppercase tracking-wide border bg-transparent hover:bg-white hover:text-black transition-all duration-300"
                  style={{ 
                    borderColor: 'var(--tertiary-color)',
                    color: 'var(--tertiary-color)',
                    fontFamily: 'var(--button-font)'
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  SCHEDULE CALL
                </Button>
                <Button
                  className="px-6 py-3 text-sm uppercase tracking-wide border bg-transparent hover:bg-white hover:text-black transition-all duration-300"
                  style={{ 
                    borderColor: 'var(--tertiary-color)',
                    color: 'var(--tertiary-color)',
                    fontFamily: 'var(--button-font)'
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  SEND MESSAGE
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&h=600"
                alt="Real Estate Agent"
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm uppercase tracking-wide">Your Agent</span>
                </div>
                <h3 
                  className="text-2xl font-light"
                  style={{ fontFamily: 'var(--heading-font)' }}
                >
                  Alex Morgan
                </h3>
                <p className="text-sm opacity-90">Luxury Real Estate Specialist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}