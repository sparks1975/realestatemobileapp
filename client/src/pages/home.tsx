import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award } from "lucide-react";
import { useEffect } from "react";
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
  
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Load theme settings
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

  // Apply theme settings
  const applyThemeSettings = (settings: any) => {
    if (settings) {
      console.log('🎨 Applying theme settings:', settings);
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
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
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
    <div className="agent-website min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      <Header currentPage="home" />

      {/* Hero Section */}
      <section 
        className="relative pt-24 pb-32 overflow-hidden"
        style={{ backgroundColor: 'var(--secondary-color)' }}
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&h=1000"
            alt="Luxury Home"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-opacity-70"
            style={{ backgroundColor: 'var(--secondary-color)' }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p 
              className="text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
            >
              Austin's Premier Real Estate
            </p>
            <h1 
              className="text-5xl md:text-7xl font-light leading-tight mb-8"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
            >
              Find Your Dream Home
            </h1>
            <p 
              className="text-xl leading-relaxed mb-12"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
            >
              Discover luxury properties in Austin's most exclusive neighborhoods. 
              From modern penthouses to historic estates, we help you find the perfect home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                className="px-8 py-4 text-white text-lg uppercase tracking-wide border-0"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                View Properties
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg uppercase tracking-wide border-2"
                style={{ 
                  borderColor: 'var(--tertiary-color)', 
                  color: 'var(--tertiary-color)',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p 
              className="text-sm uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
            >
              Featured Properties
            </p>
            <h2 
              className="text-4xl md:text-5xl font-light leading-tight"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
            >
              Luxury Listings
            </h2>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <a 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="group relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={property.mainImage || property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=600'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium px-2 py-1"
                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    
                    <h3 
                      className="text-xl font-light leading-tight mb-2"
                      style={{ fontFamily: 'var(--heading-font)' }}
                    >
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{property.city}, {property.state}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div 
                        className="text-2xl font-light"
                        style={{ fontFamily: 'var(--heading-font)' }}
                      >
                        ${property.price.toLocaleString()}
                      </div>
                      <div className="text-sm">
                        {property.bedrooms}bd • {property.bathrooms}ba
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div 
                className="text-4xl md:text-5xl font-light mb-2"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                500+
              </div>
              <div 
                className="text-sm uppercase tracking-wide"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Properties Sold
              </div>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-light mb-2"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                $2.5B
              </div>
              <div 
                className="text-sm uppercase tracking-wide"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Total Sales
              </div>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-light mb-2"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                98%
              </div>
              <div 
                className="text-sm uppercase tracking-wide"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Client Satisfaction
              </div>
            </div>
            <div>
              <div 
                className="text-4xl md:text-5xl font-light mb-2"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                15+
              </div>
              <div 
                className="text-sm uppercase tracking-wide"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Agent */}
      <section className="py-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=700"
                alt="Alex Rodriguez"
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
                style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
              >
                Your Trusted Agent
              </p>
              <h2 
                className="text-4xl md:text-5xl font-light leading-tight mb-6"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
              >
                Alex Rodriguez
              </h2>
              <p 
                className="text-lg leading-relaxed mb-8"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
              >
                With over 15 years of experience in Austin's luxury real estate market, 
                Alex brings unparalleled expertise and a passion for exceptional service 
                to every client relationship.
              </p>
              <div className="flex space-x-6 mb-8">
                <div className="text-center">
                  <div 
                    className="text-3xl font-light mb-2"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    500+
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
                    className="text-3xl font-light mb-2"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    $2.5B
                  </div>
                  <div 
                    className="text-sm uppercase tracking-wide"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                  >
                    Total Sales
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="uppercase tracking-wide border-2 px-8 py-3"
                style={{ 
                  borderColor: 'var(--text-color)', 
                  color: 'var(--text-color)',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                Contact Alex
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p 
            className="text-sm uppercase tracking-[0.2em] mb-4"
            style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
          >
            Get In Touch
          </p>
          <h2 
            className="text-4xl md:text-5xl font-light leading-tight mb-8"
            style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
          >
            Ready to Find Your Dream Home?
          </h2>
          <p 
            className="text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
            style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
          >
            Let's discuss your real estate goals and find the perfect property 
            that matches your lifestyle and investment objectives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              className="px-12 py-4 text-white text-lg uppercase tracking-wide border-0"
              style={{ 
                backgroundColor: 'var(--primary-color)',
                fontFamily: 'var(--button-font)',
                fontWeight: 'var(--button-font-weight)'
              }}
            >
              <Phone className="w-5 h-5 mr-3" />
              Call Today
            </Button>
            
            <div className="flex items-center gap-6">
              <a 
                href="tel:+1234567890"
                className="flex items-center text-lg hover:opacity-70 transition-opacity"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                <Phone className="w-5 h-5 mr-2" />
                (512) 555-0123
              </a>
              <a 
                href="mailto:alex@luxelead.com"
                className="flex items-center text-lg hover:opacity-70 transition-opacity"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                <Mail className="w-5 h-5 mr-2" />
                alex@luxelead.com
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Home className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
              <h4 
                className="text-xl font-light mb-3"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Luxury Homes
              </h4>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Exclusive residential properties in Austin's most prestigious neighborhoods
              </p>
            </div>

            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
              <h4 
                className="text-xl font-light mb-3"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Investment Properties
              </h4>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Strategic investment opportunities with proven ROI potential
              </p>
            </div>

            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
              <h4 
                className="text-xl font-light mb-3"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                Commercial Real Estate
              </h4>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
              >
                Premium commercial spaces and development opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}