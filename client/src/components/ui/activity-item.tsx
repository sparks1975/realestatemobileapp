import { Activity } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { MessageSquare, DollarSign, Home } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  // Get icon based on activity type
  const getIcon = () => {
    switch (activity.type) {
      case "message":
        return <MessageSquare className="text-primary" />;
      case "offer":
        return <DollarSign className="text-secondary" />;
      case "listing":
        return <Home className="text-[#FFB830]" />;
      default:
        return <MessageSquare className="text-primary" />;
    }
  };
  
  // Get background color for icon container
  const getIconBgClass = () => {
    switch (activity.type) {
      case "message":
        return "bg-primary bg-opacity-10";
      case "offer":
        return "bg-secondary bg-opacity-10";
      case "listing":
        return "bg-[#FFB830] bg-opacity-10";
      default:
        return "bg-primary bg-opacity-10";
    }
  };
  
  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true });
  
  return (
    <Card className="p-4 mb-3">
      <div className="flex">
        <div className={`w-10 h-10 rounded-full ${getIconBgClass()} flex items-center justify-center mr-3`}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{activity.title}</h3>
          <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>
    </Card>
  );
}
