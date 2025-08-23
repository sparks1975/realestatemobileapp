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

  // Get all images for gallery, avoiding duplicates
  const allImages = property ? (() => {
    const images = [];
    const mainImg = property.mainImage || property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800";
    
    // Add main image first
    images.push(mainImg);
    
    // Add other images, excluding the main image if it's already in the array
    property.images.forEach(img => {
      if (img !== mainImg) {
        images.push(img);
      }
    });
    
    return images;
  })() : [];

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
        
        <div className="pt-24">
          {/* Full Width Skeleton */}
          <div className="relative h-screen">
            <Skeleton className="h-full w-full" />
            {/* Skeleton overlay content */}
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 max-w-lg">
              <Skeleton className="h-6 w-20 mb-4" />
              <Skeleton className="h-12 w-80 mb-4" />
              <Skeleton className="h-6 w-60 mb-6" />
              <Skeleton className="h-10 w-40 mb-8" />
              <div className="flex gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
            {/* Skeleton thumbnails at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: '120px' }}>
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="flex-1 h-full" />)}
            </div>
          </div>
          
          {/* Content sections skeleton */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex justify-between py-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
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

        {/* Hero Section with Full Width Images */}
        <section className="mb-16">
          {/* Full Width Image Rotator */}
          <div className="relative h-screen overflow-hidden bg-gray-100">
            <img
              src={allImages[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Property Details Overlay */}
            <div className="absolute top-1/2 left-24 transform -translate-y-1/2 text-white max-w-lg z-10">
              <div className="mb-4">
                <Badge 
                  variant="outline"
                  className="uppercase tracking-wide border-white text-white"
                  style={{ 
                    fontFamily: 'var(--body-font)'
                  }}
                >
                  {property.status}
                </Badge>
              </div>
              
              <h1 
                className="text-4xl lg:text-5xl leading-tight mb-4"
                style={{ 
                  fontFamily: 'var(--heading-font)',
                  fontWeight: 'var(--heading-font-weight)'
                }}
              >
                {property.title}
              </h1>
              
              <div 
                className="flex items-center text-sm opacity-90 mb-6"
                style={{ 
                  fontFamily: 'var(--body-font)'
                }}
              >
                <MapPin size={16} className="mr-2" />
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </div>
              
              <div 
                className="text-4xl font-light mb-8"
                style={{ 
                  fontFamily: 'var(--heading-font)'
                }}
              >
                ${property.price.toLocaleString()}
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-8 text-sm">
                <div>
                  <div 
                    className="text-xl mb-1"
                    style={{ 
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 'var(--heading-font-weight)'
                    }}
                  >
                    {property.bedrooms}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wide opacity-80"
                    style={{ 
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Bedrooms
                  </div>
                </div>
                <div>
                  <div 
                    className="text-xl mb-1"
                    style={{ 
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 'var(--heading-font-weight)'
                    }}
                  >
                    {property.bathrooms % 1 === 0 ? property.bathrooms : property.bathrooms.toFixed(1)}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wide opacity-80"
                    style={{ 
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Bathrooms
                  </div>
                </div>
                <div>
                  <div 
                    className="text-xl mb-1"
                    style={{ 
                      fontFamily: 'var(--heading-font)',
                      fontWeight: 'var(--heading-font-weight)'
                    }}
                  >
                    {property.squareFeet.toLocaleString()}
                  </div>
                  <div 
                    className="text-xs uppercase tracking-wide opacity-80"
                    style={{ 
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    Sq Ft
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons Overlay */}
            <div className="absolute top-8 right-8 flex items-center space-x-4 z-10">
              <button className="p-3 bg-white/20 hover:bg-white/30 transition-colors rounded-full backdrop-blur-sm">
                <Share2 size={20} className="text-white" />
              </button>
              <button className="p-3 bg-white/20 hover:bg-white/30 transition-colors rounded-full backdrop-blur-sm">
                <Heart size={20} className="text-white" />
              </button>
            </div>
            
            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-full backdrop-blur-sm z-10"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-full backdrop-blur-sm z-10"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-8 right-8 bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-10">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
            
            {/* Full Width Thumbnails at Bottom */}
            {allImages.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <div className="flex" style={{ height: '120px' }}>
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-1 relative overflow-hidden transition-opacity ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                      }`}
                      style={{ 
                        borderTop: index === currentImageIndex ? `3px solid var(--primary-color)` : '3px solid transparent'
                      }}
                    >
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === currentImageIndex && (
                        <div className="absolute inset-0 border-t-2" style={{ borderColor: 'var(--primary-color)' }}></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                {/* Property Type - Always shown */}
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

                {/* Year Built - Only if > 0 */}
                {(property.yearBuilt > 0) && (
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

                {/* Lot Size - Only if > 0 */}
                {(property.lotSize > 0) && (
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

                {/* Parking - Only if not empty and not "0" */}
                {(property.parkingSpaces && property.parkingSpaces.trim() && property.parkingSpaces !== "0") && (
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