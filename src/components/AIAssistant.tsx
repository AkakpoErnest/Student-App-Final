// AI Assistant Chat Component
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  MessageSquare,
  Loader2,
  Sparkles,
  HelpCircle,
  BookOpen,
  ShoppingCart,
  User
} from 'lucide-react';
import { claudeAPI, ClaudeMessage } from '@/integrations/ai/claude';
import { toast } from 'sonner';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  context?: {
    currentPage?: string;
    userType?: 'buyer' | 'seller' | 'guest';
    university?: string;
    verificationStatus?: string;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, 
  onClose, 
  onToggle, 
  context = {} 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your StuFind AI Assistant. I can help you with questions about the app, how to buy/sell items, university verification, and more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // Add typing indicator
    const typingMsg: ChatMessage = {
      id: 'typing',
      role: 'assistant',
      content: 'Thinking...',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMsg]);

    // Check API key first
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    console.log('Environment API Key:', apiKey ? 'Loaded' : 'Not loaded');
    console.log('API Key preview:', apiKey?.substring(0, 20) + '...');
    console.log('All environment variables:', import.meta.env);
<<<<<<< HEAD
=======
    console.log('Current URL:', window.location.href);
    console.log('User message:', userMessage);
>>>>>>> 223c1e1f10e8df8313f75135b139094468c5ee81

    try {
      console.log('Sending message to Claude API:', userMessage);
      console.log('Context:', context);
      
      // Get AI response
      const response = await claudeAPI.getContextualResponse(userMessage, context);
      console.log('Claude API response:', response);
      
      // Check if response has error
      if (response.includes('error') || response.includes('Error')) {
        throw new Error('API returned error response');
      }
      
      // Remove typing indicator and add response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      console.error('AI Assistant error:', error);
      
      // Provide fallback responses for common questions
      const fallbackResponse = getFallbackResponse(userMessage);
      
      // Remove typing indicator and add response
      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.id !== 'typing');
        return [...withoutTyping, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        }];
      });
      
      toast.error('Using fallback response - API may be unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How do I sell an item?',
    'What is university verification?',
    'How do I use the WhatsApp bot?',
    'What are StuFind tokens?',
    'How do I contact a seller?',
    'What payment methods are accepted?'
  ];

  // Fallback responses when API is unavailable
  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sell') || lowerMessage.includes('post')) {
      return `To sell an item on StuFind:

1. **Sign up** for a free account
2. **Go to Dashboard** → "Post Opportunity"
3. **Fill out the form** with:
   - Item title and description
   - Price in Ghana Cedis (GHS)
   - Category (textbooks, electronics, etc.)
   - Upload photos
4. **Submit** and wait for buyers to contact you

Your item will appear in the marketplace for other students to browse!`;
    }
    
    if (lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
      return `To buy items on StuFind:

1. **Browse the Marketplace** to see available items
2. **Use filters** to find specific categories
3. **Click on items** to see details and seller info
4. **Contact the seller** directly via phone/WhatsApp
5. **Arrange payment** and pickup/delivery

All sellers are verified university students for your safety!`;
    }
    
    if (lowerMessage.includes('verification') || lowerMessage.includes('verify')) {
      return `University Verification on StuFind:

**What it is:** Confirms you're a real university student
**Why it matters:** Builds trust with other users
**How to verify:**
1. Go to your Profile
2. Upload your student ID
3. Submit verification request
4. Wait for approval (usually 24-48 hours)

Verified users get special badges and more trust from buyers/sellers!`;
    }
    
    if (lowerMessage.includes('token') || lowerMessage.includes('reward')) {
      return `StuFind Tokens:

**What they are:** Rewards for using the platform
**How to earn:**
- Post items for sale
- Complete transactions
- Refer friends
- Leave reviews

**What you can do:**
- Use for premium features
- Get discounts on fees
- Unlock special benefits

Check your Dashboard to see your current token balance!`;
    }
    
    if (lowerMessage.includes('whatsapp') || lowerMessage.includes('bot')) {
      return `WhatsApp Bot Features:

**Browse items** by category
**Search** for specific items
**Get seller contact** information
**Ask questions** about the platform

**How to use:**
1. Send a message to our WhatsApp number
2. Follow the menu prompts
3. Browse and search items
4. Get instant help

The bot is available 24/7 to help you buy and sell!`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 👋 Welcome to StuFind!

I'm here to help you with:
- **Buying & Selling** items
- **University Verification**
- **Using the WhatsApp Bot**
- **Understanding Tokens**
- **General questions** about the platform

What would you like to know?`;
    }
    
    // Default fallback
    return `I'm having trouble connecting to my AI service right now, but I can still help!

Here are some common topics I can assist with:
- How to buy/sell items
- University verification process
- Using the WhatsApp bot
- Understanding StuFind tokens
- General platform questions

Try asking about any of these topics, or visit our Help section for more detailed guides!`;
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const testAPI = async () => {
    console.log('Testing API connection...');
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API Key starts with sk-ant:', apiKey?.startsWith('sk-ant-'));
    
    try {
      const result = await claudeAPI.getQuickResponse('Hello, this is a test message');
      console.log('API Test Result:', result);
      toast.success('API connection successful!');
    } catch (error) {
      console.error('API Test Error:', error);
      toast.error('API connection failed: ' + (error as Error).message);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700 shadow-lg z-50 transition-all duration-200 hover:scale-105"
        size="icon"
      >
        <Bot className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out ${
      isMinimized ? 'h-16' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-teal-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">StuFind AI</CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-orange-600 to-teal-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.role === 'assistant' && (
                          <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-orange-600" />
                        )}
                        {message.role === 'user' && (
                          <User className="w-4 h-4 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.isTyping && (
                            <div className="flex items-center gap-1 mt-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span className="text-xs opacity-70">AI is typing...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={testAPI}
                  >
                    Test API Connection
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about StuFind..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700"
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AIAssistant;
