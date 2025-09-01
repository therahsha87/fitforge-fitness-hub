'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Dumbbell, 
  Apple, 
  Target,
  Clock,
  TrendingUp,
  Zap,
  ExternalLink,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  citations?: Citation[];
}

interface Citation {
  title: string;
  url: string;
  snippet: string;
}

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  fitnessGoal: string;
  activityLevel: string;
  dietaryRestrictions: string[];
}

const AITrainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI Personal Trainer & Nutritionist. I can help you with personalized workout plans, nutrition advice, and answer any fitness questions. What would you like to work on today?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'trainer' | 'nutritionist'>('trainer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userProfile: UserProfile = {
    age: 28,
    weight: 70,
    height: 175,
    fitnessGoal: 'Build muscle and lose fat',
    activityLevel: 'Moderately active',
    dietaryRestrictions: ['Vegetarian']
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = {
    trainer: [
      "Create a 4-day upper/lower split workout plan",
      "How to improve my squat form?",
      "Best exercises for core strength",
      "Recovery time between workouts"
    ],
    nutritionist: [
      "Create a meal plan for muscle building",
      "How much protein should I eat daily?",
      "Best pre-workout snacks",
      "Healthy vegetarian protein sources"
    ]
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const systemPrompt = activeMode === 'trainer' 
        ? `You are a professional personal trainer with extensive knowledge in exercise science, biomechanics, and fitness programming. Provide evidence-based workout advice, form corrections, and training programs tailored to the user's goals.`
        : `You are a certified nutritionist specializing in sports nutrition and dietary planning. Provide evidence-based nutrition advice, meal planning, and dietary recommendations for fitness goals.`;

      const contextPrompt = `User Profile: Age ${userProfile.age}, Weight ${userProfile.weight}kg, Height ${userProfile.height}cm, Goal: ${userProfile.fitnessGoal}, Activity Level: ${userProfile.activityLevel}, Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}`;

      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protocol: 'https',
          origin: 'api.perplexity.ai',
          path: '/chat/completions',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_PERPLEXITY_API_KEY',
            'Content-Type': 'application/json'
          },
          body: {
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: `${systemPrompt} ${contextPrompt}`
              },
              {
                role: 'user',
                content: inputMessage
              }
            ],
            max_tokens: 1000,
            temperature: 0.2,
            top_p: 0.9,
            return_citations: true,
            return_images: false,
            search_domain_filter: ['healthline.com', 'mayoclinic.org', 'nih.gov', 'bodybuilding.com', 'examine.com'],
            search_recency_filter: 'month'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      const citations: Citation[] = data.citations?.map((citation: any) => ({
        title: citation.title,
        url: citation.url,
        snippet: citation.snippet
      })) || [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        citations: citations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string): void => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <span>AI Personal Trainer & Nutritionist</span>
          </CardTitle>
          <p className="text-gray-600">
            Get personalized fitness and nutrition guidance powered by AI with evidence-based recommendations
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'trainer' | 'nutritionist')}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="trainer" className="flex items-center space-x-2">
                <Dumbbell className="w-4 h-4" />
                <span>Personal Trainer</span>
              </TabsTrigger>
              <TabsTrigger value="nutritionist" className="flex items-center space-x-2">
                <Apple className="w-4 h-4" />
                <span>Nutritionist</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Questions */}
        <Card className="lg:order-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Quick Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickQuestions[activeMode].map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3 text-sm"
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
            
            {/* User Profile Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Your Profile</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Age: {userProfile.age} years</p>
                <p>Weight: {userProfile.weight}kg</p>
                <p>Height: {userProfile.height}cm</p>
                <p>Goal: {userProfile.fitnessGoal}</p>
                <p>Activity: {userProfile.activityLevel}</p>
                <p>Diet: {userProfile.dietaryRestrictions.join(', ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2 lg:order-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {activeMode === 'trainer' ? (
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                ) : (
                  <Apple className="w-5 h-5 text-green-600" />
                )}
                <span className="font-semibold">
                  {activeMode === 'trainer' ? 'Personal Trainer Chat' : 'Nutritionist Chat'}
                </span>
              </div>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>AI Powered</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4 border rounded-lg p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'}>
                        {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-black'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Citations */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-semibold mb-1">Sources:</p>
                          {message.citations.slice(0, 3).map((citation, index) => (
                            <div key={index} className="mb-1">
                              <a
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                              >
                                <span>{citation.title}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-500">
                        <Bot className="w-4 h-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask your AI ${activeMode === 'trainer' ? 'trainer' : 'nutritionist'} anything...`}
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="px-4"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AITrainer;
