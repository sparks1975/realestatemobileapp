import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConversationItem from "@/components/ui/conversation-item";
import { motion } from "framer-motion";
import { Message, User, Client } from "@shared/schema";
import { currentUser, clients, messages } from "@/lib/mock-data";

interface Conversation {
  user: User | Client;
  lastMessage: Message;
}

export default function Messages() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch conversations
  const { data, isLoading } = useQuery({
    queryKey: ["/api/messages/conversations"],
    queryFn: async () => {
      // For demo purposes, use mock data
      // Convert mock clients to conversations
      const mockConversations: Conversation[] = clients.map(client => {
        // Find the last message for this client
        const clientMessages = messages.filter(
          m => m.senderId === client.id || m.receiverId === client.id
        ).sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        return {
          user: client,
          lastMessage: clientMessages[0] || {
            id: 0,
            senderId: client.id,
            receiverId: currentUser.id,
            content: "Hello there!",
            read: false,
            createdAt: new Date()
          }
        };
      });
      
      return mockConversations;
    }
  });
  
  // Filter conversations based on search
  const filteredConversations = data?.filter(conversation => {
    if (!searchTerm) return true;
    
    const name = 'name' in conversation.user ? conversation.user.name.toLowerCase() : '';
    const content = conversation.lastMessage.content.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return name.includes(search) || content.includes(search);
  });
  
  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header with title and new message button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <motion.button 
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-glow-primary"
          whileTap={{ scale: 0.95 }}
        >
          <Pen className="h-5 w-5 text-white" />
        </motion.button>
      </div>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search conversations..."
          className="pl-9 bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Conversation List */}
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
          <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
          <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
          <div className="h-20 bg-muted animate-pulse rounded-xl"></div>
        </div>
      ) : filteredConversations && filteredConversations.length > 0 ? (
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={'id' in conversation.user ? conversation.user.id : 0}
              user={conversation.user as User}
              lastMessage={conversation.lastMessage}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No conversations found</p>
          {searchTerm && (
            <Button 
              variant="link" 
              className="text-primary"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
