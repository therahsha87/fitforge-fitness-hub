'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Crown, 
  Medal, 
  Flame, 
  Zap, 
  Users, 
  TrendingUp,
  Star,
  Target,
  Timer,
  Activity,
  Sword,
  Shield,
  Hammer
} from 'lucide-react'

interface LeaderboardUser {
  id: string
  name: string
  avatar: string
  level: number
  forgeRank: number
  totalXP: number
  weeklyXP: number
  streakDays: number
  specialization: 'Strength Forge' | 'Cardio Furnace' | 'Flexibility Flow' | 'Nutrition Master' | 'All-Round Champion'
  achievements: number
  workoutsThisWeek: number
  isOnline: boolean
  title: string
}

interface ForgeGuild {
  id: string
  name: string
  members: number
  avgLevel: number
  totalXP: number
  specialty: string
  badge: string
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState('global')
  
  const [globalLeaderboard] = useState<LeaderboardUser[]>([
    {
      id: '1',
      name: 'Alex "IronWill" Johnson',
      avatar: '/api/placeholder/avatar1',
      level: 47,
      forgeRank: 1,
      totalXP: 125400,
      weeklyXP: 3200,
      streakDays: 89,
      specialization: 'All-Round Champion',
      achievements: 156,
      workoutsThisWeek: 7,
      isOnline: true,
      title: 'Grand Forge Master'
    },
    {
      id: '2',
      name: 'Sarah "SteelHeart" Chen',
      avatar: '/api/placeholder/avatar2', 
      level: 42,
      forgeRank: 2,
      totalXP: 98750,
      weeklyXP: 2890,
      streakDays: 67,
      specialization: 'Strength Forge',
      achievements: 134,
      workoutsThisWeek: 6,
      isOnline: true,
      title: 'Forge Champion'
    },
    {
      id: '3',
      name: 'Mike "Thunderbolt" Rodriguez',
      avatar: '/api/placeholder/avatar3',
      level: 39,
      forgeRank: 3,
      totalXP: 87200,
      weeklyXP: 2650,
      streakDays: 45,
      specialization: 'Cardio Furnace',
      achievements: 98,
      workoutsThisWeek: 8,
      isOnline: false,
      title: 'Cardio Forge Lord'
    },
    {
      id: '4',
      name: 'Emma "FlexForce" Williams',
      avatar: '/api/placeholder/avatar4',
      level: 36,
      forgeRank: 4,
      totalXP: 76500,
      weeklyXP: 2100,
      streakDays: 23,
      specialization: 'Flexibility Flow',
      achievements: 89,
      workoutsThisWeek: 5,
      isOnline: true,
      title: 'Zen Forge Master'
    },
    {
      id: '5',
      name: 'David "NutriForge" Taylor',
      avatar: '/api/placeholder/avatar5',
      level: 34,
      forgeRank: 5,
      totalXP: 68900,
      weeklyXP: 1950,
      streakDays: 56,
      specialization: 'Nutrition Master',
      achievements: 67,
      workoutsThisWeek: 4,
      isOnline: true,
      title: 'Diet Forge Sage'
    },
    {
      id: '6',
      name: 'You',
      avatar: '/api/placeholder/you',
      level: 15,
      forgeRank: 847,
      totalXP: 12850,
      weeklyXP: 485,
      streakDays: 12,
      specialization: 'Strength Forge',
      achievements: 8,
      workoutsThisWeek: 4,
      isOnline: true,
      title: 'Apprentice Smith'
    }
  ])

  const [weeklyLeaderboard] = useState<LeaderboardUser[]>(
    globalLeaderboard
      .sort((a, b) => b.weeklyXP - a.weeklyXP)
      .map((user, index) => ({ ...user, forgeRank: index + 1 }))
  )

  const [forgeGuilds] = useState<ForgeGuild[]>([
    {
      id: '1',
      name: 'Iron Brotherhood',
      members: 2847,
      avgLevel: 28,
      totalXP: 5420000,
      specialty: 'Strength Training',
      badge: '⚡'
    },
    {
      id: '2',
      name: 'Cardio Legends',
      members: 1923,
      avgLevel: 31,
      totalXP: 4890000,
      specialty: 'Endurance',
      badge: '🔥'
    },
    {
      id: '3',
      name: 'Zen Warriors',
      members: 1456,
      avgLevel: 25,
      totalXP: 3200000,
      specialty: 'Flexibility & Recovery',
      badge: '🧘'
    },
    {
      id: '4',
      name: 'Nutrition Ninjas',
      members: 1834,
      avgLevel: 27,
      totalXP: 3890000,
      specialty: 'Diet & Wellness',
      badge: '🥗'
    }
  ])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Medal className="h-5 w-5 text-orange-600" />
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization) {
      case 'Strength Forge': return <Hammer className="h-4 w-4 text-red-500" />
      case 'Cardio Furnace': return <Flame className="h-4 w-4 text-orange-500" />
      case 'Flexibility Flow': return <Shield className="h-4 w-4 text-purple-500" />
      case 'Nutrition Master': return <Star className="h-4 w-4 text-green-500" />
      case 'All-Round Champion': return <Trophy className="h-4 w-4 text-yellow-500" />
      default: return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const getRankBackgroundColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600'
      default: return 'bg-white'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
          Forge Leaderboards
        </h2>
        <Badge variant="outline" className="text-purple-600 border-purple-600">
          <Users className="h-3 w-3 mr-1" />
          24,567 Active Forge Masters
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global">Global Forge</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Heat</TabsTrigger>
          <TabsTrigger value="friends">Forge Friends</TabsTrigger>
          <TabsTrigger value="guilds">Guilds</TabsTrigger>
        </TabsList>

        {/* Global Leaderboard */}
        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Global Forge Masters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {globalLeaderboard.map((user) => (
                  <div 
                    key={user.id} 
                    className={`p-4 rounded-lg border ${
                      user.name === 'You' 
                        ? 'border-blue-500 bg-blue-50' 
                        : user.forgeRank <= 3 
                          ? `${getRankBackgroundColor(user.forgeRank)} text-white border-transparent`
                          : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(user.forgeRank)}
                        </div>
                        
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">{user.name}</span>
                            {user.isOnline && (
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="text-sm opacity-80">{user.title}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Lv.{user.level}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getSpecializationIcon(user.specialization)}
                              <span className="ml-1">{user.specialization}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold">{user.totalXP.toLocaleString()} XP</div>
                        <div className="text-sm opacity-80">{user.streakDays} day streak</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{user.achievements} achievements</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly Leaderboard */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-600" />
                <span>Weekly Forge Heat Champions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyLeaderboard.slice(0, 10).map((user) => (
                  <div 
                    key={user.id} 
                    className={`p-4 rounded-lg border ${
                      user.name === 'You' 
                        ? 'border-blue-500 bg-blue-50' 
                        : user.forgeRank <= 3 
                          ? `${getRankBackgroundColor(user.forgeRank)} text-white border-transparent`
                          : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10">
                          {getRankIcon(user.forgeRank)}
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm opacity-80">Level {user.level}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-600">
                          {user.weeklyXP.toLocaleString()} XP
                        </div>
                        <div className="text-sm opacity-80">
                          {user.workoutsThisWeek} workouts
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Friends */}
        <TabsContent value="friends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Forge Friends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Connect with Fellow Forge Masters!</h3>
                <p className="text-gray-600 mb-6">
                  Add friends to compete, share workouts, and motivate each other on your fitness forging journey!
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Users className="h-4 w-4 mr-2" />
                  Find Forge Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guilds */}
        <TabsContent value="guilds" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forgeGuilds.map((guild) => (
              <Card key={guild.id} className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{guild.badge}</span>
                    <span>{guild.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{guild.members.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">Lv.{guild.avgLevel}</div>
                      <div className="text-sm text-gray-600">Avg Level</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{(guild.totalXP / 1000000).toFixed(1)}M XP</div>
                    <div className="text-sm text-gray-600">Total Guild XP</div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-sm font-medium text-gray-800">Specialty</div>
                    <div className="text-sm text-gray-600">{guild.specialty}</div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    Join {guild.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-600" />
            <span>Weekly Forge Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg bg-red-50 border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <Sword className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Iron Challenge</span>
              </div>
              <div className="text-sm text-red-700 mb-3">
                Complete 5 strength workouts this week
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>3/5 workouts</span>
                </div>
                <div className="bg-red-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <Badge className="mt-2 bg-red-600">+500 XP Reward</Badge>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Cardio Furnace</span>
              </div>
              <div className="text-sm text-blue-700 mb-3">
                Burn 2000 calories through cardio
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>1,450/2,000 cal</span>
                </div>
                <div className="bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '72%'}}></div>
                </div>
              </div>
              <Badge className="mt-2 bg-blue-600">+750 XP Reward</Badge>
            </div>

            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Timer className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Consistency Forge</span>
              </div>
              <div className="text-sm text-green-700 mb-3">
                Maintain 7-day workout streak
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>5/7 days</span>
                </div>
                <div className="bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '71%'}}></div>
                </div>
              </div>
              <Badge className="mt-2 bg-green-600">+1000 XP Reward</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Your Forge Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">#{globalLeaderboard.find(u => u.name === 'You')?.forgeRank}</div>
              <div className="text-sm text-gray-600">Global Rank</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">#{weeklyLeaderboard.find(u => u.name === 'You')?.forgeRank}</div>
              <div className="text-sm text-gray-600">Weekly Rank</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
