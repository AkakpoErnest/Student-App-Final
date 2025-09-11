// WhatsApp Bot Test Page
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { processMessage } from '@/integrations/whatsapp/bot-service';
import { WhatsAppMessage, BotResponse } from '@/integrations/whatsapp/types';

const BotTest: React.FC = () => {
  const [messages, setMessages] = useState<Array<{id: string, from: 'user' | 'bot', content: string, timestamp: Date}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+233 24 123 4567');
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = (from: 'user' | 'bot', content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      from,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsProcessing(true);

    // Add user message
    addMessage('user', userMessage);

    try {
      // Create mock WhatsApp message
      const mockMessage: WhatsAppMessage = {
        id: Date.now().toString(),
        from: phoneNumber,
        timestamp: new Date().toISOString(),
        type: 'text',
        text: {
          body: userMessage
        }
      };

      // Process message through bot
      const response = await processMessage(mockMessage);
      
      if (response) {
        // Format bot response
        let botContent = response.content;
        if (response.buttons) {
          botContent += '\n\n' + response.buttons.map(btn => `[${btn.title}]`).join(' ');
        }
        if (response.list) {
          botContent += '\n\n' + response.list.sections.map(section => 
            section.title + ':\n' + section.rows.map(row => `• ${row.title}`).join('\n')
          ).join('\n\n');
        }
        
        addMessage('bot', botContent);
      } else {
        addMessage('bot', 'No response generated');
      }
    } catch (error) {
      console.error('Bot test error:', error);
      addMessage('bot', 'Error: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const sendTestMessage = (message: string) => {
    setInputMessage(message);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              WhatsApp Bot Test
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Test your WhatsApp bot functionality before deploying
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <CardTitle className="text-lg">Bot Chat</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearChat}>
                    Clear Chat
                  </Button>
                </div>
                <CardDescription>
                  Phone: {phoneNumber}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation with the bot</p>
                      <p className="text-sm">Try: "menu", "browse", "help", or "textbooks"</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.from === 'user'
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.from === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                            {message.from === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={isProcessing}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputMessage.trim() || isProcessing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Controls */}
          <div className="space-y-6">
            {/* Phone Number */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Test Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+233 24 123 4567"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Test Messages */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Quick Tests</CardTitle>
                <CardDescription>
                  Click to send test messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => sendTestMessage('menu')}
                >
                  Show Menu
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => sendTestMessage('browse')}
                >
                  Browse Items
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => sendTestMessage('textbooks')}
                >
                  Search Textbooks
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => sendTestMessage('help')}
                >
                  Get Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => sendTestMessage('sell item')}
                >
                  Sell Item
                </Button>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Bot Service: Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Firebase: Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Webhook: Not Deployed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotTest;

