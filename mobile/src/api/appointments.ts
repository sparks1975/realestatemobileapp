import apiClient from './client';
import { Appointment } from '../types';

// Function to get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get('/api/appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Function to get today's appointments
export const getTodayAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get('/api/appointments/today');
    return response.data;
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error);
    throw error;
  }
};

// Function to get appointments by date
export const getAppointmentsByDate = async (date: Date): Promise<Appointment[]> => {
  const formattedDate = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
  try {
    const response = await apiClient.get(`/api/appointments/date/${formattedDate}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for date ${formattedDate}:`, error);
    throw error;
  }
};

// Function to create a new appointment
export const createAppointment = async (appointmentData: any): Promise<Appointment> => {
  try {
    const response = await apiClient.post('/api/appointments', appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Function to update an appointment
export const updateAppointment = async (id: number, appointmentData: any): Promise<Appointment> => {
  try {
    const response = await apiClient.patch(`/api/appointments/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment with ID ${id}:`, error);
    throw error;
  }
};