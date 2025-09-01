'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Settings, 
  Trophy, 
  Calendar,
  TrendingUp,
  Target,
  Activity,
  Edit,
  Camera,
  Flame,
  Zap,
  Award,
  BarChart3,
  Clock,
  Heart,
  Dumbbell
} from 'lucide-react';

interface UserStats {
  level: number;
  experience: number;
  maxExperience: number;
  streak: number;
  totalWorkouts: number;
  caloriesBurned: number;
  achievements: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  maxProgress?: number;
}

interface WorkoutStats {
  date: string;
  duration: number;
  calories: number;
  exercises: number;
  type: string;
}

interface Props {
  userStats: UserStats;
}

const Profile: React.FC<Props> = ({ userStats }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first workout',
      icon: '👟',
      earned: true,
      earnedDate: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Maintain a 7-day workout streak',
      icon: '🔥',
      earned: true,
      earnedDate: new Date('2024-02-01'),
    },
    {
      id: '3',
      name: 'Century Club',
      description: 'Complete 100 total workouts',
      icon: '💯',
      earned: false,
      progress: 89,
      maxProgress: 100,
    },
    {
      id: '4',
      name: 'Calorie Crusher',
      description: 'Burn 20,000 total calories',
      icon: '🔥',
      earned: false,
      progress: 15420,
      maxProgress: 20000,
    },
    {
      id: '5',
      name: 'Consistency King',
      description: 'Workout 30 days in a row',
      icon: '👑',
      earned: false,
      progress: 7,
      maxProgress: 30,
    },
    {
      id: '6',
      name: 'Muscle Builder',
      description: 'Complete 50 strength workouts',
      icon: '💪',
      earned: false,
      progress: 23,
      maxProgress: 50,
    }
  ];

  const recentWorkouts: WorkoutStats[] = [
    {
      date: '2024-12-17',
      duration: 45,
      calories: 420,
      exercises: 8,
      type: 'Upper Body'
    },
    {
      date: '2024-12-16',
      duration: 30,
      calories: 280,
      exercises: 6,
      type: 'HIIT Cardio'
    },
    {
      date: '2024-12-15',
      duration: 50,
      calories: 380,
      exercises: 10,
      type: 'Full Body'
    },
    {
      date: '2024-12-14',
      duration: 25,
      calories: 220,
      exercises: 5,
      type: 'Core'
    },
    {
      date: '2024-12-13',
      duration: 40,
      calories: 350,
      exercises: 9,
      type: 'Lower Body'
    }
  ];

  const personalInfo = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    age: 28,
    weight: 70,
    height: 175,
    fitnessGoal: 'Build muscle and lose fat',
    activityLevel: 'Moderately active',
    joinDate: new Date('2024-01-15'),
  };

  const weeklyStats = {
    totalWorkouts: 5,
    totalDuration: 190,
    totalCalories: 1650,
    averageWorkout: 38,
    bestDay: 'Monday',
  };

  const getAchievementProgress = (achievement: Achievement): number => {
    if (achievement.earned) return 100;
    if (!achievement.progress || !achievement.maxProgress) return 0;
    return (achievement.progress / achievement.maxProgress) * 100;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getMembershipDuration = (): string => {
    const now = new Date();
    const joinDate = personalInfo.joinDate;
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months`;
    } else {
      return `${Math.floor(diffDays / 365)} years`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                  AJ
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
                  <p className="text-gray-600">{personalInfo.email}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 text-sm text-gray-500">
                    <span>Member for {getMembershipDuration()}</span>
                    <span>•</span>
                    <span>Level {userStats.level}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-4 md:mt-0"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              {/* Level Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Level {userStats.level} Progress</span>
                  <span>{userStats.experience} / {userStats.maxExperience} XP</span>
                </div>
                <Progress value={(userStats.experience / userStats.maxExperience) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 mx-auto text-orange-600 mb-2" />
            <h3 className="text-2xl font-bold">{userStats.streak}</h3>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <h3 className="text-2xl font-bold">{userStats.totalWorkouts}</h3>
            <p className="text-sm text-gray-600">Total Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
            <h3 className="text-2xl font-bold">{userStats.caloriesBurned.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Calories Burned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <h3 className="text-2xl font-bold">{achievements.filter(a => a.earned).length}</h3>
            <p className="text-sm text-gray-600">Achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* This Week's Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span>This Week's Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalWorkouts}</div>
                  <div className="text-sm text-gray-600">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{weeklyStats.totalDuration}m</div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{weeklyStats.totalCalories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{weeklyStats.averageWorkout}m</div>
                  <div className="text-sm text-gray-600">Avg Workout</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{weeklyStats.bestDay}</div>
                  <div className="text-sm text-gray-600">Best Day</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Workouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-green-600" />
                <span>Recent Workouts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{workout.type}</p>
                        <p className="text-sm text-gray-600">{formatDate(new Date(workout.date))}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{workout.duration}m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span>{workout.calories}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span>{workout.exercises}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${achievement.earned ? 'text-yellow-800' : 'text-gray-700'}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        {achievement.earned ? (
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Earned {formatDate(achievement.earnedDate!)}
                            </Badge>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>
                                {achievement.progress} / {achievement.maxProgress}
                              </span>
                            </div>
                            <Progress 
                              value={getAchievementProgress(achievement)} 
                              className="h-2" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workout Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Week</span>
                    <span className="font-bold">5 workouts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Week</span>
                    <span className="font-bold">4 workouts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average per Week</span>
                    <span className="font-bold">4.2 workouts</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      📈 You're 25% more active this week!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Longest Workout</span>
                    <Badge variant="secondary">65 minutes</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Most Calories Burned</span>
                    <Badge variant="secondary">520 kcal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Best Streak</span>
                    <Badge variant="secondary">12 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Favorite Workout</span>
                    <Badge variant="secondary">Upper Body</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-6 h-6 text-gray-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input value={personalInfo.name} readOnly={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input value={personalInfo.email} readOnly={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <Input value={personalInfo.age} readOnly={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <Input value={personalInfo.weight} readOnly={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Height (cm)</label>
                  <Input value={personalInfo.height} readOnly={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fitness Goal</label>
                  <Input value={personalInfo.fitnessGoal} readOnly={!isEditing} />
                </div>
              </div>
              
              {isEditing && (
                <div className="flex space-x-2 mt-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
