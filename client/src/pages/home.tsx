import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award } from "lucide-react";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import kumaraImage from "@assets/kumara-website-min_1755563174269.webp";

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

  return (
    <div className="agent-website min-h-screen bg-white">
      <Header currentPage="home" />

      {/* Hero Section - Matching Kumara Design */}
      <section className="pt-24 pb-0 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Hero Image */}
          <div className="relative mb-16">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&h=900"
              alt="Luxury Austin Real Estate"
              className="w-full h-96 md:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-8 left-8">
              <p className="text-white text-sm uppercase tracking-[0.3em] mb-2">Austin's Luxury Real Estate</p>
              <h1 className="text-white text-4xl md:text-6xl font-light leading-tight">
                Exceptional Properties
              </h1>
            </div>
          </div>

          {/* Property Grid - 3 columns */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-64 animate-pulse"></div>
              ))
            ) : (
              featuredProperties.slice(0, 3).map((property) => (
                <a 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="group"
                >
                  <div className="mb-4">
                    <img 
                      src={property.mainImage || property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400'}
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm uppercase tracking-[0.2em] text-gray-700 mb-2">
                      {property.type}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {property.city}, {property.state} • ${property.price.toLocaleString()}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>

          {/* Brand Logos Section */}
          <div className="border-t border-gray-200 pt-16 pb-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-40">
              <div className="text-center text-sm font-light tracking-[0.3em] text-gray-400">SOTHEBY'S</div>
              <div className="text-center text-sm font-light tracking-[0.3em] text-gray-400">CHRISTIE'S</div>
              <div className="text-center text-sm font-light tracking-[0.3em] text-gray-400">LUXE</div>
              <div className="text-center text-sm font-light tracking-[0.3em] text-gray-400">ESTATES</div>
              <div className="text-center text-sm font-light tracking-[0.3em] text-gray-400">AUSTIN</div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Inventory Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-4">Current Inventory</p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">Available Properties</h2>
          </div>

          {/* Property Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 animate-pulse"></div>
              ))
            ) : (
              featuredProperties.slice(3, 6).map((property) => (
                <a 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="group bg-white"
                >
                  <div className="mb-6">
                    <img 
                      src={property.mainImage || property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400'}
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <div className="px-4 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-light text-gray-900">{property.title}</h3>
                      <span className="text-lg font-light text-gray-900">${property.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{property.city}, {property.state}</p>
                    <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wide">
                      <span>{property.bedrooms} Bedrooms</span>
                      <span>{property.bathrooms} Bathrooms</span>
                      <span>{property.squareFeet} Sq Ft</span>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              className="px-8 py-3 text-sm uppercase tracking-wide border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">Stay Updated</p>
          <h2 className="text-3xl md:text-4xl font-light mb-8">
            Be the first to know about new luxury listings
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white"
            />
            <Button className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 text-sm uppercase tracking-wide">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Homes Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-4">Featured Homes</p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">Signature Properties</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=600"
                alt="Luxury Modern Home"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-600 mb-4">The Advisor</p>
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
                Modern Austin Estate
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Exceptional contemporary design meets timeless elegance in this stunning 
                Austin estate. Features include panoramic city views, premium finishes, 
                and meticulously landscaped grounds.
              </p>
              <Button 
                variant="outline" 
                className="px-8 py-3 text-sm uppercase tracking-wide border-gray-300 text-gray-700"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600"
                alt="Alex Rodriguez - LuxeLead Agent"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">Alex Rodriguez</p>
              <h2 className="text-3xl md:text-4xl font-light mb-6">Your Trusted Advisor</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                With over 15 years of experience in Austin's luxury real estate market, 
                I bring unparalleled expertise and dedication to every client relationship. 
                My commitment is to deliver exceptional results through personalized service 
                and deep market knowledge.
              </p>
              <div className="flex gap-6">
                <Button className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 text-sm uppercase tracking-wide">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Today
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 py-3 text-sm uppercase tracking-wide border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}