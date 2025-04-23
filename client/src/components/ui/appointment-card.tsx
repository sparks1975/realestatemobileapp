import { Card } from "@/components/ui/card";
import { Appointment, Client } from "@shared/schema";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: Appointment;
  client?: Client;
  isToday?: boolean;
}

export default function AppointmentCard({ appointment, client, isToday = true }: AppointmentCardProps) {
  // Format hour and period separately for better layout
  const appointmentDate = new Date(appointment.date);
  const hour = format(appointmentDate, "h");
  const minutes = format(appointmentDate, "mm");
  const period = format(appointmentDate, "a");
  
  return (
    <Card className="p-4 mb-3">
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-full bg-muted flex flex-col items-center justify-center mr-3">
          <div className="text-primary font-bold text-sm leading-tight">
            {hour}:{minutes}
          </div>
          <div className="text-primary text-xs">{period}</div>
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
