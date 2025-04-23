import { useMemo, useState } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  format, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Appointment } from "@shared/schema";

interface CalendarGridProps {
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
}

export default function CalendarGrid({ appointments, onDateSelect }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Create calendar days
  const calendarDays = useMemo(() => {
    // Get the start of the month
    const monthStart = startOfMonth(currentMonth);
    // Get the end of the month
    const monthEnd = endOfMonth(currentMonth);
    // Get the start of the first week
    const startDate = startOfWeek(monthStart);
    // Get the end of the last week
    const endDate = endOfWeek(monthEnd);
    
    // Get all days in the range
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });
    
    return days;
  }, [currentMonth]);
  
  // Get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === day.getDate() &&
        appointmentDate.getMonth() === day.getMonth() &&
        appointmentDate.getFullYear() === day.getFullYear()
      );
    });
  };
  
  return (
    <div>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <p className="text-sm text-muted-foreground">
            Today: {format(new Date(), "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="w-8 h-8 bg-card rounded-full flex items-center justify-center shadow"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="text-muted-foreground text-sm" size={16} />
          </button>
          <button 
            className="w-8 h-8 bg-card rounded-full flex items-center justify-center shadow"
            onClick={handleNextMonth}
          >
            <ChevronRight className="text-muted-foreground text-sm" size={16} />
          </button>
        </div>
      </div>
      
      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-sm text-muted-foreground mb-2">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const dayAppointments = getAppointmentsForDay(day);
          
          // Determine styling based on conditions
          let dayClass = "calendar-day ";
          if (isTodayDate) {
            dayClass += "calendar-day-today";
          } else if (isCurrentMonth) {
            dayClass += "calendar-day-current-month";
          } else {
            dayClass += "calendar-day-other-month";
          }
          
          return (
            <div 
              key={i} 
              className={dayClass}
              onClick={() => {
                if (isCurrentMonth) {
                  onDateSelect(day);
                }
              }}
            >
              <span>{format(day, "d")}</span>
              
              {/* Show indicator dot if there are appointments */}
              {dayAppointments.length > 0 && isCurrentMonth && !isTodayDate && (
                <div 
                  className="calendar-day-dot bg-primary"
                  style={{ 
                    backgroundColor: 
                      dayAppointments[0].title.includes("Viewing") ? 
                      "hsl(var(--primary))" : "hsl(var(--secondary))" 
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
