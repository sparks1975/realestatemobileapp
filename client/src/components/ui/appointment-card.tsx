import { Card } from "@/components/ui/card";
import { Appointment, Client } from "@shared/schema";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: Appointment;
  client?: Client;
  isToday?: boolean;
}

export default function AppointmentCard({ appointment, client, isToday = true }: AppointmentCardProps) {
  // Format time like "10:30 AM"
  const formattedTime = format(new Date(appointment.date), "h:mm a");
  
  return (
    <Card className="p-4 mb-3">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-3">
          <span className="text-primary font-bold">{formattedTime}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{appointment.title}</h3>
          <p className="text-sm text-muted-foreground">{appointment.location}</p>
        </div>
        {client && (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={client.profileImage || "https://via.placeholder.com/40"} 
              alt={client.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
