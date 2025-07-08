
import React, { useState } from 'react';
import { Send, Bot, User, Lightbulb, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  medicines?: Array<{
    name: string;
    reason: string;
    pharmacy: string;
    distance: string;
  }>;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your Phati AI assistant. I can help you find the right medicine for your symptoms or condition. What's bothering you today?",
      timestamp: new Date(),
      suggestions: [
        "I have a headache",
        "Looking for pain relief",
        "Need antibiotics",
        "Child fever medicine"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Simulate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: "Based on your symptoms, here are some medicine options I found nearby:",
      timestamp: new Date(),
      medicines: [
        {
          name: "Paracetamol 500mg",
          reason: "Effective for headache and general pain relief",
          pharmacy: "Pharmacie Centrale",
          distance: "0.8 km away"
        },
        {
          name: "Ibuprofen 400mg",
          reason: "Anti-inflammatory, good for pain and swelling",
          pharmacy: "Pharmacie Sainte-Anne",
          distance: "1.2 km away"
        }
      ],
      suggestions: [
        "How much should I take?",
        "Any side effects?",
        "Can I take both together?",
        "Reserve the Paracetamol"
      ]
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <div className="p-4 border-b bg-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Phati AI Assistant</h3>
              <p className="text-sm text-gray-600">Your personal medicine advisor</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p>{message.content}</p>
                </div>

                {/* Medicine suggestions */}
                {message.medicines && (
                  <div className="mt-3 space-y-2">
                    {message.medicines.map((medicine, index) => (
                      <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{medicine.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{medicine.reason}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                              <MapPin className="w-3 h-3" />
                              <span>{medicine.pharmacy} • {medicine.distance}</span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Reserve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick suggestions */}
                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-green-50 hover:border-green-300"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Describe your symptoms or ask about medicine..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-green-500 hover:bg-green-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Lightbulb className="w-3 h-3" />
            <span>Try: "I have fever and body aches" or "Safe pain relief for pregnancy"</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
