import { Card } from "@/components/ui/card";
import { Message, User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface ConversationItemProps {
  user: User;
  lastMessage: Message;
}

export default function ConversationItem({ user, lastMessage }: ConversationItemProps) {
  const [_, navigate] = useLocation();
  
  const handleClick = () => {
    navigate(`/messages/${user.id}`);
  };
  
  // Calculate time distance (e.g., "2m", "1h", "3d")
  const getTimeDistance = () => {
    // Always use a valid date - handle all possible cases
    let messageDate: Date;
    try {
      messageDate = new Date(lastMessage.createdAt);
      // Check if date is valid
      if (isNaN(messageDate.getTime())) {
        messageDate = new Date();
      }
    } catch (error) {
      messageDate = new Date();
    }
    
    const distance = formatDistanceToNow(messageDate, { addSuffix: false });
    
    // Convert to short form - extract only numbers and use single letter indicators
    if (distance.includes("minute")) {
      // Extract just numbers
      const mins = distance.match(/\d+/);
      return mins ? `${mins[0]}m` : "1m";
    } else if (distance.includes("hour")) {
      const hrs = distance.match(/\d+/);
      return hrs ? `${hrs[0]}h` : "1h";
    } else if (distance.includes("day")) {
      const days = distance.match(/\d+/);
      return days ? `${days[0]}d` : "1d";
    } else if (distance.includes("week")) {
      const weeks = distance.match(/\d+/);
      return weeks ? `${weeks[0]}w` : "1w";
    }
    
    return distance;
  };
  
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <Card className="flex items-center p-3">
        <div className="relative mr-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src={user.profileImage || "https://via.placeholder.com/60"} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online indicator dot - this would be dynamic in a real app */}
          {Math.random() > 0.5 && (
            <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-background dark:border-card"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold truncate">{user.name}</h3>
            <span className="min-w-[30px] text-xs text-center text-muted-foreground ml-2 py-1 px-2 bg-muted rounded-full">{getTimeDistance()}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage.content}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
