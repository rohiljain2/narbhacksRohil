"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI fitness coach. I can help you with workout advice, nutrition tips, and motivation. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("workout") || lowerMessage.includes("exercise")) {
      return "For effective workouts, focus on compound movements like squats, deadlifts, and bench press. Start with 3-4 sets of 8-12 reps, and gradually increase weight as you get stronger. Remember to warm up properly!";
    }
    
    if (lowerMessage.includes("nutrition") || lowerMessage.includes("diet") || lowerMessage.includes("food")) {
      return "A balanced diet is key! Aim for 1.6-2.2g of protein per kg of body weight, complex carbs for energy, and healthy fats. Don't forget to stay hydrated - drink at least 8 glasses of water daily.";
    }
    
    if (lowerMessage.includes("motivation") || lowerMessage.includes("motivated")) {
      return "Consistency beats perfection! Set small, achievable goals and celebrate your progress. Remember why you started - your future self will thank you. Every workout, no matter how small, is a step forward.";
    }
    
    if (lowerMessage.includes("weight") || lowerMessage.includes("lose weight")) {
      return "Weight loss is about creating a calorie deficit through diet and exercise. Focus on strength training to build muscle (which burns more calories), and eat in a moderate calorie deficit. Be patient - sustainable weight loss takes time.";
    }
    
    if (lowerMessage.includes("muscle") || lowerMessage.includes("gain muscle")) {
      return "To build muscle, focus on progressive overload in your strength training. Eat in a slight calorie surplus with adequate protein (1.6-2.2g per kg body weight). Get enough sleep and allow time for recovery between workouts.";
    }
    
    if (lowerMessage.includes("cardio") || lowerMessage.includes("running")) {
      return "Cardio is great for heart health and burning calories! Mix high-intensity intervals with steady-state cardio. Start with 20-30 minutes 3-4 times per week. You can do cardio on rest days or after strength training.";
    }
    
    return "That's a great question! I'm here to help with fitness advice, workout tips, nutrition guidance, and motivation. Feel free to ask me anything about your fitness journey!";
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);
      
      // Simulate AI response delay
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: generateResponse(inputMessage),
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">AI Coach</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤖</span>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about fitness..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "How do I start working out?",
              "What should I eat to build muscle?",
              "How can I stay motivated?",
              "What's the best cardio routine?",
              "How do I lose weight effectively?"
            ].map((tip, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(tip)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {tip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 