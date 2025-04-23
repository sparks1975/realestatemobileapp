import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function EditProperty() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const propertyId = params?.id ? parseInt(params.id) : null;

  const [form, setForm] = useState({
    title: "",
    type: "",
    status: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    description: "",
  });

  // Fetch the property details
  const { data: property, isLoading } = useQuery({
    queryKey: ['/api/properties', propertyId],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!propertyId
  });

  // Create a mutation for updating the property
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties', propertyId] });
      
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      
      // Navigate back to property details
      setLocation(`/property/${propertyId}`);
    },
    onError: (error) => {
      console.error("Error updating property:", error);
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Populate the form when property data is available
  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        type: property.type,
        status: property.status,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        price: property.price.toString(),
        bedrooms: property.bedrooms.toString(),
        bathrooms: property.bathrooms.toString(),
        squareFeet: property.squareFeet.toString(),
        description: property.description || "",
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProperty = {
      ...form,
      price: parseFloat(form.price),
      bedrooms: parseInt(form.bedrooms),
      bathrooms: parseInt(form.bathrooms),
      squareFeet: parseInt(form.squareFeet),
    };
    
    updateMutation.mutate(updatedProperty);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }

  if (!property) {
    return <div className="flex justify-center items-center h-screen">Property not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Property</CardTitle>
          <CardDescription>Update the details for this property</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input 
                id="title" 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input 
                  id="type" 
                  name="type" 
                  value={form.type} 
                  onChange={handleChange} 
                  placeholder="E.g., For Sale, For Rent" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input 
                  id="status" 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange} 
                  placeholder="E.g., Active, Pending" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address*</Label>
              <Input 
                id="address" 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={form.city} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  name="state" 
                  value={form.state} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input 
                  id="zipCode" 
                  name="zipCode" 
                  value={form.zipCode} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price*</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                value={form.price} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input 
                  id="bedrooms" 
                  name="bedrooms" 
                  type="number" 
                  value={form.bedrooms} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input 
                  id="bathrooms" 
                  name="bathrooms" 
                  type="number" 
                  value={form.bathrooms} 
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input 
                  id="squareFeet" 
                  name="squareFeet" 
                  type="number" 
                  value={form.squareFeet} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                rows={5} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation(`/property/${propertyId}`)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}