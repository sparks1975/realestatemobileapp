import React from "react";
import { useLocation, useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getQueryFn } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";

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

  // Fetch the property details
  const { data: property, isLoading, isError } = useQuery<Property>({
    queryKey: ['/api/properties', propertyId],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!propertyId
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }

  if (isError || !property) {
    return <div className="flex justify-center items-center h-screen">Property not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        {/* Property Image */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6">
          <img 
            src={property.mainImage} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge variant="secondary">{property.type}</Badge>
            <Badge>{property.status}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2">
            <Card>
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
                <div className="flex gap-6 mb-6">
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
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {property.description || "No description available."}
                  </p>
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
              
              <CardFooter>
                <Button size="lg" className="w-full">Contact Agent</Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-medium">{property.type}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{property.status}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year Built</span>
                  <span className="font-medium">2020</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parking</span>
                  <span className="font-medium">2 Car Garage</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lot Size</span>
                  <span className="font-medium">0.25 Acres</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}