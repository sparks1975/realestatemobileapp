import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Menu, X, Search, Filter, Grid, List } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    }
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
      {/* Navigation - Same as other pages */}
      <nav 
        className="fixed top-0 w-full backdrop-blur-sm z-50"
        style={{ backgroundColor: 'var(--header-background-color)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div 
              className="text-2xl font-light tracking-wider"
              style={{ color: 'var(--navigation-color)' }}
            >
              <a href="/">LUXELEAD</a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <a 
                href="/" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                Home
              </a>
              <a 
                href="/properties" 
                className="text-sm uppercase tracking-wide transition-colors"
                style={{ color: 'var(--tertiary-color)', fontWeight: 'bold' }}
              >
                Properties
              </a>
              <a 
                href="/agent" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                Agent
              </a>
              <a 
                href="/#contact" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                Contact
              </a>
              <a 
                href="/app" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                Mobile App
              </a>
              <a 
                href="/admin" 
                className="text-sm uppercase tracking-wide transition-colors hover:opacity-70"
                style={{ color: 'var(--navigation-color)' }}
              >
                Admin
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: 'var(--navigation-color)' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Off-Canvas Menu */}
        <div 
          className={`fixed inset-y-0 right-0 w-64 transform transition-transform duration-300 ease-in-out z-50 md:hidden shadow-2xl ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ 
            backgroundColor: 'var(--header-background-color)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div 
            className="flex flex-col h-full w-full"
            style={{ backgroundColor: 'var(--header-background-color)' }}
          >
            <div 
              className="flex justify-between items-center px-6 py-6 border-b border-opacity-20 w-full" 
              style={{ 
                borderColor: 'var(--navigation-color)',
                backgroundColor: 'var(--header-background-color)'
              }}
            >
              <div 
                className="text-xl font-light tracking-wider"
                style={{ color: 'var(--navigation-color)' }}
              >
                MENU
              </div>
              <button
                className="p-2 hover:opacity-70 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: 'var(--navigation-color)' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div 
              className="flex-1 px-6 py-8 w-full"
              style={{ backgroundColor: 'var(--header-background-color)' }}
            >
              <div className="space-y-6">
                <a 
                  href="/" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/properties" 
                  className="block text-lg uppercase tracking-wide transition-colors"
                  style={{ color: 'var(--tertiary-color)', fontWeight: 'bold' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Properties
                </a>
                <a 
                  href="/agent" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agent
                </a>
                <a 
                  href="/#contact" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <a 
                  href="/app" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mobile App
                </a>
                <a 
                  href="/admin" 
                  className="block text-lg uppercase tracking-wide transition-colors hover:opacity-70"
                  style={{ color: 'var(--navigation-color)' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-0">
        {/* Page Header */}
        <section className="pt-24 pb-16" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <p 
                className="text-sm uppercase tracking-[0.2em] mb-4"
                style={{ color: 'var(--tertiary-color)' }}
              >
                LuxeLead Properties
              </p>
              <h1 
                className="text-4xl md:text-6xl font-light leading-tight"
                style={{ color: 'var(--tertiary-color)', fontFamily: 'var(--heading-font)' }}
              >
                All Properties
              </h1>
            </div>
          </div>
        </section>

        {/* Search and Filter Controls */}
        <section className="py-8" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={20} 
                />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                  style={{ color: 'var(--text-color)' }}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Filter Dropdown */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                  style={{ color: 'var(--text-color)' }}
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-200 bg-white">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-colors ${
                      viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Grid size={20} style={{ color: 'var(--text-color)' }} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-colors ${
                      viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                  >
                    <List size={20} style={{ color: 'var(--text-color)' }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-6">
              <p 
                className="text-sm"
                style={{ color: 'var(--text-color)' }}
              >
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid/List */}
        <section className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
          <div className="max-w-7xl mx-auto px-6">
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-700 h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-16">
                <p 
                  className="text-lg"
                  style={{ color: 'var(--text-color)' }}
                >
                  No properties found matching your criteria.
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
                {filteredProperties.map((property) => (
                  viewMode === 'grid' ? (
                    // Grid View - Same as Homepage Cards
                    <a 
                      key={property.id} 
                      href={`/property/${property.id}`}
                      className="group cursor-pointer block"
                    >
                      <div className="relative overflow-hidden mb-4">
                        <img 
                          src={property.images?.[0] || property.mainImage || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400`}
                          alt={property.title}
                          className="h-80 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div 
                          className="absolute bottom-0 left-0 right-0 p-6 text-white"
                          style={{
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                          }}
                        >
                          <div 
                            className="text-lg mb-2"
                            style={{ 
                              color: 'white',
                              fontFamily: 'var(--heading-font)',
                              fontWeight: 'var(--heading-font-weight)'
                            }}
                          >
                            {property.title}
                          </div>
                          <div className="text-sm uppercase tracking-wide mb-2 opacity-90">
                            {property.address}
                          </div>
                          <div className="text-2xl font-light">
                            ${property.price?.toLocaleString()}
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge 
                            variant={property.status === 'available' ? 'default' : 'secondary'}
                            className="uppercase tracking-wide text-xs"
                          >
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </a>
                  ) : (
                    // List View
                    <a 
                      key={property.id} 
                      href={`/property/${property.id}`}
                      className="group cursor-pointer block"
                    >
                      <div className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <div className="md:flex">
                          <div className="md:w-1/3 relative">
                            <img 
                              src={property.images?.[0] || property.mainImage || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&h=400`}
                              alt={property.title}
                              className="h-64 md:h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge 
                                variant={property.status === 'available' ? 'default' : 'secondary'}
                                className="uppercase tracking-wide text-xs"
                              >
                                {property.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="md:w-2/3 p-8">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 
                                  className="text-2xl font-light mb-2"
                                  style={{ color: 'var(--text-color)', fontFamily: 'var(--heading-font)' }}
                                >
                                  {property.title}
                                </h3>
                                <p 
                                  className="text-gray-600 flex items-center"
                                  style={{ color: 'var(--text-color)' }}
                                >
                                  <MapPin size={16} className="mr-2" />
                                  {property.address}, {property.city}, {property.state}
                                </p>
                              </div>
                              <div 
                                className="text-3xl font-light"
                                style={{ color: 'var(--primary-color)' }}
                              >
                                ${property.price?.toLocaleString()}
                              </div>
                            </div>
                            
                            <div className="flex gap-6 mb-4 text-sm">
                              <span style={{ color: 'var(--text-color)' }}>
                                {property.bedrooms} bed
                              </span>
                              <span style={{ color: 'var(--text-color)' }}>
                                {property.bathrooms} bath
                              </span>
                              <span style={{ color: 'var(--text-color)' }}>
                                {property.squareFeet?.toLocaleString()} sq ft
                              </span>
                            </div>
                            
                            <p 
                              className="text-gray-600 line-clamp-2"
                              style={{ color: 'var(--text-color)' }}
                            >
                              {property.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  )
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer - Same as Homepage */}
      <footer className="py-16" style={{ backgroundColor: 'var(--tertiary-color)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div 
              className="text-3xl font-light mb-8 tracking-wider"
              style={{ color: 'var(--text-color)' }}
            >
              LUXELEAD
            </div>
            <div className="flex justify-center space-x-8 mb-8">
              <a 
                href="/" 
                className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-color)' }}
              >
                Home
              </a>
              <a 
                href="/properties" 
                className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-color)' }}
              >
                Properties
              </a>
              <a 
                href="/agent" 
                className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-color)' }}
              >
                Agent
              </a>
              <a 
                href="/#contact" 
                className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-color)' }}
              >
                Contact
              </a>
              <a 
                href="/admin" 
                className="text-sm uppercase tracking-wide hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-color)' }}
              >
                Admin
              </a>
            </div>
            <div className="flex justify-center space-x-6 mb-8">
              <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
                <span className="text-xs">f</span>
              </div>
              <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
                <span className="text-xs">t</span>
              </div>
              <div className="w-8 h-8 border border-gray-400 flex items-center justify-center hover:bg-gray-400 hover:text-white transition-colors cursor-pointer">
                <span className="text-xs">in</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 LuxeLead. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}