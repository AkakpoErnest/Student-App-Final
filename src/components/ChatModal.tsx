import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, X, User } from 'lucide-react';
import { getCurrentUser } from '@/integrations/firebase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  senderName: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUserId: string;
  otherUserName: string;
  opportunityTitle: string;
}

const ChatModal = ({ isOpen, onClose, otherUserId, otherUserName, opportunityTitle }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentUser(getCurrentUser());
      // Load chat history here
      loadChatHistory();
    }
  }, [isOpen, otherUserId]);

  const loadChatHistory = async () => {
    // This would typically load from Firebase
    // For now, we'll use sample data
    const sampleMessages: Message[] = [
      {
        id: '1',
        senderId: otherUserId,
        receiverId: currentUser?.uid || '',
        content: `Hi! I'm interested in your opportunity: ${opportunityTitle}`,
        timestamp: new Date(Date.now() - 60000),
        senderName: otherUserName
      }
    ];
    setMessages(sampleMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.uid,
      receiverId: otherUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      senderName: currentUser.displayName || 'You'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Here you would save the message to Firebase
    // For now, we'll just show it locally
    toast.success('Message sent!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span>{otherUserName}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">Re: {opportunityTitle}</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 p-4 border-t">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.senderId === currentUser?.uid
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
