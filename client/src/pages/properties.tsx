import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Bed, Bath, Square, Star, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { Breadcrumb, createPropertyBreadcrumbs } from "@/components/Breadcrumb";

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  type: string;
  status: string;
  mainImage?: string;
  images: string[];
}

export default function Properties() {
  const [, navigate] = useLocation();
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <Breadcrumb 
            items={createPropertyBreadcrumbs.adminProperties()}
            className="light-background"
          />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Properties</h1>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <Breadcrumb 
          items={createPropertyBreadcrumbs.adminProperties()}
          className="light-background"
        />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
      
      <div className="space-y-4">
        {properties?.map((property) => (
          <Card 
            key={property.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/app/property-details/${property.id}`)}
          >
            <CardContent className="p-0">
              <div className="flex">
                <div className="w-24 h-24 relative">
                  <img 
                    src={property.mainImage || property.images?.[0] || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&h=200`}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    variant={property.status === 'available' ? 'default' : 'secondary'} 
                    className="absolute top-1 left-1 text-xs"
                  >
                    {property.status}
                  </Badge>
                </div>
                
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm leading-tight card-title">
                      {property.title}
                    </h3>
                    <span className="text-sm font-bold text-primary">
                      ${property.price?.toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {property.address}, {property.city}
                  </p>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="w-3 h-3 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-3 h-3 mr-1" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-3 h-3 mr-1" />
                      {property.squareFeet?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}