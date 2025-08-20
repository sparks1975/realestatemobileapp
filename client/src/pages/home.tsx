import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award } from "lucide-react";
import { useEffect } from "react";

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
      root.style.setProperty('--font-family', settings.fontFamily);

      // Debug: Check if variables were actually set
      console.log('🔍 CSS Variables set:', {
        '--primary-color': root.style.getPropertyValue('--primary-color'),
        '--link-color': root.style.getPropertyValue('--link-color'),
        '--text-color': root.style.getPropertyValue('--text-color'),
        '--navigation-color': root.style.getPropertyValue('--navigation-color'),
        '--sub-navigation-color': root.style.getPropertyValue('--sub-navigation-color')
      });

      // Load Google Font dynamically
      if (settings.fontFamily && settings.fontFamily !== 'Inter') {
        const fontUrl = `https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
        
        // Check if font is already loaded
        const existingLink = document.querySelector(`link[href*="${settings.fontFamily.replace(' ', '+')}"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }
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
    <div className="agent-website min-h-screen bg-white">
      {/* Navigation */}
      <nav 
        className="fixed top-0 w-full backdrop-blur-sm z-50 border-b border-gray-100"
        style={{ backgroundColor: 'var(--navigation-color)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="text-2xl font-bold"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}
            >
              LuxeLead
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#home" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--link-color)' }}
              >
                Home
              </a>
              <a 
                href="#properties" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--link-color)' }}
              >
                Properties
              </a>
              <a 
                href="#about" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--link-color)' }}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--link-color)' }}
              >
                Contact
              </a>
              <a 
                href="/app/dashboard" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--link-color)' }}
              >
                Mobile App
              </a>
              <a 
                href="/admin" 
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--link-color)' }}
              >
                Admin
              </a>
            </div>
            <Button 
              className="hover:opacity-90 text-white"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&h=1080')`
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <p className="text-lg mb-4 tracking-wide uppercase">Austin's #1 Luxury Realtor</p>
          <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
            Exceptional<br />
            Real Estate<br />
            Experience
          </h1>
          <Button 
            size="lg" 
            className="hover:opacity-90 text-white"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            View Properties
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Meet Your<br />
                Dedicated Agent
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                With over a decade of experience in Austin's luxury real estate market, 
                I specialize in connecting discerning clients with exceptional properties. 
                My commitment to personalized service and market expertise ensures 
                every transaction exceeds expectations.
              </p>
              <div className="flex items-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Properties Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">$2.5B+</div>
                  <div className="text-sm text-gray-600">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900">15</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                Learn More About Me
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=800"
                alt="Professional Realtor"
                className="rounded-lg h-96 w-full object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Curated Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover exceptional homes that represent the finest in luxury living, 
              carefully selected for their unique character and prime locations.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <Card key={property.id} className="group cursor-pointer bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" style={{backgroundColor: 'white', borderColor: '#e5e7eb', overflow: 'hidden'}}>
                  <div className="relative overflow-hidden rounded-t-lg" style={{overflow: 'hidden'}}>
                    <img 
                      src={property.images?.[0] || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800`}
                      alt={property.title}
                      className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                      {property.status}
                    </Badge>
                  </div>
                  <CardContent className="p-6 bg-white" style={{backgroundColor: 'white'}}>
                    <div className="flex items-center text-sm text-gray-500 mb-2" style={{color: '#6b7280'}}>
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-4" style={{color: '#111827'}}>{property.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4" style={{color: '#4b5563'}}>
                      <span>{property.bedrooms} Bed</span>
                      <span>{property.bathrooms} Bath</span>
                      <span>{property.squareFeet?.toLocaleString()} sq ft</span>
                    </div>
                    <div className="text-2xl font-light text-gray-900" style={{color: '#111827'}}>
                      ${property.price?.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Current Inventory */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              LuxeLead's Current Inventory
            </h2>
            <p className="text-lg text-gray-600">
              Exclusive listings available now
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {currentInventory.map((property) => (
              <Card key={property.id} className="group cursor-pointer bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" style={{backgroundColor: 'white', borderColor: '#e5e7eb', overflow: 'hidden'}}>
                <div className="relative overflow-hidden rounded-t-lg" style={{overflow: 'hidden'}}>
                  <img 
                    src={property.images?.[0] || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800`}
                    alt={property.title}
                    className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 bg-white" style={{backgroundColor: 'white'}}>
                  <div className="flex items-center text-sm text-gray-500 mb-2" style={{color: '#6b7280'}}>
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4" style={{color: '#111827'}}>{property.title}</h3>
                  <div className="text-2xl font-light text-gray-900" style={{color: '#111827'}}>
                    ${property.price?.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&h=800"
                alt="Luxury Real Estate Experience"
                className="rounded-lg h-96 w-full object-cover shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                Why Choose LuxeLead?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-900 text-white rounded-full p-2 mt-1">
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Market Expertise</h4>
                    <p className="text-gray-600">Deep knowledge of Austin's luxury market trends and neighborhoods.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-900 text-white rounded-full p-2 mt-1">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Personalized Service</h4>
                    <p className="text-gray-600">Tailored approach to meet your unique real estate goals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-900 text-white rounded-full p-2 mt-1">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Proven Results</h4>
                    <p className="text-gray-600">Track record of successful transactions and satisfied clients.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4">
              Stay Updated on the First to Know
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Get exclusive access to new listings, market insights, and luxury real estate opportunities.
            </p>
            <div className="flex max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-l-lg focus:outline-none"
              />
              <Button className="bg-gray-700 hover:bg-gray-600 text-white rounded-l-none">
                Subscribe
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-medium mb-2">Call</h4>
              <p className="text-gray-300">(512) 555-0123</p>
            </div>
            <div>
              <Mail className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-medium mb-2">Email</h4>
              <p className="text-gray-300">contact@luxelead.com</p>
            </div>
            <div>
              <MapPin className="h-8 w-8 mx-auto mb-4 text-gray-300" />
              <h4 className="text-lg font-medium mb-2">Office</h4>
              <p className="text-gray-300">Downtown Austin, TX</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">LuxeLead</div>
              <p className="text-gray-400 leading-relaxed">
                Austin's premier luxury real estate professional, dedicated to exceptional service and results.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Luxury Home Sales</li>
                <li>Investment Properties</li>
                <li>Market Analysis</li>
                <li>Property Management</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Areas</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Downtown Austin</li>
                <li>West Lake Hills</li>
                <li>Tarrytown</li>
                <li>Lake Austin</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>LinkedIn</li>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2024 LuxeLead Real Estate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}