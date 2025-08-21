import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award, Menu, X, Bed, Bath, Square, Calendar, Car, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";

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

export default function PropertyDetailPage() {
  const [match, params] = useRoute("/property/:id");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Load property data
  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['/api/properties', params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${params?.id}`);
      if (!response.ok) throw new Error('Property not found');
      return response.json();
    },
    enabled: !!params?.id
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
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      });
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Property not found</div>;
  }

  // Create deduplicated image array
  console.log("🔍 Property Detail Page - Raw Data:");
  console.log("  mainImage:", property.mainImage);
  console.log("  images:", property.images);
  
  const imageSet = new Set<string>();
  
  // Add main image first if it exists
  if (property.mainImage?.trim()) {
    imageSet.add(property.mainImage);
  }
  
  // Add additional images, Set automatically prevents duplicates
  if (property.images?.length) {
    property.images.forEach(img => {
      if (img?.trim()) {
        imageSet.add(img);
      }
    });
  }
  
  const allImages = Array.from(imageSet);
  
  console.log("🎯 Final unique images:", allImages.length);
  console.log("🎯 Images:", allImages);

  return (
    <div className="property-detail min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      {/* Navigation - Same as homepage */}
      <nav 
        className="fixed top-0 w-full backdrop-blur-sm z-50"
        style={{ backgroundColor: 'var(--header-background-color)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div 
              className="text-2xl font-light tracking-wider"
              style={{ color: 'var(--navigation-color)' }}
            >
              <a href="/">LUXELEAD</a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <a 
                href="/#home" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                Home
              </a>
              <a 
                href="/#properties" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                Properties
              </a>
              <a 
                href="/#about" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                About
              </a>
              <a 
                href="/#contact" 
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
            
            <div 
              className="flex-1 px-6 py-8 w-full"
              style={{ backgroundColor: 'var(--header-background-color)' }}
            >
              <div className="space-y-6">
                <a 
                  href="/#home" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/#properties" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Properties
                </a>
                <a 
                  href="/#about" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="/#contact" 
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

      {/* Main Content */}
      <div>
        {/* Hero Image Section */}
        <section className="relative" style={{ height: '70vh' }}>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${allImages[currentImageIndex] || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&h=1080'}')`
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          {/* Image Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1)}
              >
                <ArrowRight className="rotate-180" size={20} />
              </button>
              <button
                className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                onClick={() => setCurrentImageIndex(currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0)}
              >
                <ArrowRight size={20} />
              </button>
              
              {/* Image Dots */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Property Title Overlay */}
          <div className="absolute bottom-24 left-8 text-white">
            <h1 
              className="text-5xl font-light mb-4"
              style={{ fontFamily: 'var(--heading-font)' }}
            >
              {property.title}
            </h1>
            <p className="text-xl opacity-90 flex items-center">
              <MapPin size={20} className="mr-2" />
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
        </section>

        {/* Property Information Section */}
        <section className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Property Details */}
                <div className="mb-12">
                  <h2 
                    className="text-3xl font-light mb-6"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    Property Information
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div 
                        className="text-3xl font-bold mb-2"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {property.bedrooms}
                      </div>
                      <div 
                        className="text-sm uppercase tracking-wide"
                        style={{ color: 'var(--text-color)' }}
                      >
                        Bedrooms
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-3xl font-bold mb-2"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {property.bathrooms}
                      </div>
                      <div 
                        className="text-sm uppercase tracking-wide"
                        style={{ color: 'var(--text-color)' }}
                      >
                        Bathrooms
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-3xl font-bold mb-2"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {property.squareFeet.toLocaleString()}
                      </div>
                      <div 
                        className="text-sm uppercase tracking-wide"
                        style={{ color: 'var(--text-color)' }}
                      >
                        Sq Ft
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-3xl font-bold mb-2"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {property.yearBuilt || 'N/A'}
                      </div>
                      <div 
                        className="text-sm uppercase tracking-wide"
                        style={{ color: 'var(--text-color)' }}
                      >
                        Year Built
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-12">
                  <h3 
                    className="text-2xl font-light mb-4"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                  >
                    Description
                  </h3>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
                  >
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mb-12">
                    <h3 
                      className="text-2xl font-light mb-6"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      Features & Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.features.map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-center p-3 rounded-lg"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                          <span className="mr-3" style={{ color: 'var(--primary-color)' }}>-</span>
                          <span style={{ color: 'var(--text-color)' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Gallery */}
                {allImages.length > 1 && (
                  <div className="mb-12">
                    <h3 
                      className="text-2xl font-light mb-6"
                      style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                    >
                      Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {allImages.slice(1, 7).map((image, index) => (
                        <div 
                          key={index}
                          className="relative h-48 bg-cover bg-center rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundImage: `url('${image}')` }}
                          onClick={() => setCurrentImageIndex(index + 1)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Price & Contact */}
                <Card className="mb-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                  <CardContent className="p-6">
                    <div 
                      className="text-4xl font-bold mb-6"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      ${property.price.toLocaleString()}
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center">
                        <Bed size={20} className="mr-3" style={{ color: 'var(--primary-color)' }} />
                        <span style={{ color: 'var(--text-color)' }}>{property.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center">
                        <Bath size={20} className="mr-3" style={{ color: 'var(--primary-color)' }} />
                        <span style={{ color: 'var(--text-color)' }}>{property.bathrooms} Bathrooms</span>
                      </div>
                      <div className="flex items-center">
                        <Square size={20} className="mr-3" style={{ color: 'var(--primary-color)' }} />
                        <span style={{ color: 'var(--text-color)' }}>{property.squareFeet.toLocaleString()} Sq Ft</span>
                      </div>
                      {property.yearBuilt && (
                        <div className="flex items-center">
                          <Calendar size={20} className="mr-3" style={{ color: 'var(--primary-color)' }} />
                          <span style={{ color: 'var(--text-color)' }}>Built in {property.yearBuilt}</span>
                        </div>
                      )}
                      {property.parkingSpaces && (
                        <div className="flex items-center">
                          <Car size={20} className="mr-3" style={{ color: 'var(--primary-color)' }} />
                          <span style={{ color: 'var(--text-color)' }}>{property.parkingSpaces} Parking</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button 
                        className="w-full py-3 text-white uppercase tracking-wide"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                      >
                        Schedule Viewing
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full py-3 uppercase tracking-wide"
                        style={{ 
                          borderColor: 'var(--primary-color)', 
                          color: 'var(--primary-color)',
                          backgroundColor: 'transparent'
                        }}
                      >
                        Contact Agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Status */}
                <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: 'none' }}>
                  <CardContent className="p-6">
                    <h4 
                      className="text-lg font-medium mb-4"
                      style={{ color: 'var(--text-color)' }}
                    >
                      Property Status
                    </h4>
                    <Badge 
                      className="mb-4"
                      style={{ 
                        backgroundColor: property.status === 'For Sale' ? 'var(--primary-color)' : 'var(--secondary-color)',
                        color: 'white'
                      }}
                    >
                      {property.status}
                    </Badge>
                    <div className="space-y-2 text-sm" style={{ color: 'var(--text-color)' }}>
                      <div>Property Type: {property.type}</div>
                      <div>Listed: {new Date(property.createdAt).toLocaleDateString()}</div>
                      {property.lotSize && <div>Lot Size: {property.lotSize.toLocaleString()} sq ft</div>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <h2 
              className="text-3xl font-light text-center mb-12"
              style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
            >
              Property Location
            </h2>
            <div 
              className="h-96 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <div className="text-center" style={{ color: 'var(--text-color)' }}>
                <MapPin size={48} className="mx-auto mb-4" style={{ color: 'var(--primary-color)' }} />
                <h3 className="text-xl font-medium mb-2">Interactive Map</h3>
                <p className="text-sm opacity-70">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
                <p className="text-xs mt-2 opacity-50">
                  Map integration would be implemented here
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16" style={{ backgroundColor: 'var(--header-background-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div 
                className="text-3xl font-light tracking-wider mb-8"
                style={{ color: 'var(--navigation-color)' }}
              >
                LUXELEAD
              </div>
              <div className="flex justify-center space-x-8 mb-8">
                <a 
                  href="/#home"
                  className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--navigation-color)' }}
                >
                  Home
                </a>
                <a 
                  href="/#properties"
                  className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--navigation-color)' }}
                >
                  Properties
                </a>
                <a 
                  href="/#about"
                  className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--navigation-color)' }}
                >
                  About
                </a>
                <a 
                  href="/#contact"
                  className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--navigation-color)' }}
                >
                  Contact
                </a>
              </div>
              <p 
                className="text-sm opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                © 2024 LuxeLead. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}