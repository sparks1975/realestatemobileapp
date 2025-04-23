import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  iconColor?: string;
  changePeriod?: "this week" | "this month" | "today";
}

export default function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
  changePeriod = "this month"
}: KpiCardProps) {
  const bgColor = `bg-${iconColor} bg-opacity-10`;
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-muted-foreground text-xs">{title}</p>
        <div className={`w-8 h-8 rounded-full bg-opacity-10 flex items-center justify-center ${bgColor}`}>
          <Icon className={iconColor} size={16} />
        </div>
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-xs text-secondary">
        <svg 
          className="w-3 h-3 inline mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
        <span>+{change}</span> {changePeriod}
      </p>
    </Card>
  );
}
