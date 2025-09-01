'use client'

import React, { useState, useRef, useEffect } from 'react'
import { perplexityChat, perplexityResearch, type ChatMessage } from '../perplexity-api'

type ChatRole = 'user' | 'assistant'
type TrainerMode = 'trainer' | 'nutritionist'

interface ChatMsg {
  id: string
  role: ChatRole
  content: string
  citations?: string[]
  timestamp: Date
  mode: TrainerMode
}

interface UserProfile {
  age: number
  weight: number
  height: number
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  restrictions: string[]
}

const AITrainer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [mode, setMode] = useState<TrainerMode>('trainer')
  const [showProfile, setShowProfile] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    weight: 70,
    height: 170,
    fitnessLevel: 'intermediate',
    goals: ['Weight Loss', 'Muscle Building'],
    restrictions: []
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Welcome message
    const welcomeMessage: ChatMsg = {
      id: 'welcome',
      role: 'assistant',
      content: mode === 'trainer' 
        ? "👋 Hi there! I'm your AI Personal Trainer. I'm here to help you with workout plans, exercise techniques, and fitness guidance. What would you like to work on today?"
        : "🥗 Hello! I'm your AI Nutritionist. I can help you with meal planning, nutrition advice, and dietary guidance. What nutritional support do you need?",
      timestamp: new Date(),
      mode
    }
    setMessages([welcomeMessage])
  }, [mode])

  const handleSend = async (): Promise<void> => {
    if (!input.trim() || loading) return

    const userMessage: ChatMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      mode
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const systemPrompt = mode === 'trainer'
        ? `You are an expert AI Personal Trainer with extensive knowledge in exercise science, fitness programming, and injury prevention. 

User Profile:
- Age: ${userProfile.age}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm  
- Fitness Level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.goals.join(', ')}
- Restrictions: ${userProfile.restrictions.join(', ') || 'None'}

Provide personalized, safe, and effective fitness advice. Always prioritize safety and recommend consulting healthcare professionals for medical concerns. Include specific exercise recommendations, rep ranges, and progression tips when appropriate.`
        
        : `You are an expert AI Nutritionist with deep knowledge in nutrition science, meal planning, and dietary health.

User Profile:
- Age: ${userProfile.age}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm
- Fitness Level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.goals.join(', ')}
- Dietary Restrictions: ${userProfile.restrictions.join(', ') || 'None'}

Provide evidence-based nutrition advice, meal suggestions, and dietary guidance. Always prioritize health and safety. Include specific nutrient recommendations, portion sizes, and meal timing when appropriate. Recommend consulting healthcare professionals for medical dietary concerns.`

      const chatMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage.content }
      ]

      const response = await perplexityChat({
        model: 'sonar-pro',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 1000
      })

      const assistantMessage: ChatMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.',
        citations: response.citations || [],
        timestamp: new Date(),
        mode
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Trainer Error:', error)
      const errorMessage: ChatMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again in a moment.',
        timestamp: new Date(),
        mode
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getSampleQuestions = (): string[] => {
    return mode === 'trainer' 
      ? [
          "Create a beginner full-body workout routine",
          "How do I improve my squat form?",
          "Best exercises for building core strength",
          "How to create a weekly workout schedule"
        ]
      : [
          "Create a meal plan for muscle building",
          "What should I eat before and after workouts?",
          "How to calculate my daily calorie needs",
          "Best protein sources for vegetarians"
        ]
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-t-lg p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{mode === 'trainer' ? '🏋️‍♂️' : '🥗'}</div>
            <div>
              <h2 className="text-xl font-bold text-white">
                AI {mode === 'trainer' ? 'Personal Trainer' : 'Nutritionist'}
              </h2>
              <p className="text-sm text-gray-300">
                {mode === 'trainer' ? 'Expert fitness guidance' : 'Personalized nutrition advice'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="User Profile"
            >
              ⚙️
            </button>
            
            <div className="bg-purple-500/20 rounded-lg p-1">
              <button
                onClick={() => setMode('trainer')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  mode === 'trainer' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Trainer
              </button>
              <button
                onClick={() => setMode('nutritionist')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  mode === 'nutritionist' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Nutritionist
              </button>
            </div>
          </div>
        </div>

        {/* Profile Panel */}
        {showProfile && (
          <div className="mt-4 p-4 bg-purple-500/10 rounded-lg">
            <h3 className="font-semibold mb-3">User Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <label className="block text-gray-300 mb-1">Age</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile(prev => ({...prev, age: parseInt(e.target.value) || 0}))}
                  className="w-full p-2 bg-black/20 border border-purple-500/30 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={userProfile.weight}
                  onChange={(e) => setUserProfile(prev => ({...prev, weight: parseInt(e.target.value) || 0}))}
                  className="w-full p-2 bg-black/20 border border-purple-500/30 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={userProfile.height}
                  onChange={(e) => setUserProfile(prev => ({...prev, height: parseInt(e.target.value) || 0}))}
                  className="w-full p-2 bg-black/20 border border-purple-500/30 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Fitness Level</label>
                <select
                  value={userProfile.fitnessLevel}
                  onChange={(e) => setUserProfile(prev => ({...prev, fitnessLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'}))}
                  className="w-full p-2 bg-black/20 border border-purple-500/30 rounded text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 bg-black bg-opacity-20 backdrop-blur-md overflow-y-auto p-4 space-y-4 min-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-4'
                    : 'bg-gray-800 text-gray-100 mr-4'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-xs text-gray-400 mb-2">Sources:</p>
                    <div className="space-y-1">
                      {message.citations.map((citation, index) => (
                        <a
                          key={index}
                          href={citation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-blue-400 hover:text-blue-300 truncate"
                        >
                          {citation}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`text-xs text-gray-400 mt-1 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-4 rounded-2xl mr-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <span className="text-gray-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Sample Questions */}
      {messages.length <= 1 && (
        <div className="p-4 bg-purple-500/10">
          <p className="text-sm text-gray-300 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {getSampleQuestions().map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-b-lg p-4 border-t border-purple-500/20">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask your AI ${mode === 'trainer' ? 'trainer' : 'nutritionist'} anything...`}
              className="w-full p-3 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500"
              rows={3}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default AITrainer
