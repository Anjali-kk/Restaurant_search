import React, { useState } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { Restaurant } from '../types/Restaurant';
import { apiService } from '../services/api';

interface QuestionBotProps {
  restaurants: Restaurant[];
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

export const QuestionBot: React.FC<QuestionBotProps> = ({ restaurants }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI restaurant assistant powered by ChatGPT. I can help you find restaurants, answer questions about cuisines, pricing, dietary restrictions, or provide personalized recommendations. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Thinking...',
      isBot: true,
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await apiService.chatWithGPT({
        message: currentInput,
        restaurants: restaurants,
        context: `User is looking for restaurant recommendations. Current location context and available restaurants should be considered.`
      });

      // Remove loading message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          text: response.message,
          isBot: true,
          timestamp: new Date()
        }];
      });

    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove loading message and add error response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          text: "I'm sorry, I'm having trouble connecting right now. Please make sure your API keys are configured correctly, or try asking about the restaurants currently displayed.",
          isBot: true,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-orange-600 text-white rounded-t-xl">
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <span className="font-semibold">AI Restaurant Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-orange-700 p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  <div className="flex items-start">
                    {message.isBot ? (
                      <Bot size={16} className="mr-2 mt-1 flex-shrink-0" />
                    ) : (
                      <User size={16} className="mr-2 mt-1 flex-shrink-0" />
                    )}
                    <div className="text-sm">
                      {message.isLoading ? (
                        <div className="flex items-center">
                          <Loader2 size={14} className="animate-spin mr-2" />
                          {message.text}
                        </div>
                      ) : (
                        message.text
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about restaurants..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};