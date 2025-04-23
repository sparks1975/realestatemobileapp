import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import PropertyCard from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property } from "@shared/schema";
import { properties } from "@/lib/mock-data";

type FilterType = "All Properties" | "For Sale" | "For Rent" | "Recent" | "Pending";

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All Properties");
  
  // Fetch properties
  const { data, isLoading } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: async () => {
      // For demo purposes, use mock data
      // In a real app, this would fetch from the API
      return properties;
    }
  });
  
  // Filter properties based on search term and active filter
  const filteredProperties = data?.filter(property => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type/status filter
    const matchesFilter = 
      activeFilter === "All Properties" || 
      (activeFilter === "For Sale" && property.type === "For Sale") ||
      (activeFilter === "For Rent" && property.type === "For Rent") ||
      (activeFilter === "Pending" && property.status === "Pending") ||
      (activeFilter === "Recent" && (
        new Date(property.createdAt).getTime() > 
        Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days
      ));
    
    return matchesSearch && matchesFilter;
  });
  
  // Available filters
  const filters: FilterType[] = [
    "All Properties",
    "For Sale",
    "For Rent",
    "Recent",
    "Pending"
  ];
  
  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button className="w-10 h-10 p-0 rounded-full bg-primary shadow-glow-primary">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search properties..."
          className="pl-9 bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            className={`rounded-full whitespace-nowrap ${
              activeFilter === filter 
                ? "bg-primary text-white" 
                : "bg-card text-muted-foreground"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
      
      {/* Properties Grid */}
      {isLoading ? (
        <div className="space-y-5">
          <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
          <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
        </div>
      ) : filteredProperties && filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No properties found</p>
          {searchTerm && (
            <Button
              variant="link"
              className="mt-2 text-primary"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
