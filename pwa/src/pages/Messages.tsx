import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMessageCircle } from 'react-icons/fi';
import apiClient from '../api/client';
import { Conversation } from '../types';

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchConversations();
  }, []);
  
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/messages/conversations');
      setConversations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: Date | string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Today, show time
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffInDays < 7) {
      // Within a week, show day name
      return date.toLocaleDateString('en-US', {
        weekday: 'short'
      });
    } else {
      // More than a week, show date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  const truncateMessage = (message: string, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };
  
  const filteredConversations = searchQuery.trim() === '' 
    ? conversations
    : conversations.filter(convo => 
        convo.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convo.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading messages...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error}</p>
        <button className="btn btn-primary" onClick={fetchConversations}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="messages-page">
      <h1 className="page-title mb-lg">Messages</h1>
      
      <div className="messages-container">
        <div className="search-container mb-lg">
          <div className="search-input-wrapper" style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <FiSearch 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--color-text-tertiary)'
              }} 
            />
          </div>
        </div>
        
        {filteredConversations.length === 0 ? (
          <div className="card text-center py-lg">
            {searchQuery ? (
              <div>
                <FiMessageCircle size={48} className="text-tertiary mb-md" style={{ margin: '0 auto' }} />
                <p className="text-tertiary">No conversations match your search</p>
              </div>
            ) : (
              <div>
                <FiMessageCircle size={48} className="text-tertiary mb-md" style={{ margin: '0 auto' }} />
                <p className="text-tertiary">No conversations yet</p>
                <p className="text-secondary">Start messaging your clients and colleagues</p>
              </div>
            )}
          </div>
        ) : (
          <div className="conversations-list">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.user.id}
                to={`/messages/${conversation.user.id}`}
                className="conversation-item card mb-md flex items-center gap-md"
                style={{ padding: 'var(--spacing-md)', textDecoration: 'none', color: 'inherit' }}
              >
                <div className="conversation-avatar" style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img 
                    src={conversation.user.profileImage || 'https://via.placeholder.com/50?text=User'} 
                    alt={conversation.user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="conversation-content flex-1">
                  <div className="conversation-header flex justify-between mb-xs">
                    <div className="conversation-name font-semibold">{conversation.user.name}</div>
                    <div className="conversation-time text-tertiary text-sm">
                      {formatDate(conversation.lastMessage.createdAt)}
                    </div>
                  </div>
                  <div className="conversation-message text-secondary">
                    {truncateMessage(conversation.lastMessage.content)}
                  </div>
                </div>
                {!conversation.lastMessage.read && (
                  <div className="conversation-unread-badge" style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-accent-primary)' 
                  }}></div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;