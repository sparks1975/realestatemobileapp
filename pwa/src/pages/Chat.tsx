import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend, FiInfo } from 'react-icons/fi';
import apiClient from '../api/client';
import { Message, User, Client } from '../types';

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contact, setContact] = useState<User | Client | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      fetchMessages(parseInt(id));
    }
  }, [id]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchMessages = async (contactId: number) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/messages/${contactId}`);
      setMessages(response.data);
      
      // Fetch contact information
      // In a real app, you would have an API endpoint to get user/client details
      // For now, we'll fake it with the sender/receiver info from the first message
      if (response.data.length > 0) {
        const message = response.data[0];
        // Assuming current user is the sender
        const contactId = message.receiverId;
        // This would be a separate API call in a real app
        setContact({
          id: contactId,
          name: `Contact ${contactId}`, // Placeholder
          email: `contact${contactId}@example.com`, // Placeholder
          phone: null,
          profileImage: null,
          createdAt: null,
          username: `user${contactId}`, // Placeholder
          role: null,
        });
      }
      
      setError(null);
    } catch (err) {
      console.error(`Error fetching messages:`, err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const sendMessage = async () => {
    if (!id || !newMessage.trim()) return;
    
    try {
      setSending(true);
      const response = await apiClient.post('/api/messages', {
        receiverId: parseInt(id),
        content: newMessage.trim()
      });
      
      // Add the new message to the list
      setMessages(prev => [...prev, response.data]);
      
      // Clear the input
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (dateString: Date | string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDate = (dateString: Date | string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const shouldShowDate = (index: number) => {
    if (index === 0) return true;
    
    const currentDate = new Date(messages[index].createdAt || '');
    const prevDate = new Date(messages[index - 1].createdAt || '');
    
    return (
      currentDate.getDate() !== prevDate.getDate() ||
      currentDate.getMonth() !== prevDate.getMonth() ||
      currentDate.getFullYear() !== prevDate.getFullYear()
    );
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading conversation...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error}</p>
        <button className="btn btn-primary mr-md" onClick={() => navigate('/messages')}>
          Back to Messages
        </button>
        {id && (
          <button 
            className="btn btn-secondary" 
            onClick={() => fetchMessages(parseInt(id))}
          >
            Retry
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="chat-page">
      <div className="chat-header card flex items-center justify-between mb-md">
        <div className="flex items-center gap-md">
          <button 
            className="btn btn-icon" 
            onClick={() => navigate('/messages')}
            style={{ 
              backgroundColor: 'transparent', 
              color: 'var(--color-text-primary)'
            }}
          >
            <FiArrowLeft size={24} />
          </button>
          {contact && (
            <div className="flex items-center gap-sm">
              <div className="contact-avatar" style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                overflow: 'hidden'
              }}>
                <img 
                  src={contact.profileImage || 'https://via.placeholder.com/40?text=User'} 
                  alt={contact.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div className="contact-name font-semibold">{contact.name}</div>
                <div className="contact-status text-tertiary text-sm">
                  {/* This would be dynamic in a real app */}
                  Online
                </div>
              </div>
            </div>
          )}
        </div>
        <button 
          className="btn btn-icon" 
          onClick={() => {/* Show contact info */}}
          style={{ 
            backgroundColor: 'transparent', 
            color: 'var(--color-text-primary)'
          }}
        >
          <FiInfo size={24} />
        </button>
      </div>
      
      <div className="chat-container card mb-md" style={{ height: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column' }}>
        <div className="messages-list" style={{ flex: '1', overflowY: 'auto', padding: 'var(--spacing-md)' }}>
          {messages.length === 0 ? (
            <div className="text-center py-xl">
              <p className="text-tertiary mb-sm">No messages yet</p>
              <p className="text-secondary">Send a message to start the conversation.</p>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <div key={message.id}>
                  {shouldShowDate(index) && (
                    <div className="message-date-separator text-center my-md">
                      <span className="date-badge" style={{ 
                        backgroundColor: 'var(--color-bg-secondary)', 
                        padding: '4px 12px', 
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-tertiary)'
                      }}>
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className={`message-item mb-sm flex ${message.senderId === 1 ? 'justify-end' : ''}`}
                  >
                    <div 
                      className={`message-content ${message.senderId === 1 ? 'sent' : 'received'}`}
                      style={{ 
                        backgroundColor: message.senderId === 1 ? 'var(--color-accent-primary)' : 'var(--color-bg-card)',
                        color: message.senderId === 1 ? 'white' : 'var(--color-text-primary)',
                        borderRadius: '18px',
                        padding: '10px 16px',
                        maxWidth: '70%'
                      }}
                    >
                      <div className="message-text">{message.content}</div>
                      <div 
                        className="message-time text-sm"
                        style={{ 
                          textAlign: 'right',
                          opacity: 0.8,
                          fontSize: '0.75rem',
                          marginTop: '4px'
                        }}
                      >
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef}></div>
            </div>
          )}
        </div>
        
        <div className="message-input-container" style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-md">
            <input
              type="text"
              className="form-input flex-1"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button 
              className="btn btn-primary btn-icon"
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;