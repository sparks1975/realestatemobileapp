import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MessagesScreen = () => {
  const navigation = useNavigation();
  
  // Mock conversation data
  const conversations = [
    {
      id: 1,
      user: {
        id: 2,
        name: 'Sarah Johnson',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&h=500',
      },
      lastMessage: {
        id: 101,
        content: "I'm interested in the Beverly Hills property. When can I schedule a viewing?",
        createdAt: new Date('2025-04-23T08:30:00'),
        read: false,
      },
    },
    {
      id: 2,
      user: {
        id: 3,
        name: 'David Miller',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&h=500',
      },
      lastMessage: {
        id: 102,
        content: "Hey, are we still meeting today at 3pm?",
        createdAt: new Date('2025-04-23T09:15:00'),
        read: true,
      },
    },
    {
      id: 3,
      user: {
        id: 4,
        name: 'Jennifer Lee',
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&h=500',
      },
      lastMessage: {
        id: 103,
        content: "Thank you for showing me the property yesterday. I'd like to make an offer.",
        createdAt: new Date('2025-04-22T18:45:00'),
        read: false,
      },
    },
    {
      id: 4,
      user: {
        id: 5,
        name: 'Michael Chang',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=500',
      },
      lastMessage: {
        id: 104,
        content: "Could you send me the floor plans for the penthouse?",
        createdAt: new Date('2025-04-22T15:20:00'),
        read: true,
      },
    },
  ];
  
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const getTimeDisplay = (date) => {
    if (isToday(date)) {
      return formatTime(date);
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.composeButton}>
            <Text style={styles.composeButtonText}>New</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.conversationsContainer}>
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              onPress={() => navigation.navigate('ChatScreen', { conversationId: conversation.id })}
            >
              <Image
                source={{ uri: conversation.user.profileImage }}
                style={styles.avatar}
              />
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.userName}>{conversation.user.name}</Text>
                  <Text style={styles.timeText}>{getTimeDisplay(conversation.lastMessage.createdAt)}</Text>
                </View>
                <View style={styles.messageContainer}>
                  <Text
                    style={[
                      styles.messagePreview,
                      !conversation.lastMessage.read && styles.unreadMessage,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {conversation.lastMessage.content}
                  </Text>
                  {!conversation.lastMessage.read && (
                    <View style={styles.unreadBadge} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  composeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  composeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  conversationsContainer: {
    marginTop: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: '#6B6B6B',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#000',
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
});

export default MessagesScreen;