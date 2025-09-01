'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  PlayCircle, 
  Clock, 
  Zap, 
  Trophy, 
  Star,
  Target,
  Flame,
  Shield,
  Hammer,
  Dumbbell,
  Heart,
  CheckCircle
} from 'lucide-react'

interface WorkoutCardProps {
  id: string
  title: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  equipment: string[]
  description: string
  forgeType?: 'Strength Forge' | 'Cardio Furnace' | 'Flexibility Flow' | 'Power Forge'
  xpReward?: number
  materialsEarned?: string[]
  completionRate?: number
}

export function WorkoutCard({
  id,
  title,
  duration,
  difficulty,
  equipment,
  description,
  forgeType = 'Strength Forge',
  xpReward = 50,
  materialsEarned = ['Strength Essence'],
  completionRate = 87
}: WorkoutCardProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [progress, setProgress] = useState(0)

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'text-green-600 border-green-600'
      case 'Intermediate': return 'text-yellow-600 border-yellow-600'
      case 'Advanced': return 'text-orange-600 border-orange-600'
      case 'Expert': return 'text-red-600 border-red-600'
      default: return 'text-gray-600 border-gray-600'
    }
  }

  const getForgeTypeIcon = (type: string) => {
    switch (type) {
      case 'Strength Forge': return <Hammer className="h-4 w-4 text-red-500" />
      case 'Cardio Furnace': return <Flame className="h-4 w-4 text-orange-500" />
      case 'Flexibility Flow': return <Shield className="h-4 w-4 text-purple-500" />
      case 'Power Forge': return <Zap className="h-4 w-4 text-yellow-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getForgeTypeColor = (type: string) => {
    switch (type) {
      case 'Strength Forge': return 'text-red-600 border-red-600 bg-red-50'
      case 'Cardio Furnace': return 'text-orange-600 border-orange-600 bg-orange-50'
      case 'Flexibility Flow': return 'text-purple-600 border-purple-600 bg-purple-50'
      case 'Power Forge': return 'text-yellow-600 border-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 border-gray-600 bg-gray-50'
    }
  }

  const handleStartWorkout = () => {
    setIsStarted(true)
    
    // Simulate workout progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsCompleted(true)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const handleCompleteWorkout = () => {
    setIsCompleted(true)
    // In a real app, this would update user stats and give rewards
    console.log(`Completed workout: ${title}`)
  }

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      isCompleted ? 'border-green-500 bg-green-50' : ''
    }`}>
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <Badge variant="outline" className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">{description}</p>
        
        {/* Workout Details */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </Badge>
          
          <Badge variant="outline" className={`flex items-center space-x-1 ${getForgeTypeColor(forgeType)}`}>
            {getForgeTypeIcon(forgeType)}
            <span>{forgeType}</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center space-x-1 text-yellow-600 border-yellow-600">
            <Star className="h-3 w-3" />
            <span>+{xpReward} XP</span>
          </Badge>
        </div>

        {/* Equipment Required */}
        <div>
          <div className="text-sm font-medium mb-2">Equipment Needed:</div>
          <div className="flex flex-wrap gap-1">
            {equipment.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {/* Materials Earned */}
        <div>
          <div className="text-sm font-medium mb-2">Forge Materials Earned:</div>
          <div className="flex flex-wrap gap-1">
            {materialsEarned.map((material, index) => (
              <Badge key={index} variant="outline" className="text-xs text-green-600 border-green-600">
                <Trophy className="h-3 w-3 mr-1" />
                {material}
              </Badge>
            ))}
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Community Completion Rate</span>
            <span className="text-sm text-gray-600">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Workout Progress */}
        {isStarted && !isCompleted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Workout Progress</span>
              <span className="text-sm text-blue-600">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isStarted && !isCompleted && (
            <Button onClick={handleStartWorkout} className="w-full bg-orange-600 hover:bg-orange-700">
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Forge Workout
            </Button>
          )}
          
          {isStarted && !isCompleted && progress >= 100 && (
            <Button onClick={handleCompleteWorkout} className="w-full bg-green-600 hover:bg-green-700">
              <Trophy className="h-4 w-4 mr-2" />
              Complete & Claim Rewards
            </Button>
          )}
          
          {isCompleted && (
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Workout Forged Successfully!</span>
              </div>
              <div className="text-sm text-green-600 mt-1">
                +{xpReward} XP • +{materialsEarned.join(', ')} Materials
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">25</div>
            <div className="text-xs text-gray-600">Forge Points</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">450</div>
            <div className="text-xs text-gray-600">Est. Calories</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">4.2</div>
            <div className="text-xs text-gray-600">Avg Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
