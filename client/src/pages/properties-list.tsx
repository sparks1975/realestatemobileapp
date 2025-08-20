import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Filter, Grid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  description: string;
  type: string;
  status: string;
  mainImage?: string;
  images: string[];
  features: string[];
}

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

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

  // Load properties
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
      fontsToLoad.forEach(font => {
        if (font && font !== 'Inter' && !document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
          const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
          const link = document.createElement('link');
          link.href = fontUrl;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      });
    }
  };

  useEffect(() => {
    applyThemeSettings(themeSettings);
  }, [themeSettings]);

  // Filter properties based on search and filter criteria
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || property.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="properties-page min-h-screen" style={{ backgroundColor: 'var(--tertiary-color)' }}>
      <Header currentPage="properties" />

      {/* Hero Section */}
      <section className="pt-24 pb-16" style={{ backgroundColor: 'var(--secondary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p 
              className="text-sm uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
            >
              Browse Properties
            </p>
            <h1 
              className="text-4xl md:text-6xl font-light leading-tight mb-8"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
            >
              Luxury Real Estate
            </h1>
            <p 
              className="text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--body-font)' }}
            >
              Discover exceptional properties in Austin's most desirable neighborhoods
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm mb-8" style={{ color: 'var(--text-color)' }}>
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>
      </section>

      {/* Properties Grid/List */}
      <section className="pb-24" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {filteredProperties.map((property) => (
                <a 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className={`group relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={viewMode === 'list' ? 'w-80 flex-shrink-0' : 'aspect-[4/3]'}>
                    <div className="w-full h-full overflow-hidden">
                      <img 
                        src={property.mainImage || property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&h=600'}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  <div className={`absolute ${viewMode === 'list' ? 'bottom-6 left-6 right-6' : 'bottom-6 left-6 right-6'} text-white`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs font-medium px-2 py-1"
                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                      >
                        {property.status}
                      </Badge>
                    </div>
                    
                    <h3 
                      className="text-xl font-light leading-tight mb-2"
                      style={{ fontFamily: 'var(--heading-font)' }}
                    >
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{property.city}, {property.state}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div 
                        className="text-2xl font-light"
                        style={{ fontFamily: 'var(--heading-font)' }}
                      >
                        ${property.price.toLocaleString()}
                      </div>
                      <div className="text-sm">
                        {property.bedrooms}bd • {property.bathrooms}ba
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {filteredProperties.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <p 
                className="text-lg mb-4"
                style={{ color: 'var(--text-color)', fontFamily: 'var(--body-font)' }}
              >
                No properties found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                variant="outline"
                style={{ 
                  borderColor: 'var(--primary-color)', 
                  color: 'var(--primary-color)' 
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}