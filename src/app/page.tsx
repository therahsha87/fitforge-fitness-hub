'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dumbbell, 
  ShoppingCart, 
  BookOpen, 
  Activity, 
  Bot, 
  Gamepad2,
  Users,
  Flame,
  Target,
  Trophy,
  Star,
  Apple,
  Zap,
  Heart
} from 'lucide-react'

// Import our fitness components
import { SupplementCard } from '@/components/fitness/store/SupplementCard'
import { EquipmentCard } from '@/components/fitness/store/EquipmentCard'
import { WorkoutCard } from '@/components/fitness/library/WorkoutCard'
import { HealthMetrics } from '@/components/fitness/tracking/HealthMetrics'
import { AITrainerChat } from '@/components/fitness/ai-trainer/AITrainerChat'
import { FitForgeGame } from '@/components/fitness/fitforge/FitForgeGame'
import { Leaderboard } from '@/components/fitness/social/Leaderboard'

import { sdk } from '@farcaster/miniapp-sdk'
// Mock data
const userProfile = {
  age: 28,
  weight: 170,
  height: 5.8,
  fitnessGoal: 'Build muscle and improve endurance',
  activityLevel: 'Intermediate',
  dietaryRestrictions: ['None']
}

const currentUser = {
  id: '5',
  name: 'You',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  level: 12,
  totalXP: 2850,
  weeklyXP: 420,
  streak: 8,
  workoutsCompleted: 47,
  caloriesBurned: 12450,
  rank: 247,
  isCurrentUser: true
}

const healthData = {
  steps: 8420,
  stepsGoal: 10000,
  heartRate: 72,
  calories: 1850,
  caloriesGoal: 2200,
  activeMinutes: 45,
  activeGoal: 60,
  water: 6,
  waterGoal: 8,
  sleep: 7.5,
  sleepGoal: 8
}

const supplements = [
  {
    name: 'Whey Protein Isolate',
    brand: 'FitLife',
    price: 49.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 1247,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop',
    category: 'Protein',
    inStock: true,
    description: 'Premium whey protein isolate for muscle building and recovery',
    benefits: ['Muscle Growth', 'Fast Absorption', 'Low Carb']
  },
  {
    name: 'Pre-Workout Extreme',
    brand: 'Energy Max',
    price: 39.99,
    originalPrice: 44.99,
    rating: 4,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    category: 'Pre-Workout',
    inStock: true,
    description: 'High-energy pre-workout formula for intense training sessions',
    benefits: ['Energy Boost', 'Focus', 'Endurance']
  }
]

const equipment = [
  {
    name: 'Adjustable Dumbbells Set',
    brand: 'PowerFlex',
    price: 299.99,
    originalPrice: 349.99,
    rating: 5,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    category: 'Strength',
    inStock: true,
    description: 'Space-saving adjustable dumbbells from 5-50lbs per dumbbell',
    features: ['Quick Weight Changes', 'Space Efficient', '10-Year Warranty']
  },
  {
    name: 'Smart Treadmill Pro',
    brand: 'RunTech',
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    category: 'Cardio',
    inStock: true,
    description: 'Advanced treadmill with interactive training programs and heart rate monitoring',
    features: ['Interactive Display', 'Incline Control', 'Heart Rate Monitor']
  }
]

const workouts = [
  {
    title: 'HIIT Muscle Blaster',
    instructor: 'Sarah Johnson',
    duration: 30,
    difficulty: 'Intermediate' as const,
    type: 'HIIT',
    calories: 350,
    participants: 15420,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
    description: 'High-intensity interval training to build muscle and burn fat',
    equipment: ['Dumbbells', 'Mat'],
    videoUrl: '/videos/hiit-workout'
  },
  {
    title: 'Yoga Flow for Flexibility',
    instructor: 'Emma Chen',
    duration: 45,
    difficulty: 'Beginner' as const,
    type: 'Yoga',
    calories: 180,
    participants: 8930,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop',
    description: 'Gentle yoga flow to improve flexibility and reduce stress',
    equipment: ['Yoga Mat', 'Blocks'],
    videoUrl: '/videos/yoga-flow'
  }
]

export default function FitnessHub() {
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            if (document.readyState === 'complete') {
              resolve(void 0)
            } else {
              window.addEventListener('load', () => resolve(void 0), { once: true })
            }
          })
        }
        
        await sdk.actions.ready()
        console.log('Farcaster SDK initialized successfully - app fully loaded')
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error)
        setTimeout(async () => {
          try {
            await sdk.actions.ready()
            console.log('Farcaster SDK initialized on retry')
          } catch (retryError) {
            console.error('Farcaster SDK retry failed:', retryError)
          }
        }, 1000)
      }
    }

    initializeFarcaster()
  }, [])
  const [activeAIMode, setActiveAIMode] = useState<'trainer' | 'nutritionist'>('trainer')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              FitForge Fitness Hub
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Your ultimate fitness ecosystem - Shop, Learn, Track, Train with AI, and Game your way to peak fitness!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Store
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Library
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Activity className="h-4 w-4 mr-2" />
                Tracking
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Bot className="h-4 w-4 mr-2" />
                AI Trainer
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Gamepad2 className="h-4 w-4 mr-2" />
                FitForge Game
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Store</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="ai-trainer" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">AI Trainer</span>
            </TabsTrigger>
            <TabsTrigger value="fitforge" className="flex items-center space-x-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">FitForge</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Current Level</p>
                      <p className="text-3xl font-bold">{currentUser.level}</p>
                    </div>
                    <Zap className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Streak</p>
                      <p className="text-3xl font-bold">{currentUser.streak} days</p>
                    </div>
                    <Flame className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Workouts</p>
                      <p className="text-3xl font-bold">{currentUser.workoutsCompleted}</p>
                    </div>
                    <Target className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Rank</p>
                      <p className="text-3xl font-bold">#{currentUser.rank}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <HealthMetrics data={healthData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workouts.slice(0, 2).map((workout, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <img src={workout.image} alt={workout.title} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1">
                        <h4 className="font-medium">{workout.title}</h4>
                        <p className="text-sm text-gray-600">{workout.duration} min • {workout.calories} cal</p>
                      </div>
                      <Button size="sm">Resume</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="font-medium">Week Warrior</p>
                      <p className="text-sm text-gray-600">Completed 5 workouts this week</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Star className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Streak Master</p>
                      <p className="text-sm text-gray-600">8-day workout streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Store */}
          <TabsContent value="store" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Fitness Store</h2>
              <p className="text-gray-600 mb-8">Premium supplements and equipment to power your fitness journey</p>
            </div>

            <Tabs defaultValue="supplements" className="space-y-6">
              <TabsList>
                <TabsTrigger value="supplements">Supplements</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="supplements">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {supplements.map((supplement, idx) => (
                    <SupplementCard key={idx} {...supplement} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="equipment">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {equipment.map((item, idx) => (
                    <EquipmentCard key={idx} {...item} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Library */}
          <TabsContent value="library" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Workout Library</h2>
              <p className="text-gray-600 mb-8">Thousands of expert-led workouts for all fitness levels</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workouts.map((workout, idx) => (
                <WorkoutCard key={idx} {...workout} />
              ))}
            </div>
          </TabsContent>

          {/* Tracking */}
          <TabsContent value="tracking" className="space-y-6">
            <HealthMetrics data={healthData} />
          </TabsContent>

          {/* AI Trainer */}
          <TabsContent value="ai-trainer" className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold">AI Personal Assistant</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get personalized advice from your AI trainer and nutritionist powered by the latest research and data
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant={activeAIMode === 'trainer' ? 'default' : 'outline'}
                  onClick={() => setActiveAIMode('trainer')}
                  className="flex items-center space-x-2"
                >
                  <Dumbbell className="h-4 w-4" />
                  <span>Personal Trainer</span>
                </Button>
                <Button
                  variant={activeAIMode === 'nutritionist' ? 'default' : 'outline'}
                  onClick={() => setActiveAIMode('nutritionist')}
                  className="flex items-center space-x-2"
                >
                  <Apple className="h-4 w-4" />
                  <span>Nutritionist</span>
                </Button>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <AITrainerChat userProfile={userProfile} mode={activeAIMode} />
            </div>
          </TabsContent>

          {/* FitForge Game */}
          <TabsContent value="fitforge" className="space-y-6">
            <FitForgeGame />
          </TabsContent>

          {/* Social */}
          <TabsContent value="social" className="space-y-6">
            <Leaderboard currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
