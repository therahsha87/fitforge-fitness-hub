'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Dumbbell, 
  Apple, 
  Target,
  Heart,
  Zap,
  TrendingUp
} from 'lucide-react'
import { perplexityChat } from '../../../perplexity-api'

interface Message {
  id: string
  type: 'user' | 'trainer' | 'nutritionist'
  content: string
  timestamp: Date
  citations?: string[]
}

interface UserProfile {
  age: number
  weight: number
  height: number
  fitnessGoal: string
  activityLevel: string
  dietaryRestrictions: string[]
}

interface AITrainerChatProps {
  userProfile: UserProfile
  mode: 'trainer' | 'nutritionist'
}

export function AITrainerChat({ userProfile, mode }: AITrainerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: mode,
      content: mode === 'trainer' 
        ? "Hey there! 💪 I'm your AI Personal Trainer. Based on your profile, I can help you create custom workout plans, suggest exercises, and track your fitness progress. What would you like to work on today?"
        : "Hello! 🍎 I'm your AI Nutritionist. I can help you create personalized meal plans, suggest healthy recipes, track your nutrition, and answer any diet-related questions. How can I support your nutrition goals today?",
      timestamp: new Date(),
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const quickPrompts = mode === 'trainer' 
    ? [
        "Create a beginner workout plan",
        "Best exercises for muscle building",
        "How to improve my cardio?",
        "Home workout without equipment"
      ]
    : [
        "Create a healthy meal plan",
        "Best foods for muscle building",
        "Help me lose weight safely",
        "Vegetarian protein sources"
      ]

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const systemPrompt = mode === 'trainer' 
        ? `You are an expert AI Personal Trainer. User profile: Age ${userProfile.age}, Weight ${userProfile.weight}lbs, Height ${userProfile.height}ft, Goal: ${userProfile.fitnessGoal}, Activity Level: ${userProfile.activityLevel}. Provide personalized, evidence-based fitness advice with specific exercises, sets, reps, and safety tips. Keep responses engaging and motivational.`
        : `You are an expert AI Nutritionist. User profile: Age ${userProfile.age}, Weight ${userProfile.weight}lbs, Height ${userProfile.height}ft, Goal: ${userProfile.fitnessGoal}, Activity Level: ${userProfile.activityLevel}, Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}. Provide personalized, science-based nutrition advice with specific meal suggestions, portion sizes, and nutritional information. Keep responses practical and encouraging.`

      const response = await perplexityChat({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: mode,
        content: response.choices[0]?.message?.content || 'Sorry, I had trouble processing that. Please try again.',
        timestamp: new Date(),
        citations: response.citations
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: mode,
        content: "I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-2">
          {mode === 'trainer' ? (
            <>
              <Dumbbell className="h-5 w-5 text-blue-600" />
              <span>AI Personal Trainer</span>
              <Badge variant="secondary" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </>
          ) : (
            <>
              <Apple className="h-5 w-5 text-green-600" />
              <span>AI Nutritionist</span>
              <Badge variant="secondary" className="ml-2">
                <Heart className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : mode === 'trainer' 
                        ? 'bg-orange-500' 
                        : 'bg-green-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <p className="text-xs text-gray-600 mb-1">Sources:</p>
                        <div className="space-y-1">
                          {message.citations.slice(0, 3).map((citation, idx) => (
                            <a
                              key={idx}
                              href={citation}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline block"
                            >
                              {citation}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    mode === 'trainer' ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={mode === 'trainer' ? "Ask about workouts, exercises, fitness goals..." : "Ask about nutrition, meal plans, healthy recipes..."}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(currentMessage)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(currentMessage)}
              disabled={isLoading || !currentMessage.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
