'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  Heart, 
  Zap, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  Timer,
  Flame,
  Droplets,
  Moon,
  Clock
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'

interface HealthData {
  date: string
  weight: number
  bodyFat: number
  muscle: number
  calories: number
  steps: number
  sleep: number
  heartRate: number
  workouts: number
}

interface DailyMetrics {
  caloriesConsumed: number
  caloriesBurned: number
  proteinGrams: number
  waterLiters: number
  sleepHours: number
  stepsCount: number
  workoutMinutes: number
  restingHeartRate: number
}

export function HealthMetrics() {
  const [healthData] = useState<HealthData[]>([
    { date: '2024-01-01', weight: 175, bodyFat: 18, muscle: 45, calories: 2200, steps: 8500, sleep: 7.5, heartRate: 65, workouts: 1 },
    { date: '2024-01-02', weight: 174.8, bodyFat: 17.8, muscle: 45.2, calories: 2180, steps: 9200, sleep: 8, heartRate: 63, workouts: 1 },
    { date: '2024-01-03', weight: 174.5, bodyFat: 17.6, muscle: 45.5, calories: 2250, steps: 10100, sleep: 7, heartRate: 64, workouts: 0 },
    { date: '2024-01-04', weight: 174.2, bodyFat: 17.4, muscle: 45.8, calories: 2300, steps: 11200, sleep: 8.5, heartRate: 62, workouts: 1 },
    { date: '2024-01-05', weight: 174, bodyFat: 17.2, muscle: 46, calories: 2280, steps: 9800, sleep: 7.5, heartRate: 61, workouts: 1 },
    { date: '2024-01-06', weight: 173.8, bodyFat: 17, muscle: 46.2, calories: 2320, steps: 10500, sleep: 8, heartRate: 60, workouts: 1 },
    { date: '2024-01-07', weight: 173.5, bodyFat: 16.8, muscle: 46.5, calories: 2400, steps: 12000, sleep: 8.5, heartRate: 59, workouts: 2 }
  ])

  const [todayMetrics] = useState<DailyMetrics>({
    caloriesConsumed: 2150,
    caloriesBurned: 2380,
    proteinGrams: 145,
    waterLiters: 2.8,
    sleepHours: 7.5,
    stepsCount: 8234,
    workoutMinutes: 45,
    restingHeartRate: 62
  })

  const [activeMetric, setActiveMetric] = useState('overview')

  // Calculate trends
  const getWeeklyTrend = (metric: keyof HealthData) => {
    if (healthData.length < 2) return 0
    const recent = healthData[healthData.length - 1][metric] as number
    const previous = healthData[healthData.length - 2][metric] as number
    return ((recent - previous) / previous) * 100
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 2) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < -2) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    return <TrendingUp className="h-4 w-4 text-gray-500" />
  }

  const getGoalProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          Forge Analytics
        </h2>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Activity className="h-3 w-3 mr-1" />
          Live Tracking
        </Badge>
      </div>

      <Tabs value={activeMetric} onValueChange={setActiveMetric} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{todayMetrics.restingHeartRate}</div>
                <div className="text-sm text-gray-600">BPM</div>
                <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                  Excellent
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{todayMetrics.caloriesBurned}</div>
                <div className="text-sm text-gray-600">Calories Burned</div>
                <Badge variant="outline" className="mt-1 text-orange-600 border-orange-600">
                  Active Day
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{todayMetrics.waterLiters}L</div>
                <div className="text-sm text-gray-600">Water Intake</div>
                <Badge variant="outline" className="mt-1 text-blue-600 border-blue-600">
                  93% Goal
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Moon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{todayMetrics.sleepHours}h</div>
                <div className="text-sm text-gray-600">Sleep</div>
                <Badge variant="outline" className="mt-1 text-purple-600 border-purple-600">
                  Good
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Today's Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Today's Forge Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Calories Burned</span>
                  </div>
                  <span className="text-sm text-gray-600">{todayMetrics.caloriesBurned}/2500</span>
                </div>
                <Progress value={getGoalProgress(todayMetrics.caloriesBurned, 2500)} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Steps</span>
                  </div>
                  <span className="text-sm text-gray-600">{todayMetrics.stepsCount.toLocaleString()}/10,000</span>
                </div>
                <Progress value={getGoalProgress(todayMetrics.stepsCount, 10000)} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Workout Time</span>
                  </div>
                  <span className="text-sm text-gray-600">{todayMetrics.workoutMinutes}/60 min</span>
                </div>
                <Progress value={getGoalProgress(todayMetrics.workoutMinutes, 60)} className="h-2" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm font-medium">Hydration</span>
                  </div>
                  <span className="text-sm text-gray-600">{todayMetrics.waterLiters}/3.0L</span>
                </div>
                <Progress value={getGoalProgress(todayMetrics.waterLiters, 3.0)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Charts */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight & Body Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="bodyFat" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="muscle" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="calories" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    <Area type="monotone" dataKey="steps" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Workout Intensity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#ef4444" />
                  <Bar dataKey="sleep" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weight Trend</p>
                    <p className="text-2xl font-bold">174 lbs</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(getWeeklyTrend('weight'))}
                      <span className={`text-xs ${getWeeklyTrend('weight') < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(getWeeklyTrend('weight')).toFixed(1)}% this week
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Muscle Mass</p>
                    <p className="text-2xl font-bold">46.5 kg</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(getWeeklyTrend('muscle'))}
                      <span className={`text-xs ${getWeeklyTrend('muscle') > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        +{Math.abs(getWeeklyTrend('muscle')).toFixed(1)}% this week
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Body Fat</p>
                    <p className="text-2xl font-bold">16.8%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {getTrendIcon(-getWeeklyTrend('bodyFat'))}
                      <span className={`text-xs ${getWeeklyTrend('bodyFat') < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {getWeeklyTrend('bodyFat') < 0 ? '-' : '+'}{Math.abs(getWeeklyTrend('bodyFat')).toFixed(1)}% this week
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Forge Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Strength Gains</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Muscle mass increased by 3.2% this month! Your forge is running hot 🔥
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Cardio Improvement</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Resting heart rate improved by 8% - your cardiovascular forge is strong!
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Moon className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Recovery Quality</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Sleep quality trending upward - your recovery forge is optimizing!
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">Energy Levels</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Consistent energy throughout the day - your nutrition forge is balanced!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Daily Forge Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Workout Duration</span>
                      <span className="text-sm text-gray-600">{todayMetrics.workoutMinutes}/60 min</span>
                    </div>
                    <Progress value={getGoalProgress(todayMetrics.workoutMinutes, 60)} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Protein Intake</span>
                      <span className="text-sm text-gray-600">{todayMetrics.proteinGrams}/165g</span>
                    </div>
                    <Progress value={getGoalProgress(todayMetrics.proteinGrams, 165)} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Steps Goal</span>
                      <span className="text-sm text-gray-600">{todayMetrics.stepsCount.toLocaleString()}/10,000</span>
                    </div>
                    <Progress value={getGoalProgress(todayMetrics.stepsCount, 10000)} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Sleep Goal</span>
                      <span className="text-sm text-gray-600">{todayMetrics.sleepHours}/8h</span>
                    </div>
                    <Progress value={getGoalProgress(todayMetrics.sleepHours, 8)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>Weekly Milestones</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800">Workout Consistency</div>
                    <div className="text-sm text-green-600">5/5 days completed</div>
                  </div>
                  <Badge className="bg-green-600">
                    <Award className="h-3 w-3 mr-1" />
                    Achieved!
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-yellow-800">Strength Progress</div>
                    <div className="text-sm text-yellow-600">3/4 PR attempts</div>
                  </div>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    75% Complete
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-800">Hydration Streak</div>
                    <div className="text-sm text-blue-600">6/7 days on target</div>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    86% Complete
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-medium text-purple-800">Sleep Quality</div>
                    <div className="text-sm text-purple-600">7/7 nights optimal</div>
                  </div>
                  <Badge className="bg-purple-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Perfect!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
