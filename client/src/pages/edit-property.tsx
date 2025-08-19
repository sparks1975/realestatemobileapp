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
import { X, Plus, Image } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Helper function to compress images before upload
const compressImage = (file: File, callback: (dataUrl: string) => void) => {
  // Create a FileReader to read the image
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = document.createElement('img');
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      
      // Calculate new dimensions (max width/height of 1200px)
      let width = img.width;
      let height = img.height;
      const maxDimension = 1200;
      
      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
      
      // Resize the canvas
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image on the canvas
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Get the compressed image as a data URL
      // Adjust quality (0.6 = 60% quality) to reduce file size further
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
      
      // Call the callback with the compressed image data
      callback(compressedDataUrl);
    };
    img.src = event.target?.result as string;
  };
  
  // Read the file as a data URL
  reader.readAsDataURL(file);
};

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
    lotSize: "",
    yearBuilt: "",
    parkingSpaces: "",
    description: "",
    features: [] as string[],
  });
  
  // State for property images
  const [mainImage, setMainImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch the property details
  const { data: property, isLoading } = useQuery({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!propertyId
  });

  // Create a mutation for updating the property
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('🌐 Edit Property - Making PUT request to raw endpoint:', data);
      const requestBody = JSON.stringify(data);
      console.log('📦 Edit Property - Serialized body length:', requestBody.length);
      
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/properties/${propertyId}/raw`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: requestBody
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Edit Property - PUT failed:', response.status, errorText);
        throw new Error(`Failed to update property: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🎉 Edit Property - Updated successfully:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
      
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      
      // Navigate back to property details
      setLocation(`/property-details/${propertyId}`);
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
      console.log("Property data:", property);
      setForm({
        title: property.title || "",
        type: property.type || "",
        status: property.status || "",
        address: property.address || "",
        city: property.city || "",
        state: property.state || "",
        zipCode: property.zipCode || "",
        price: property.price ? property.price.toString() : "0",
        bedrooms: property.bedrooms ? property.bedrooms.toString() : "0",
        bathrooms: property.bathrooms ? property.bathrooms.toString() : "0",
        squareFeet: property.squareFeet ? property.squareFeet.toString() : "0",
        lotSize: property.lotSize ? property.lotSize.toString() : "0",
        yearBuilt: property.yearBuilt ? property.yearBuilt.toString() : "0",
        parkingSpaces: property.parkingSpaces ? property.parkingSpaces.toString() : "0",
        description: property.description || "",
        features: property.features || [],
      });
      
      // Set images data
      setMainImage(property.mainImage || "");
      
      // If property has images, set them; otherwise, set empty array
      if (property.images && Array.isArray(property.images)) {
        // Filter out the main image from the images array to avoid duplicates
        const additionalImages = property.images.filter(img => img !== property.mainImage);
        setImages(additionalImages);
      } else {
        setImages([]);
      }
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.title || !form.price || !form.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate mainImage
    if (!mainImage) {
      toast({
        title: "Image Required",
        description: "Please add at least one main image for the property",
        variant: "destructive",
      });
      return;
    }
    
    // Create a clean update object with proper type conversions
    const updates = {
      title: form.title,
      type: form.type,
      status: form.status,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      price: parseFloat(form.price),
      bedrooms: parseInt(form.bedrooms, 10) || 0,
      bathrooms: parseFloat(form.bathrooms) || 0,
      squareFeet: parseInt(form.squareFeet, 10) || 0,
      lotSize: parseFloat(form.lotSize) || 0,
      yearBuilt: parseInt(form.yearBuilt, 10) || 0,
      parkingSpaces: form.parkingSpaces,
      description: form.description,
      features: form.features,
      // Add image data
      mainImage: mainImage,
      images: [mainImage, ...images].filter(Boolean),
    };
    
    console.log('Submitting property update:', updates);
    updateMutation.mutate(updates);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle adding a new image
  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Invalid Image URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }
    
    // If main image is not set, set this as main image
    if (!mainImage) {
      setMainImage(newImageUrl);
    } else {
      // Otherwise add to additional images array
      setImages(prev => [...prev, newImageUrl]);
    }
    
    // Clear the input
    setNewImageUrl("");
  };
  
  // Handle setting an image as the main image
  const handleSetMainImage = (imageUrl: string) => {
    // Add current main image to additional images if it exists
    if (mainImage) {
      setImages(prev => [...prev, mainImage]);
    }
    
    // Set new main image
    setMainImage(imageUrl);
    
    // Remove from additional images
    setImages(prev => prev.filter(img => img !== imageUrl));
  };
  
  // Handle removing an image
  const handleRemoveImage = (imageUrl: string) => {
    if (imageUrl === mainImage) {
      // If removing main image, set first additional image as main
      if (images.length > 0) {
        const [firstImage, ...remainingImages] = images;
        setMainImage(firstImage);
        setImages(remainingImages);
      } else {
        // No additional images, just clear main image
        setMainImage("");
      }
    } else {
      // Remove from additional images
      setImages(prev => prev.filter(img => img !== imageUrl));
    }
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
            
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size (acres)</Label>
                <Input 
                  id="lotSize" 
                  name="lotSize" 
                  type="number" 
                  step="0.01"
                  value={form.lotSize} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input 
                  id="yearBuilt" 
                  name="yearBuilt" 
                  type="number" 
                  value={form.yearBuilt} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkingSpaces">Parking</Label>
                <Input 
                  id="parkingSpaces" 
                  name="parkingSpaces" 
                  type="text" 
                  value={form.parkingSpaces} 
                  onChange={handleChange} 
                  placeholder="E.g., 2-Car Garage, Street Parking"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="features">Features</Label>
              <div className="flex flex-wrap gap-2 border rounded-md p-3">
                {form.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-secondary/10 rounded-full px-3 py-1">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          features: prev.features.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
                <div className="relative w-full">
                  <Input 
                    id="newFeature" 
                    placeholder="Add feature (e.g., 'Fireplace') and press Enter"
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        const value = target.value.trim();
                        if (value) {
                          setForm(prev => ({
                            ...prev, 
                            features: [...prev.features, value]
                          }));
                          target.value = '';
                        }
                      }
                    }}
                  />
                </div>
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
            
            <Separator className="my-4" />
            
            {/* Property Images Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Property Images</Label>
              </div>
              
              {/* Main Image */}
              {mainImage && (
                <div className="space-y-2">
                  <Label>Main Image</Label>
                  <div className="relative aspect-video overflow-hidden rounded-md border border-border">
                    <img 
                      src={mainImage} 
                      alt="Main property view" 
                      className="w-full h-full object-cover" 
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      className="absolute top-2 right-2 p-1 h-8 w-8" 
                      onClick={() => handleRemoveImage(mainImage)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Additional Images Gallery */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <Label>Additional Images</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-video rounded-md border border-border overflow-hidden">
                        <img 
                          src={img} 
                          alt={`Property view ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm" 
                            className="p-1 h-8 w-8" 
                            onClick={() => handleSetMainImage(img)}
                            title="Set as main image"
                          >
                            <Image size={16} />
                          </Button>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            className="p-1 h-8 w-8" 
                            onClick={() => handleRemoveImage(img)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add New Image */}
              <div className="space-y-2">
                <Label htmlFor="imageUpload">Upload Image</Label>
                <div className="flex flex-col space-y-2">
                  {/* Hide the actual file input but keep it in the DOM */}
                  <Input 
                    ref={fileInputRef}
                    id="imageUpload" 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      // Get the selected file
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      // Process and compress the image
                      compressImage(file, (compressedImageDataUrl) => {
                        // If main image is not set, set this as main image
                        if (!mainImage) {
                          setMainImage(compressedImageDataUrl);
                        } else {
                          // Otherwise add to additional images array
                          setImages(prev => [...prev, compressedImageDataUrl]);
                        }
                        
                        // Reset file input
                        e.target.value = '';
                      });
                    }}
                  />
                  
                  {/* Custom drag and drop area */}
                  <div 
                    className={`
                      border-2 border-dashed rounded-md p-8
                      flex flex-col items-center justify-center
                      cursor-pointer transition-colors
                      ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
                      hover:border-primary/50 hover:bg-background
                    `}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragging(false);
                      
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        // Only process images
                        const imageFiles = Array.from(files).filter(file => 
                          file.type.startsWith('image/')
                        );
                        
                        // Process each image file
                        imageFiles.forEach(file => {
                          // Use the compression function
                          compressImage(file, (compressedImageDataUrl) => {
                            // If main image is not set, set the first one as main
                            if (!mainImage) {
                              setMainImage(compressedImageDataUrl);
                            } else {
                              // Add to additional images
                              setImages(prev => [...prev, compressedImageDataUrl]);
                            }
                          });
                        });
                        
                        if (imageFiles.length > 0) {
                          toast({
                            title: "Images Added",
                            description: `Added ${imageFiles.length} images successfully.`,
                          });
                        }
                      }
                    }}
                  >
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="rounded-full p-3 bg-primary/10">
                        <Image className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Drag and drop your images, or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Support for JPG, PNG, and GIF images
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Alternative URL input method */}
                  <div className="mt-4 pt-4 border-t">
                    <Label htmlFor="newImageUrl">Or Add Image by URL</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input 
                        id="newImageUrl" 
                        value={newImageUrl} 
                        onChange={(e) => setNewImageUrl(e.target.value)} 
                        placeholder="Enter image URL" 
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddImage}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation(`/property-details/${propertyId}`)}
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