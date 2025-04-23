import { Property } from "@shared/schema";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [_, navigate] = useLocation();
  
  const handleClick = () => {
    navigate(`/properties/${property.id}`);
  };
  
  // Format price display
  const formatPrice = () => {
    if (property.type === "For Rent") {
      return `$${(property.price / 1000).toFixed(0)}K/mo`;
    } else {
      if (property.price >= 1000000) {
        return `$${(property.price / 1000000).toFixed(1)}M`;
      } else {
        return `$${(property.price / 1000).toFixed(0)}K`;
      }
    }
  };
  
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="property-card"
      onClick={handleClick}
    >
      <Card className="overflow-hidden">
        {/* Property Image */}
        <div className="relative h-48">
          <img 
            src={property.mainImage} 
            alt={property.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-background dark:bg-card px-2 py-1 rounded-md text-xs font-semibold text-primary">
            {property.type}
          </div>
          <div className="absolute top-3 right-3">
            <button 
              className="w-8 h-8 bg-card rounded-full flex items-center justify-center shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                // Handle favorite toggle
              }}
            >
              <Heart className="text-muted-foreground" size={16} />
            </button>
          </div>
        </div>
        
        {/* Property Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold">{property.title}</h3>
            <span className="text-lg font-bold text-primary">{formatPrice()}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            {property.address}, {property.city}, {property.state}
          </p>
          
          {/* Property Features */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
