import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface PropertyDetailsHeaderProps {
  type?: "For Sale" | "For Rent";
  images: string[];
}

export default function PropertyDetailsHeader({ type = "For Sale", images }: PropertyDetailsHeaderProps) {
  const [_, navigate] = useLocation();
  
  const handleBack = () => {
    navigate("/properties");
  };
  
  return (
    <div className="relative h-72">
      {/* Main image */}
      <div className="h-full">
        {images.length > 0 && (
          <img 
            src={images[0]} 
            alt="Property" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Navigation and action buttons overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
        <motion.button 
          className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md"
          onClick={handleBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="text-primary" size={20} />
        </motion.button>
        
        <div className="flex space-x-2">
          <motion.button 
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md"
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="text-muted-foreground" size={20} />
          </motion.button>
          
          <motion.button 
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-md"
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="text-muted-foreground" size={20} />
          </motion.button>
        </div>
      </div>
      
      {/* Type badge */}
      <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium shadow-glow-primary">
        {type}
      </div>
    </div>
  );
}
