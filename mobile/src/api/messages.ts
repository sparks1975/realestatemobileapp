import apiClient from './client';
import { Message, Conversation } from '../types';

// Function to get conversations for the current user
export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get('/api/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// Function to get messages for a specific conversation with another user
export const getMessagesByUserId = async (userId: number): Promise<Message[]> => {
  try {
    const response = await apiClient.get(`/api/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages with user ${userId}:`, error);
    throw error;
  }
};

// Function to send a new message
export const sendMessage = async (receiverId: number, content: string): Promise<Message> => {
  try {
    const response = await apiClient.post('/api/messages', {
      receiverId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to mark a message as read
export const markMessageRead = async (messageId: number): Promise<Message> => {
  try {
    const response = await apiClient.patch(`/api/messages/${messageId}/read`, {});
    return response.data;
  } catch (error) {
    console.error(`Error marking message ${messageId} as read:`, error);
    throw error;
  }
};