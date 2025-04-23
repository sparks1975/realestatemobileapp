import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { conversationId } = route.params as { conversationId: number };
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef(null);
  
  // Mock conversation data - in real app, this would be fetched from API based on conversationId
  const conversation = {
    id: 1,
    user: {
      id: 2,
      name: 'Sarah Johnson',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=500',
    },
    messages: [
      {
        id: 1,
        senderId: 2,
        receiverId: 1,
        content: "Hello, I'm interested in the Beverly Hills property. When can I schedule a viewing?",
        createdAt: new Date('2025-04-23T08:30:00'),
        read: true,
      },
      {
        id: 2,
        senderId: 1,
        receiverId: 2,
        content: "Hi Sarah, I'd be happy to show you the property. Are you available this Friday at 3pm?",
        createdAt: new Date('2025-04-23T09:15:00'),
        read: true,
      },
      {
        id: 3,
        senderId: 2,
        receiverId: 1,
        content: "Friday at 3pm works for me. Is the price negotiable?",
        createdAt: new Date('2025-04-23T10:05:00'),
        read: true,
      },
      {
        id: 4,
        senderId: 1,
        receiverId: 2,
        content: "We can certainly discuss the price during our meeting. The owner is motivated to sell but the property has generated a lot of interest.",
        createdAt: new Date('2025-04-23T10:30:00'),
        read: true,
      },
      {
        id: 5,
        senderId: 2,
        receiverId: 1,
        content: "Great, I'll see you on Friday. Should I bring anything with me?",
        createdAt: new Date('2025-04-23T11:00:00'),
        read: true,
      },
    ],
  };
  
  useEffect(() => {
    // Set the header title to the conversation participant's name
    navigation.setOptions({
      title: conversation.user.name,
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 16 }}
          onPress={() => {/* View profile action */}}
        >
          <Image 
            source={{ uri: conversation.user.profileImage }} 
            style={{ width: 30, height: 30, borderRadius: 15 }}
          />
        </TouchableOpacity>
      ),
    });
    
    // Scroll to bottom when component mounts
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);
  
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  const sendMessage = () => {
    if (message.trim() === '') return;
    
    // In a real app, this would send the message to the API
    // Then add the message to the local state after successful API call
    
    setMessage('');
    
    // Scroll to the bottom after sending a message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
        >
          {conversation.messages.map((msg) => (
            <View 
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.senderId === 1 ? styles.sentMessage : styles.receivedMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.senderId === 1 ? styles.sentBubble : styles.receivedBubble,
                ]}
              >
                <Text style={styles.messageText}>{msg.content}</Text>
              </View>
              <Text 
                style={[
                  styles.messageTime,
                  msg.senderId === 1 ? styles.sentTime : styles.receivedTime,
                ]}
              >
                {formatTime(msg.createdAt)}
              </Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              message.trim() === '' ? styles.disabledButton : {},
            ]}
            onPress={sendMessage}
            disabled={message.trim() === ''}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sentBubble: {
    backgroundColor: '#007AFF',
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  receivedBubbleText: {
    color: '#000000',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    color: '#8E8E93',
  },
  sentTime: {
    alignSelf: 'flex-end',
  },
  receivedTime: {
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#B0B0B8',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ChatScreen;