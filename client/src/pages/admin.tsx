import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, Edit2, Trash2, Search, Filter, Download, Upload, 
  BarChart3, Users, Building2, Calendar, Settings, Eye
} from "lucide-react";

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

interface PropertyFormData {
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  description: string;
  type: string;
  status: string;
  images: string[];
  features: string[];
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    address: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    description: "",
    type: "For Sale",
    status: "Active",
    images: [],
    features: []
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#CBA328',
    secondaryColor: '#1a1a1a',
    tertiaryColor: '#f5f5f5',
    textColor: '#333333',
    linkColor: '#CBA328',
    linkHoverColor: '#b8951f',
    fontFamily: 'Inter'
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load theme settings
  const { data: currentThemeSettings } = useQuery({
    queryKey: ['/api/theme-settings/1'],
    queryFn: async () => {
      const response = await fetch('/api/theme-settings/1');
      if (!response.ok) throw new Error('Failed to fetch theme settings');
      return response.json();
    }
  });

  // Update theme settings when data loads (only if no unsaved changes)
  useEffect(() => {
    if (currentThemeSettings && !hasUnsavedChanges) {
      setThemeSettings({
        primaryColor: currentThemeSettings.primaryColor,
        secondaryColor: currentThemeSettings.secondaryColor,
        tertiaryColor: currentThemeSettings.tertiaryColor,
        textColor: currentThemeSettings.textColor,
        linkColor: currentThemeSettings.linkColor,
        linkHoverColor: currentThemeSettings.linkHoverColor,
        fontFamily: currentThemeSettings.fontFamily
      });
    }
  }, [currentThemeSettings, hasUnsavedChanges]);

  // Mark as having unsaved changes when theme settings are modified
  const updateThemeSetting = (key: string, value: string) => {
    setThemeSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  // Save theme settings mutation
  const saveThemeSettingsMutation = useMutation({
    mutationFn: async (settings: typeof themeSettings) => {
      console.log('🎨 Sending theme settings:', settings);
      try {
        const bodyString = JSON.stringify(settings);
        console.log('🎨 About to send via XMLHttpRequest with JSON body:', bodyString);
        
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', '/api/theme-settings/1', true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          
          xhr.onload = function() {
            console.log('🎨 XMLHttpRequest response status:', xhr.status);
            if (xhr.status === 200) {
              const result = JSON.parse(xhr.responseText);
              console.log('🎨 XMLHttpRequest response data:', result);
              resolve(result);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };
          
          xhr.onerror = function() {
            reject(new Error('Network error'));
          };
          
          console.log('🎨 Sending XMLHttpRequest...');
          xhr.send(bodyString);
        });
      } catch (error) {
        console.error('🎨 Mutation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Reset the unsaved changes flag
      setHasUnsavedChanges(false);
      
      // Force all theme-related queries to refetch across the app
      queryClient.invalidateQueries({ queryKey: ['/api/theme-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/theme-settings/1'] });
      
      // Trigger a manual reload of CSS variables on other pages
      window.dispatchEvent(new CustomEvent('theme-updated', { detail: themeSettings }));
      
      toast({
        title: "Theme Settings Saved",
        description: "Your website's style has been updated successfully. Visit the homepage to see changes."
      });
    },
    onError: (error) => {
      console.error('🎨 Save theme settings error:', error);
      toast({
        title: "Save Failed",
        description: `Failed to save theme settings: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleSaveTheme = () => {
    console.log('🎨 Current theme settings before save:', themeSettings);
    console.log('🎨 Has unsaved changes:', hasUnsavedChanges);
    saveThemeSettingsMutation.mutate(themeSettings);
  };

  const handleResetTheme = () => {
    const defaultTheme = {
      primaryColor: '#CBA328',
      secondaryColor: '#1a1a1a',
      tertiaryColor: '#f5f5f5',
      textColor: '#333333',
      linkColor: '#CBA328',
      linkHoverColor: '#b8951f',
      fontFamily: 'Inter'
    };
    setThemeSettings(defaultTheme);
  };

  // Fetch properties using apiRequest for consistent cache-busting
  const { data: properties = [], isLoading, refetch } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      console.log('Fetching properties at:', new Date().toLocaleTimeString());
      const response = await fetch(`/api/properties?_t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      console.log('Fetched properties:', data.length, 'properties');
      console.log('First property title:', data[0]?.title);
      return data;
    },
    enabled: true,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 3000 // Refetch every 3 seconds to monitor changes
  });

  // Create/Update property mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (property: PropertyFormData) => {
      console.log('🌐 Creating property with payload:', property);
      
      const requestBody = JSON.stringify(property);
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/properties`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ POST request failed:', response.status, errorText);
        throw new Error('Failed to create property');
      }
      
      const result = await response.json();
      console.log('🎉 POST response received:', result);
      return result;
    },
    onSuccess: async (newProperty) => {
      console.log('✅ Property created successfully:', newProperty);
      console.log('🔄 Triggering UI refresh...');
      
      // Force refresh for new property
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.removeQueries({ queryKey: ['/api/properties'] });
      
      setTimeout(async () => {
        await refetch();
        console.log('📊 Fresh data loaded after creation');
      }, 100);
      
      toast({ title: "Property created successfully" });
      setIsEditDialogOpen(false);
      resetForm();
    }
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async (property: Property) => {
      console.log('🌐 Making PUT request with payload:', property);
      
      const requestBody = JSON.stringify(property);
      console.log('📦 Serialized request body:', requestBody);
      console.log('📏 Request body length:', requestBody.length);
      
      // Use raw endpoint that bypasses all middleware parsing issues
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/properties/${property.id}/raw?_t=${Date.now()}`;
      console.log('🎯 Using RAW endpoint:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: requestBody
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PUT request failed:', response.status, errorText);
        throw new Error(`Failed to update property: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🎉 PUT response received:', result);
      return result;
    },
    onSuccess: async (updatedProperty) => {
      console.log('✅ Property updated successfully:', updatedProperty);
      console.log('🔄 Triggering UI refresh...');
      
      // Multiple strategies to force UI update
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.removeQueries({ queryKey: ['/api/properties'] });
      
      // Wait a moment then force refetch
      setTimeout(async () => {
        const freshData = await refetch();
        console.log('📊 Fresh data loaded:', freshData?.data?.length, 'properties');
        console.log('🎯 Updated property title should be:', updatedProperty.title);
      }, 100);
      
      toast({ title: "Property updated successfully" });
      setIsEditDialogOpen(false);
      resetForm();
    }
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete property');
    },
    onSuccess: () => {
      // Simple cache invalidation
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({ title: "Property deleted successfully" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      address: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      description: "",
      type: "For Sale",
      status: "Active",
      images: [],
      features: []
    });
    setSelectedProperty(null);
    setNewImageUrl('');
  };

  // Handle adding a new image from URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Invalid Image URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()]
    }));
    
    setNewImageUrl("");
    
    toast({
      title: "Image Added",
      description: "Image URL has been added to the property",
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get upload URL from backend
      const uploadResponse = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL } = await uploadResponse.json();

      // Upload file to object storage
      const uploadFileResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        }
      });

      if (!uploadFileResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Extract the object path from the upload URL and convert to serving URL
      const objectPath = uploadURL.split('?')[0].split('/').slice(-2).join('/');
      const imageUrl = `/objects/${objectPath}`;

      // Add to form data
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));

      toast({
        title: "Image Uploaded",
        description: "Image has been successfully uploaded and added to the property",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openEditDialog = (property?: Property) => {
    if (property) {
      setSelectedProperty(property);
      // Clean up any invalid image URLs when loading into form
      const cleanImages = property.images?.filter(img => img && img.startsWith('http')) || [];
      if (cleanImages.length === 0) {
        cleanImages.push('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800');
      }
      
      setFormData({
        title: property.title,
        address: property.address,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet || 0,
        description: property.description,
        type: property.type,
        status: property.status,
        images: cleanImages,
        features: property.features
      });
    } else {
      resetForm();
    }
    setIsEditDialogOpen(true);
  };

  const handleSubmit = () => {
    console.log('🚀 handleSubmit called!');
    console.log('🔄 Current formData:', formData);
    console.log('🔄 selectedProperty:', selectedProperty);
    
    // Convert admin form data to API format with proper image URLs
    const propertyData = {
      ...formData,
      // Ensure squareFeet is properly included
      squareFeet: Number(formData.squareFeet),
      city: selectedProperty?.city || 'Default City',
      state: selectedProperty?.state || 'CA',
      zipCode: selectedProperty?.zipCode || '90210',
      listedById: selectedProperty?.listedById || 1,
      mainImage: formData.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800',
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&h=800']
    };
    
    console.log('📤 Submitting property data:', propertyData);
    console.log('🎯 Key field - squareFeet:', propertyData.squareFeet);
    
    if (selectedProperty) {
      // Ensure ID is included for updates
      const updateData = { ...selectedProperty, ...propertyData, id: selectedProperty.id };
      console.log('📝 Update payload with ID:', updateData.id, 'squareFeet:', updateData.squareFeet);
      console.log('🔍 Full update payload:', JSON.stringify(updateData, null, 2));
      updatePropertyMutation.mutate(updateData);
    } else {
      console.log('🆕 Creating new property:', JSON.stringify(propertyData, null, 2));
      createPropertyMutation.mutate(propertyData);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === "Active").length,
    pending: properties.filter(p => p.status === "Pending").length,
    sold: properties.filter(p => p.status === "Sold").length,
    totalValue: properties.reduce((sum, p) => sum + p.price, 0)
  };

  return (
    <div className="admin-panel min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">LuxeLead Admin</h1>
            <p className="text-sm text-gray-600">Property Management Dashboard</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => window.open('/', '_blank')} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Website
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Overview
            </button>
            
            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'properties' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-5 w-5 mr-3" />
              Properties
            </button>
            
            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'clients' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Clients
            </button>
            
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'appointments' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Appointments
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'messages' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Eye className="h-5 w-5 mr-3" />
              Messages
            </button>
            
            <button
              onClick={() => setActiveTab('style')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === 'style' 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Website Style
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 admin-card">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sold</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.sold}</p>
                  </div>
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-blue-600">${(stats.totalValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-6">
              {/* Properties Table */}
              <Card className="bg-white border border-gray-200 admin-table">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Property Management</CardTitle>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openEditDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Property
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">
                        {selectedProperty ? 'Edit Property' : 'Add New Property'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title" className="text-gray-700">Title</Label>
                          <Input
                            id="title"
                            className="bg-white border-gray-300 text-gray-900"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="price" className="text-gray-700">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            className="bg-white border-gray-300 text-gray-900"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address" className="text-gray-700">Address</Label>
                        <Input
                          id="address"
                          className="bg-white border-gray-300 text-gray-900"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="bedrooms" className="text-gray-700">Bedrooms</Label>
                          <Input
                            id="bedrooms"
                            type="number"
                            className="bg-white border-gray-300 text-gray-900"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bathrooms" className="text-gray-700">Bathrooms</Label>
                          <Input
                            id="bathrooms"
                            type="number"
                            className="bg-white border-gray-300 text-gray-900"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="squareFeet" className="text-gray-700">Square Feet</Label>
                          <Input
                            id="squareFeet"
                            type="number"
                            className="bg-white border-gray-300 text-gray-900"
                            value={formData.squareFeet}
                            onChange={(e) => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="type" className="text-gray-700">Property Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-300">
                              <SelectItem value="For Sale">For Sale</SelectItem>
                              <SelectItem value="For Rent">For Rent</SelectItem>
                              <SelectItem value="Sold">Sold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status" className="text-gray-700">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                          >
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-300">
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Sold">Sold</SelectItem>
                              <SelectItem value="Draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-gray-700">Description</Label>
                        <Textarea
                          id="description"
                          className="bg-white border-gray-300 text-gray-900"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700">Property Images</Label>
                        
                        {/* Current Images Grid */}
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 mb-4">
                            {formData.images.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={imageUrl}
                                  alt={`Property image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&h=150';
                                  }}
                                />
                                {/* Main Image Badge */}
                                {index === 0 && (
                                  <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                                    Main
                                  </div>
                                )}
                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = formData.images.filter((_, i) => i !== index);
                                    setFormData({ ...formData, images: newImages });
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                                {/* Set as Main Button */}
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newImages = [...formData.images];
                                      const [mainImage] = newImages.splice(index, 1);
                                      newImages.unshift(mainImage);
                                      setFormData({ ...formData, images: newImages });
                                    }}
                                    className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Set Main
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Add New Image */}
                        <div className="space-y-2">
                          {/* File Upload */}
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              ref={fileInputRef}
                            />
                            <Button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              variant="outline"
                              className="px-4"
                            >
                              📁 Upload Image
                            </Button>
                            <span className="text-sm text-gray-500 self-center">
                              {isUploading ? 'Uploading...' : 'or enter URL below'}
                            </span>
                          </div>
                          
                          {/* URL Input */}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter image URL..."
                              className="bg-white border-gray-300 text-gray-900 flex-1"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddImageUrl();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              onClick={handleAddImageUrl}
                              variant="outline"
                              className="px-4"
                            >
                              Add URL
                            </Button>
                          </div>
                        </div>
                        
                        {formData.images.length === 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            No images added yet. Add at least one image for the property.
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="features" className="text-gray-700">Features (comma separated)</Label>
                        <Textarea
                          id="features"
                          className="bg-white border-gray-300 text-gray-900"
                          value={formData.features.join(', ')}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            features: e.target.value.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0)
                          })}
                          rows={2}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={(e) => {
                            e.preventDefault();
                            console.log('🖱️ Submit button clicked!');
                            console.log('🖱️ selectedProperty:', selectedProperty?.id);
                            console.log('🖱️ formData squareFeet:', formData.squareFeet);
                            handleSubmit();
                          }} 
                          disabled={createPropertyMutation.isPending || updatePropertyMutation.isPending}
                        >
                          {selectedProperty ? 'Update' : 'Create'} Property
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-white border-gray-300 text-gray-900">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Property</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          Loading properties...
                        </td>
                      </tr>
                    ) : filteredProperties.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          No properties found
                        </td>
                      </tr>
                    ) : (
                      filteredProperties.map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={property.mainImage || property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=100&h=100'}
                                alt={property.title}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=100&h=100';
                                }}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{property.title}</div>
                                <div className="text-sm text-gray-500">{property.address}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">
                            ${property.price?.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.squareFeet?.toLocaleString()} sq ft
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              property.status === 'Active' ? 'default' :
                              property.status === 'Pending' ? 'secondary' :
                              property.status === 'Sold' ? 'outline' : 'destructive'
                            }>
                              {property.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(property)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deletePropertyMutation.mutate(property.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Client Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Client management features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Appointment Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Appointment scheduling features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Message Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Message management features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Website Style Customization</CardTitle>
                  <p className="text-sm text-gray-600">Customize your website's appearance with colors and fonts</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Colors</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="primaryColor" className="text-gray-700 text-sm font-medium">Primary Color</Label>
                          <div className="flex items-center space-x-3 mt-1">
                            <input
                              type="color"
                              id="primaryColor"
                              value={themeSettings.primaryColor}
                              onChange={(e) => updateThemeSetting('primaryColor', e.target.value)}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={themeSettings.primaryColor}
                              onChange={(e) => updateThemeSetting('primaryColor', e.target.value)}
                              className="flex-1 bg-white border-gray-300 text-gray-900"
                              placeholder="#CBA328"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="secondaryColor" className="text-gray-700 text-sm font-medium">Secondary Color</Label>
                          <div className="flex items-center space-x-3 mt-1">
                            <input
                              type="color"
                              id="secondaryColor"
                              value={themeSettings.secondaryColor}
                              onChange={(e) => updateThemeSetting('secondaryColor', e.target.value)}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={themeSettings.secondaryColor}
                              onChange={(e) => updateThemeSetting('secondaryColor', e.target.value)}
                              className="flex-1 bg-white border-gray-300 text-gray-900"
                              placeholder="#1a1a1a"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="tertiaryColor" className="text-gray-700 text-sm font-medium">Tertiary Color</Label>
                          <div className="flex items-center space-x-3 mt-1">
                            <input
                              type="color"
                              id="tertiaryColor"
                              value={themeSettings.tertiaryColor}
                              onChange={(e) => setThemeSettings({...themeSettings, tertiaryColor: e.target.value})}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={themeSettings.tertiaryColor}
                              onChange={(e) => setThemeSettings({...themeSettings, tertiaryColor: e.target.value})}
                              className="flex-1 bg-white border-gray-300 text-gray-900"
                              placeholder="#f5f5f5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Text & Links</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="textColor" className="text-gray-700 text-sm font-medium">Text Color</Label>
                          <div className="flex items-center space-x-3 mt-1">
                            <input
                              type="color"
                              id="textColor"
                              value={themeSettings.textColor}
                              onChange={(e) => setThemeSettings({...themeSettings, textColor: e.target.value})}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={themeSettings.textColor}
                              onChange={(e) => setThemeSettings({...themeSettings, textColor: e.target.value})}
                              className="flex-1 bg-white border-gray-300 text-gray-900"
                              placeholder="#333333"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="linkColor" className="text-gray-700 text-sm font-medium">Link Color</Label>
                          <div className="flex items-center space-x-3 mt-1">
                            <input
                              type="color"
                              id="linkColor"
                              value={themeSettings.linkColor}
                              onChange={(e) => setThemeSettings({...themeSettings, linkColor: e.target.value})}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={themeSettings.linkColor}
                              onChange={(e) => setThemeSettings({...themeSettings, linkColor: e.target.value})}
                              className="flex-1 bg-white border-gray-300 text-gray-900"
                              placeholder="#CBA328"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="linkHoverColor" className="text-gray-700 text-sm font-medium">Link Hover Color</Label>
                          <div className="flex items-center space-x-3 mt-1">
                            <input
                              type="color"
                              id="linkHoverColor"
                              value={themeSettings.linkHoverColor}
                              onChange={(e) => setThemeSettings({...themeSettings, linkHoverColor: e.target.value})}
                              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <Input
                              value={themeSettings.linkHoverColor}
                              onChange={(e) => setThemeSettings({...themeSettings, linkHoverColor: e.target.value})}
                              className="flex-1 bg-white border-gray-300 text-gray-900"
                              placeholder="#b8951f"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
                    <div>
                      <Label htmlFor="fontFamily" className="text-gray-700 text-sm font-medium">Font Family</Label>
                      <Select
                        value={themeSettings.fontFamily}
                        onValueChange={(value) => setThemeSettings({...themeSettings, fontFamily: value})}
                      >
                        <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                          <SelectItem value="Nunito">Nunito</SelectItem>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                          <SelectItem value="Merriweather">Merriweather</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Style Preview</h4>
                        <p className="text-sm text-gray-600">Changes will be applied to your website</p>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={handleResetTheme}>
                          Reset to Default
                        </Button>
                        <Button 
                          onClick={handleSaveTheme} 
                          disabled={saveThemeSettingsMutation.isPending}
                        >
                          {saveThemeSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}