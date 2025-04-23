import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();
  
  // Mock appointments data
  const appointments = [
    {
      id: 1,
      title: 'Property Viewing',
      location: '123 Luxury Ave, Beverly Hills',
      client: 'Sarah Johnson',
      date: new Date('2025-04-23T10:00:00'),
      propertyId: 1,
    },
    {
      id: 2,
      title: 'Client Meeting',
      location: 'Coffee Shop, 456 Main St',
      client: 'David Miller',
      date: new Date('2025-04-23T15:00:00'),
      propertyId: null,
    },
    {
      id: 3,
      title: 'Open House',
      location: '789 Skyline Blvd, San Francisco',
      client: null,
      date: new Date('2025-04-24T13:00:00'),
      propertyId: 3,
    },
    {
      id: 4,
      title: 'Contract Signing',
      location: 'Office',
      client: 'Jennifer Lee',
      date: new Date('2025-04-24T16:30:00'),
      propertyId: 2,
    },
  ];
  
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  const getFormattedDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const getFormattedTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };
  
  const getTodayAppointments = () => {
    return appointments.filter(appointment => 
      isSameDay(appointment.date, today)
    ).sort((a, b) => a.date - b.date);
  };
  
  const getTomorrowAppointments = () => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return appointments.filter(appointment => 
      isSameDay(appointment.date, tomorrow)
    ).sort((a, b) => a.date - b.date);
  };
  
  const getSelectedDateAppointments = () => {
    return appointments.filter(appointment => 
      isSameDay(appointment.date, selectedDate) &&
      !isSameDay(appointment.date, today) &&
      !isSameDay(appointment.date, new Date(today.getTime() + 86400000))
    ).sort((a, b) => a.date - b.date);
  };
  
  // Generate next 7 days for the date picker
  const generateWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  const weekDays = generateWeekDays();
  const todayAppointments = getTodayAppointments();
  const tomorrowAppointments = getTomorrowAppointments();
  const selectedDateAppointments = getSelectedDateAppointments();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Schedule</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarStrip}
        >
          {weekDays.map((date) => (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dateButton,
                isSameDay(date, selectedDate) && styles.selectedDateButton,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dayName,
                isSameDay(date, selectedDate) && styles.selectedDayName,
              ]}>
                {getDayName(date)}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSameDay(date, selectedDate) && styles.selectedDayNumber,
              ]}>
                {date.getDate()}
              </Text>
              {isSameDay(date, today) && (
                <View style={styles.todayIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {todayAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today</Text>
            {todayAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Text style={styles.appointmentTime}>{getFormattedTime(appointment.date)}</Text>
                <View style={styles.appointmentContent}>
                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                  {appointment.client && (
                    <Text style={styles.appointmentClient}>with {appointment.client}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        
        {tomorrowAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tomorrow</Text>
            {tomorrowAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Text style={styles.appointmentTime}>{getFormattedTime(appointment.date)}</Text>
                <View style={styles.appointmentContent}>
                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                  {appointment.client && (
                    <Text style={styles.appointmentClient}>with {appointment.client}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        
        {selectedDateAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getFormattedDate(selectedDate)}</Text>
            {selectedDateAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <Text style={styles.appointmentTime}>{getFormattedTime(appointment.date)}</Text>
                <View style={styles.appointmentContent}>
                  <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                  <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                  {appointment.client && (
                    <Text style={styles.appointmentClient}>with {appointment.client}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        
        {!todayAppointments.length && !tomorrowAppointments.length && !selectedDateAppointments.length && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No appointments scheduled</Text>
            <TouchableOpacity style={styles.emptyStateButton}>
              <Text style={styles.emptyStateButtonText}>Schedule New Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  calendarStrip: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  dateButton: {
    width: 60,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedDateButton: {
    backgroundColor: '#007AFF',
  },
  dayName: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  selectedDayName: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  selectedDayNumber: {
    color: '#FFFFFF',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  appointmentTime: {
    width: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 2,
  },
  appointmentClient: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ScheduleScreen;