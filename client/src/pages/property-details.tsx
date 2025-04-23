import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Property } from "@shared/schema";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PropertyDetailsHeader from "@/components/layout/PropertyDetailsHeader";
import { properties } from "@/lib/mock-data";

export default function PropertyDetails() {
  const { id } = useParams();
  const propertyId = parseInt(id);
  
  // Fetch property details
  const { data, isLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: async () => {
      // For demo purposes, use mock data
      // In a real app, this would fetch from the API
      const property = properties.find(p => p.id === propertyId);
      if (!property) {
        throw new Error("Property not found");
      }
      return property;
    }
  });
  
  // Format price display
  const formatPrice = (property?: Property) => {
    if (!property) return "";
    
    if (property.type === "For Rent") {
      return `$${new Intl.NumberFormat().format(property.price)}/month`;
    } else {
      return `$${new Intl.NumberFormat().format(property.price)}`;
    }
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-72 bg-muted"></div>
        <div className="px-4 py-6">
          <div className="h-8 bg-muted rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
          <div className="h-4 bg-muted rounded mb-2 w-1/3"></div>
          <div className="h-32 bg-muted rounded mb-6"></div>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Property not found</p>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-auto pb-20">
      {/* Property Images Gallery */}
      <PropertyDetailsHeader type={data.type as "For Sale" | "For Rent"} images={data.images} />
      
      {/* Property Details */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{data.title}</h1>
          <span className="text-xl font-bold text-primary">{formatPrice(data)}</span>
        </div>
        <p className="text-muted-foreground mb-4">
          {data.address}, {data.city}, {data.state} {data.zipCode}
        </p>
        
        {/* Property Features */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-3 text-center">
            <svg className="w-5 h-5 mx-auto text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <p className="text-sm">{data.bedrooms} Bedrooms</p>
          </Card>
          
          <Card className="p-3 text-center">
            <svg className="w-5 h-5 mx-auto text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">{data.bathrooms} Bathrooms</p>
          </Card>
          
          <Card className="p-3 text-center">
            <svg className="w-5 h-5 mx-auto text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <p className="text-sm">{new Intl.NumberFormat().format(data.squareFeet)} sqft</p>
          </Card>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Description</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{data.description}</p>
        </div>
        
        {/* Features & Amenities */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Features & Amenities</h2>
          <div className="grid grid-cols-2 gap-2">
            {data.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Location Map */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Location</h2>
          <div className="bg-muted h-48 rounded-xl overflow-hidden relative flex items-center justify-center">
            <div className="text-center">
              <svg className="w-8 h-8 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-muted-foreground">Map View</p>
            </div>
          </div>
        </div>
        
        {/* Agent Info */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Listed By</h2>
          <Card className="p-4 flex items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=70&h=70" 
                alt="Alex Morgan" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Alex Morgan</h3>
              <p className="text-sm text-muted-foreground mb-1">Premium Realtor</p>
              <div className="flex items-center text-primary text-xs">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-muted-foreground ml-1">4.8 (120 reviews)</span>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button className="flex-1 bg-primary shadow-glow-primary">
            Schedule Viewing
          </Button>
          <Button variant="outline" className="flex-1">
            Contact Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
