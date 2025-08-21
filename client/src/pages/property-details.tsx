import React, { useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getQueryFn } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from "lucide-react";

const formatPrice = (price: number | undefined) => {
  if (price === undefined || isNaN(price)) {
    return '$0';
  }
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
};

export default function PropertyDetails() {
  const params = useParams<{ id: string }>();
  const propertyId = params?.id ? parseInt(params.id) : null;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch the property details
  const { data: property, isLoading, isError } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!propertyId
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Update current slide index when carousel scrolls
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }

  if (isError || !property) {
    return <div className="flex justify-center items-center h-screen">Property not found</div>;
  }

  // Create deduplicated image array - more explicit debugging
  console.log("🔍 Raw property data:");
  console.log("  mainImage:", `"${property.mainImage}"`);
  console.log("  images:", property.images);
  
  // Use a simple array approach with explicit duplicate checking
  const allImages: string[] = [];
  
  // Add main image if it exists
  if (property.mainImage?.trim()) {
    allImages.push(property.mainImage.trim());
    console.log("  ✅ Added main image");
  }
  
  // Process additional images
  if (property.images?.length) {
    property.images.forEach((img, index) => {
      const trimmedImg = img?.trim();
      if (trimmedImg && !allImages.includes(trimmedImg)) {
        allImages.push(trimmedImg);
        console.log(`  ✅ Added image ${index}: unique`);
      } else {
        console.log(`  ❌ Skipped image ${index}: ${!trimmedImg ? 'empty' : 'duplicate'}`);
      }
    });
  }
  
  const filteredImages = allImages;
  console.log("🎯 Final result:", filteredImages.length, "images");
  console.log("🎯 Images:", filteredImages);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <Link href="/properties">
            <Button variant="outline" size="sm" className="mb-4">
              ← Back to Properties
            </Button>
          </Link>
        </div>
      
        {/* Property Image Carousel */}
        <div className="relative w-full rounded-xl overflow-hidden mb-6">
          {filteredImages.length > 0 ? (
            <>
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {filteredImages.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative min-w-full h-[400px]"
                    >
                      <img 
                        src={image} 
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Badge variant="secondary">{property.type}</Badge>
                          <Badge>{property.status}</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel Controls */}
              {filteredImages.length > 1 && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-0 hover:bg-black/70"
                    onClick={scrollPrev}
                  >
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-0 hover:bg-black/70"
                    onClick={scrollNext}
                  >
                    <ArrowRight className="h-5 w-5 text-white" />
                  </Button>
                  
                  {/* Pagination dots */}
                  <div className="absolute bottom-4 left-0 right-0">
                    <div className="flex justify-center gap-2">
                      {filteredImages.map((_, index) => (
                        <div 
                          key={index}
                          className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-[300px] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>
        
        {/* Single Column Layout */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </CardTitle>
                <CardDescription className="text-xl font-semibold text-foreground mt-1">
                  {property.title}
                </CardDescription>
              </div>
              <Link href={`/edit-property/${propertyId}`}>
                <Button variant="outline">Edit Property</Button>
              </Link>
            </div>
            <p className="text-muted-foreground mt-2">
              {property.address}, {property.city}, {property.state} {property.zipCode}
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-around gap-6 mb-6 bg-muted/30 p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{property.bedrooms || 0}</span>
                <span className="text-sm text-muted-foreground">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">{property.bathrooms || 0}</span>
                <span className="text-sm text-muted-foreground">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">
                  {typeof property.squareFeet === 'number' 
                    ? property.squareFeet.toLocaleString() 
                    : '0'}
                </span>
                <span className="text-sm text-muted-foreground">Sq Ft</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                {property.description || "No description available."}
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-medium">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{property.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year Built</span>
                  <span className="font-medium">{property.yearBuilt ? property.yearBuilt : 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parking</span>
                  <span className="font-medium">{property.parkingSpaces || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lot Size</span>
                  <span className="font-medium">
                    {property.lotSize ? `${property.lotSize} ${property.lotSize === 1 ? 'Acre' : 'Acres'}` : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
            
            {property.features && property.features.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
          
          {/* No footer needed */}
        </Card>
      </div>
    </div>
  );
}