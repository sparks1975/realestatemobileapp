import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Star, ArrowRight, Home, Users, Award, Bed, Bath, Square, Calendar, Car, Camera, ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/SkeletonLoader";

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

export default function PropertyDetailModern() {
  const [match, params] = useRoute("/property/:id");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isThemeApplied, setIsThemeApplied] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
      let loadedFontsCount = 0;
      const totalFontsToLoad = Array.from(fontsToLoad).filter(font => font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)).length;
      
      if (totalFontsToLoad === 0) {
        setFontsLoaded(true);
      }
      
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
          
          link.onload = () => {
            loadedFontsCount++;
            setTimeout(() => {
              if (loadedFontsCount >= totalFontsToLoad) {
                setFontsLoaded(true);
              }
            }, 200);
          };
          link.onerror = () => {
            loadedFontsCount++;
            if (loadedFontsCount >= totalFontsToLoad) {
              setFontsLoaded(true);
            }
          };
        }
      });
      
      setIsThemeApplied(true);
    } else {
      setIsThemeApplied(true);
      setFontsLoaded(true);
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  useEffect(() => {
    if (!isLoading && themeSettings && property && isThemeApplied && fontsLoaded) {
      setShowSkeleton(false);
    }
  }, [isLoading, themeSettings, property, isThemeApplied, fontsLoaded]);

  // Get all images for gallery
  const allImages = property ? [
    property.mainImage || property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800",
    ...property.images.slice(property.mainImage ? 0 : 1)
  ] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const isDataLoading = isLoading || !themeSettings || !property || !isThemeApplied || !fontsLoaded;
  
  if (showSkeleton || isDataLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <Header />
        
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Skeleton className="h-96 w-full mb-4" />
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-12 w-1/3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="text-center">
          <h1 
            className="text-2xl mb-4"
            style={{ 
              color: 'var(--text-color)',
              fontFamily: 'var(--heading-font)',
              fontWeight: 'var(--heading-font-weight)'
            }}
          >
            Property Not Found
          </h1>
          <a 
            href="/properties"
            className="text-sm uppercase tracking-wide hover:opacity-70 transition-colors"
            style={{ 
              color: 'var(--primary-color)',
              fontFamily: 'var(--body-font)'
            }}
          >
            ← Back to Properties
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      <Header />

      {/* Main Content */}
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <a 
              href="/"
              className="hover:opacity-70 transition-colors"
              style={{ 
                color: 'var(--text-color)',
                fontFamily: 'var(--body-font)'
              }}
            >
              Home
            </a>
            <span style={{ color: 'var(--text-color)' }}>/</span>
            <a 
              href="/properties"
              className="hover:opacity-70 transition-colors"
              style={{ 
                color: 'var(--text-color)',
                fontFamily: 'var(--body-font)'
              }}
            >
              Properties
            </a>
            <span style={{ color: 'var(--text-color)' }}>/</span>
            <span 
              className="opacity-60"
              style={{ 
                color: 'var(--text-color)',
                fontFamily: 'var(--body-font)'
              }}
            >
              {property.title}
            </span>
          </div>
        </div>

        {/* Hero Section with Images */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Main Image */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={allImages[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white transition-colors p-2 rounded-full"
                    >
                      <ChevronLeft size={20} style={{ color: 'var(--text-color)' }} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white transition-colors p-2 rounded-full"
                    >
                      <ChevronRight size={20} style={{ color: 'var(--text-color)' }} />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-6 gap-2 mt-4">
                  {allImages.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square overflow-hidden transition-opacity ${
                        index === currentImageIndex ? 'ring-2 opacity-100' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ 
                        '--tw-ring-color': index === currentImageIndex ? 'var(--primary-color)' : 'transparent'
                      } as any}
                    >
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="outline"
                    className="uppercase tracking-wide"
                    style={{ 
                      borderColor: 'var(--primary-color)',
                      color: 'var(--primary-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    {property.status}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:opacity-70 transition-opacity">
                      <Share2 size={20} style={{ color: 'var(--text-color)' }} />
                    </button>
                    <button className="p-2 hover:opacity-70 transition-opacity">
                      <Heart size={20} style={{ color: 'var(--text-color)' }} />
                    </button>
                  </div>
                </div>
                
                <h1 
                  className="text-3xl lg:text-4xl leading-tight mb-4"
                  style={{ 
                    color: 'var(--text-color)',
                    fontFamily: 'var(--heading-font)',
                    fontWeight: 'var(--heading-font-weight)'
                  }}
                >
                  {property.title}
                </h1>
                
                <div 
                  className="flex items-center text-sm opacity-70 mb-6"
                  style={{ 
                    color: 'var(--text-color)',
                    fontFamily: 'var(--body-font)'
                  }}
                >
                  <MapPin size={16} className="mr-2" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </div>
                
                <div 
                  className="text-4xl font-light mb-8"
                  style={{ 
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--heading-font)'
                  }}
                >
                  ${property.price.toLocaleString()}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-opacity-20" style={{ borderColor: 'var(--text-color)' }}>
                <div className="text-center">
                  <div 
                    className="text-2xl mb-1"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 'var(--heading-font-weight)'
                    }}
                  >
                    {property.bedrooms}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wide opacity-70"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Bedrooms
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl mb-1"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 'var(--heading-font-weight)'
                    }}
                  >
                    {property.bathrooms}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wide opacity-70"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Bathrooms
                  </div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl mb-1"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 'var(--heading-font-weight)'
                    }}
                  >
                    {property.squareFeet.toLocaleString()}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wide opacity-70"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Sq Ft
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <Button 
                className="w-full py-4 text-sm uppercase tracking-wide"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                Schedule a Viewing
              </Button>
            </div>
          </div>
        </section>

        {/* Detailed Information */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 
                  className="text-2xl mb-6"
                  style={{ 
                    color: 'var(--text-color)',
                    fontFamily: 'var(--heading-font)',
                    fontWeight: 'var(--heading-font-weight)'
                  }}
                >
                  About This Property
                </h2>
                <p 
                  className="leading-relaxed opacity-80"
                  style={{ 
                    color: 'var(--text-color)',
                    fontFamily: 'var(--body-font)'
                  }}
                >
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 
                    className="text-xl mb-4"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 'var(--heading-font-weight)'
                    }}
                  >
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center text-sm"
                        style={{ 
                          color: 'var(--text-color)',
                          fontFamily: 'var(--body-font)'
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: 'var(--primary-color)' }}
                        ></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div>
              <h3 
                className="text-xl mb-6"
                style={{ 
                  color: 'var(--text-color)',
                  fontFamily: 'var(--heading-font)',
                  fontWeight: 'var(--heading-font-weight)'
                }}
              >
                Property Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-opacity-10" style={{ borderColor: 'var(--text-color)' }}>
                  <span 
                    className="text-sm uppercase tracking-wide opacity-70"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Property Type
                  </span>
                  <span 
                    className="text-sm"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    {property.type}
                  </span>
                </div>
                
                {property.yearBuilt && (
                  <div className="flex justify-between py-3 border-b border-opacity-10" style={{ borderColor: 'var(--text-color)' }}>
                    <span 
                      className="text-sm uppercase tracking-wide opacity-70"
                      style={{ 
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      Year Built
                    </span>
                    <span 
                      className="text-sm"
                      style={{ 
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      {property.yearBuilt}
                    </span>
                  </div>
                )}
                
                {property.lotSize && (
                  <div className="flex justify-between py-3 border-b border-opacity-10" style={{ borderColor: 'var(--text-color)' }}>
                    <span 
                      className="text-sm uppercase tracking-wide opacity-70"
                      style={{ 
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      Lot Size
                    </span>
                    <span 
                      className="text-sm"
                      style={{ 
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      {property.lotSize.toLocaleString()} sq ft
                    </span>
                  </div>
                )}
                
                {property.parkingSpaces && (
                  <div className="flex justify-between py-3 border-b border-opacity-10" style={{ borderColor: 'var(--text-color)' }}>
                    <span 
                      className="text-sm uppercase tracking-wide opacity-70"
                      style={{ 
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      Parking
                    </span>
                    <span 
                      className="text-sm"
                      style={{ 
                        color: 'var(--text-color)',
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      {property.parkingSpaces}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between py-3">
                  <span 
                    className="text-sm uppercase tracking-wide opacity-70"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Listed
                  </span>
                  <span 
                    className="text-sm"
                    style={{ 
                      color: 'var(--text-color)',
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 
              className="text-3xl mb-6"
              style={{ 
                color: 'var(--tertiary-color)',
                fontFamily: 'var(--heading-font)',
                fontWeight: 'var(--heading-font-weight)'
              }}
            >
              Interested in This Property?
            </h2>
            <p 
              className="text-lg opacity-80 mb-8"
              style={{ 
                color: 'var(--tertiary-color)',
                fontFamily: 'var(--body-font)'
              }}
            >
              Contact our team to schedule a private viewing or get more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="px-8 py-3 text-sm uppercase tracking-wide"
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                Schedule Viewing
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3 text-sm uppercase tracking-wide"
                style={{ 
                  borderColor: 'var(--tertiary-color)',
                  color: 'var(--tertiary-color)',
                  fontFamily: 'var(--button-font)',
                  fontWeight: 'var(--button-font-weight)'
                }}
              >
                Get More Info
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}