import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format, isToday, addDays } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppointmentCard from "@/components/ui/appointment-card";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { appointments, clients } from "@/lib/mock-data";
import { Appointment, Client } from "@shared/schema";
import { motion } from "framer-motion";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Fetch appointments
  const { data, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      // For demo purposes, use mock data
      return appointments;
    }
  });
  
  // Helper function to find client by ID
  const getClientById = (id?: number | null): Client | undefined => {
    if (!id) return undefined;
    return clients.find(client => client.id === id);
  };
  
  // Group appointments by date
  const todayAppointments = data?.filter(appointment => 
    isToday(new Date(appointment.date))
  ) || [];
  
  const tomorrowAppointments = data?.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const tomorrow = addDays(new Date(), 1);
    return (
      appointmentDate.getDate() === tomorrow.getDate() &&
      appointmentDate.getMonth() === tomorrow.getMonth() &&
      appointmentDate.getFullYear() === tomorrow.getFullYear()
    );
  }) || [];
  
  const selectedDateAppointments = data?.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return (
      appointmentDate.getDate() === selectedDate.getDate() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear() &&
      !isToday(appointmentDate) &&
      appointmentDate.getDate() !== addDays(new Date(), 1).getDate()
    );
  }) || [];
  
  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header with title and add appointment button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <motion.button 
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-glow-primary"
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-5 w-5 text-white" />
        </motion.button>
      </div>
      
      {/* Calendar */}
      {isLoading ? (
        <div className="mb-6">
          <div className="h-8 bg-muted animate-pulse rounded mb-4 w-1/2"></div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {[...Array(35)].map((_, index) => (
              <div key={index} className="aspect-square bg-muted animate-pulse rounded-xl"></div>
            ))}
          </div>
        </div>
      ) : (
        <CalendarGrid 
          appointments={data || []}
          onDateSelect={setSelectedDate}
        />
      )}
      
      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-lg font-bold mb-4">Upcoming Appointments</h2>
        
        {/* Today Section */}
        {todayAppointments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-primary font-semibold mb-3">Today, {format(new Date(), "MMM d")}</h3>
            {todayAppointments.map((appointment: Appointment) => (
              <AppointmentCard 
                key={appointment.id}
                appointment={appointment}
                client={getClientById(appointment.clientId)}
                isToday={true}
              />
            ))}
          </div>
        )}
        
        {/* Tomorrow Section */}
        {tomorrowAppointments.length > 0 && (
          <div className={selectedDateAppointments.length > 0 ? "mb-6" : ""}>
            <h3 className="text-muted-foreground font-semibold mb-3">
              Tomorrow, {format(addDays(new Date(), 1), "MMM d")}
            </h3>
            {tomorrowAppointments.map((appointment: Appointment) => (
              <AppointmentCard 
                key={appointment.id}
                appointment={appointment}
                client={getClientById(appointment.clientId)}
                isToday={false}
              />
            ))}
          </div>
        )}
        
        {/* Selected Date Section (if different from today and tomorrow) */}
        {selectedDateAppointments.length > 0 && (
          <div>
            <h3 className="text-muted-foreground font-semibold mb-3">
              {format(selectedDate, "EEEE, MMM d")}
            </h3>
            {selectedDateAppointments.map((appointment: Appointment) => (
              <AppointmentCard 
                key={appointment.id}
                appointment={appointment}
                client={getClientById(appointment.clientId)}
                isToday={false}
              />
            ))}
          </div>
        )}
        
        {/* No appointments message */}
        {todayAppointments.length === 0 && 
          tomorrowAppointments.length === 0 && 
          selectedDateAppointments.length === 0 && (
          <div className="text-center py-10 bg-card rounded-xl">
            <p className="text-muted-foreground">No upcoming appointments</p>
            <Button variant="link" className="text-primary mt-2">
              Add a new appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
