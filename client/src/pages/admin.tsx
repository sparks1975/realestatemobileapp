import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property)
      });
      if (!response.ok) throw new Error('Failed to create property');
      return response.json();
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
      
      // Try absolute URL to bypass any proxy issues
      const response = await fetch(`http://localhost:5000/api/properties/${property.id}?_t=${Date.now()}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Content-Length': requestBody.length.toString()
        },
        body: requestBody
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PUT request failed:', response.status, errorText);
        throw new Error('Failed to update property');
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
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
              <BarChart3 className="h-4 w-4 mr-3" />
              Dashboard
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Building2 className="h-4 w-4 mr-3" />
              Properties
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Users className="h-4 w-4 mr-3" />
              Clients
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Calendar className="h-4 w-4 mr-3" />
              Appointments
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 admin-content">
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
                        <Label htmlFor="images" className="text-gray-700">Image URLs (comma separated)</Label>
                        <Textarea
                          id="images"
                          className="bg-white border-gray-300 text-gray-900"
                          value={formData.images.join(', ')}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            images: e.target.value.split(',').map(url => url.trim()).filter(url => url.length > 0)
                          })}
                          rows={2}
                        />
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
      </div>
    </div>
  );
}