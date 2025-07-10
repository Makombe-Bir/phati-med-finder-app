
import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, WifiOff, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAIResponse, onlineStatusListener } from '@/services/dataService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  medicines?: any[];
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI medicine assistant. I can help you find the right medicines for your symptoms or conditions. Try asking me something like "I have a headache" or "What can I take for fever?"',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  const quickQuestions = [
    "I have a headache",
    "What helps with fever?",
    "I need antibiotics for infection",
    "Medicine for diabetes",
    "Pain relief for children"
  ];

  // Monitor online status
  useEffect(() => {
    const cleanup = onlineStatusListener(setIsOnline);
    return cleanup;
  }, []);

  const handleSendMessage = async (message: string = inputValue) => {
    if (!message.trim()) return;
    
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "AI Assistant requires an internet connection.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(message);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.response,
        timestamp: new Date(),
        medicines: aiResponse.recommendedMedicines
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please check your internet connection and try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection error",
        description: error instanceof Error ? error.message : "Failed to get AI response.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!isOnline && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-red-600" />
              <p className="text-red-800">
                <strong>You're offline.</strong> AI Assistant requires an internet connection.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Questions */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-blue-800 mb-3 font-medium">Try asking me about:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question) => (
                  <Badge 
                    key={question}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    "{question}"
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="mb-6 h-96 overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-green-500 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  
                  {/* Recommended Medicines */}
                  {message.medicines && message.medicines.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Recommended medicines:</p>
                      {message.medicines.map((medicine) => (
                        <Card key={medicine.id} className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{medicine.name}</p>
                              <p className="text-sm text-gray-600">{medicine.strength} • {medicine.form}</p>
                              <p className="text-sm text-gray-500">{medicine.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">{medicine.price}</p>
                              <Badge className={medicine.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {medicine.inStock ? 'Available' : 'Out of Stock'}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Ask me about medicines, symptoms, or health conditions..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading || !isOnline}
          className="flex-1"
        />
        <Button 
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputValue.trim() || !isOnline}
          className="bg-green-500 hover:bg-green-600"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="mt-4 border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Medical Disclaimer:</strong> This AI assistant provides general information only and should not replace professional medical advice. 
            Always consult with a qualified healthcare provider for medical diagnosis and treatment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
