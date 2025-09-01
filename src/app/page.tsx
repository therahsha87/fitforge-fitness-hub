'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Target, 
  Trophy, 
  Zap, 
  MessageCircle, 
  ShoppingCart, 
  BookOpen,
  User,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Heart,
  Dumbbell,
  Apple,
  Timer
} from 'lucide-react';
import AITrainer from '@/components/AITrainer';
import WorkoutLibrary from '@/components/WorkoutLibrary';
import Store from '@/components/Store';
import Profile from '@/components/Profile';

interface UserStats {
  level: number;
  experience: number;
  maxExperience: number;
  streak: number;
  totalWorkouts: number;
  caloriesBurned: number;
  achievements: string[];
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick: () => void;
}

const FitForgeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    experience: 2400,
    maxExperience: 3000,
    streak: 7,
    totalWorkouts: 89,
    caloriesBurned: 15420,
    achievements: ['Early Bird', 'Consistency King', 'Calorie Crusher']
  });

  const quickActions: QuickAction[] = [
    { 
      icon: MessageCircle, 
      label: 'AI Trainer', 
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => setActiveTab('ai-trainer')
    },
    { 
      icon: Dumbbell, 
      label: 'Quick Workout', 
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => setActiveTab('workouts')
    },
    { 
      icon: Apple, 
      label: 'Nutrition Plan', 
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => setActiveTab('ai-trainer')
    },
    { 
      icon: ShoppingCart, 
      label: 'Store', 
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => setActiveTab('store')
    }
  ];

  const todaysGoals = [
    { icon: Flame, label: 'Calories', current: 420, target: 500, unit: 'kcal' },
    { icon: Timer, label: 'Active Time', current: 35, target: 45, unit: 'min' },
    { icon: Heart, label: 'Heart Points', current: 18, target: 30, unit: 'pts' },
    { icon: Trophy, label: 'Challenges', current: 2, target: 3, unit: 'done' }
  ];

  const recentAchievements = [
    { name: 'Week Warrior', description: '7-day workout streak!', date: 'Today', xp: 250 },
    { name: 'Heavy Lifter', description: 'Increased deadlift by 20lbs', date: '2 days ago', xp: 150 },
    { name: 'Nutrition Ninja', description: 'Met macro goals for 5 days', date: '3 days ago', xp: 100 }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to FitForge Hub
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Forge your fitness journey with AI-powered guidance</p>
      </div>

      {/* User Level and Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                  FF
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">Level {userStats.level}</h2>
                <p className="text-gray-600">Fitness Warrior</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                🔥 {userStats.streak} day streak
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Experience Progress</span>
              <span>{userStats.experience} / {userStats.maxExperience} XP</span>
            </div>
            <Progress value={(userStats.experience / userStats.maxExperience) * 100} className="h-3" />
            <p className="text-xs text-gray-500">
              {userStats.maxExperience - userStats.experience} XP to next level
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white h-24 flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105`}
            >
              <Icon className="w-8 h-8" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Today's Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span>Today's Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {todaysGoals.map((goal, index) => {
              const Icon = goal.icon;
              const percentage = (goal.current / goal.target) * 100;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                    percentage >= 100 ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      percentage >= 100 ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold">{goal.current} / {goal.target} {goal.unit}</p>
                    <p className="text-sm text-gray-600">{goal.label}</p>
                    <Progress value={percentage} className="h-2 mt-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="w-12 h-12 mx-auto text-blue-600 mb-3" />
            <h3 className="text-2xl font-bold">{userStats.totalWorkouts}</h3>
            <p className="text-gray-600">Total Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Flame className="w-12 h-12 mx-auto text-orange-600 mb-3" />
            <h3 className="text-2xl font-bold">{userStats.caloriesBurned.toLocaleString()}</h3>
            <p className="text-gray-600">Calories Burned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto text-purple-600 mb-3" />
            <h3 className="text-2xl font-bold">{userStats.achievements.length}</h3>
            <p className="text-gray-600">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{achievement.name}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    +{achievement.xp} XP
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FitForge Hub
              </h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="grid grid-cols-5 w-full md:w-auto">
                <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="ai-trainer" className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Trainer</span>
                </TabsTrigger>
                <TabsTrigger value="workouts" className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Workouts</span>
                </TabsTrigger>
                <TabsTrigger value="store" className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Store</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>
          
          <TabsContent value="ai-trainer">
            <AITrainer />
          </TabsContent>
          
          <TabsContent value="workouts">
            <WorkoutLibrary />
          </TabsContent>
          
          <TabsContent value="store">
            <Store />
          </TabsContent>
          
          <TabsContent value="profile">
            <Profile userStats={userStats} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default FitForgeHub;
