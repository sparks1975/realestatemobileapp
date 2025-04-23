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
    const distance = formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: false });
    
    // Convert to short form
    if (distance.includes("minute")) {
      return distance.replace("minute", "m").replace("minutes", "m");
    } else if (distance.includes("hour")) {
      return distance.replace("hour", "h").replace("hours", "h");
    } else if (distance.includes("day")) {
      return distance.replace("day", "d").replace("days", "d");
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
            <span className="text-xs text-muted-foreground ml-2">{getTimeDistance()}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage.content}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
