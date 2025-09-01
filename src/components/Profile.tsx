'use client'

import React, { useState } from 'react'

interface UserStats {
  totalWorkouts: number
  totalCaloriesBurned: number
  currentStreak: number
  longestStreak: number
  totalDistance: number
  averageWorkoutTime: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: Date
  progress?: number
  maxProgress?: number
}

interface UserProfile {
  name: string
  email: string
  joinDate: Date
  profileImage: string
  age: number
  weight: number
  height: number
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  preferences: {
    units: 'metric' | 'imperial'
    notifications: boolean
    privacy: 'public' | 'private'
  }
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'achievements' | 'settings'>('profile')
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Champion',
    email: 'alex@fitforge.com',
    joinDate: new Date('2024-01-15'),
    profileImage: '👤',
    age: 28,
    weight: 72,
    height: 175,
    fitnessLevel: 'intermediate',
    goals: ['Weight Loss', 'Muscle Building', 'Endurance'],
    preferences: {
      units: 'metric',
      notifications: true,
      privacy: 'public'
    }
  })

  const userStats: UserStats = {
    totalWorkouts: 127,
    totalCaloriesBurned: 15420,
    currentStreak: 15,
    longestStreak: 23,
    totalDistance: 245.6,
    averageWorkoutTime: 42
  }

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: '👟',
      earned: true,
      earnedDate: new Date('2024-01-16')
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Complete 7 workouts in a week',
      icon: '🗓️',
      earned: true,
      earnedDate: new Date('2024-01-23')
    },
    {
      id: '3',
      title: 'Calorie Crusher',
      description: 'Burn 10,000 total calories',
      icon: '🔥',
      earned: true,
      earnedDate: new Date('2024-02-15')
    },
    {
      id: '4',
      title: 'Streak Master',
      description: 'Maintain a 30-day workout streak',
      icon: '⚡',
      earned: false,
      progress: 15,
      maxProgress: 30
    },
    {
      id: '5',
      title: 'Distance Runner',
      description: 'Run 500km total distance',
      icon: '🏃‍♂️',
      earned: false,
      progress: 245,
      maxProgress: 500
    },
    {
      id: '6',
      title: 'Strength Legend',
      description: 'Complete 100 strength workouts',
      icon: '💪',
      earned: false,
      progress: 73,
      maxProgress: 100
    }
  ]

  const handleProfileUpdate = (): void => {
    setIsEditing(false)
    // Here you would typically save to backend
    console.log('Profile updated:', userProfile)
  }

  const getBMI = (): number => {
    const heightInMeters = userProfile.height / 100
    return userProfile.weight / (heightInMeters * heightInMeters)
  }

  const getBMICategory = (): { category: string; color: string } => {
    const bmi = getBMI()
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400' }
    if (bmi < 25) return { category: 'Normal', color: 'text-green-400' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-400' }
    return { category: 'Obese', color: 'text-red-400' }
  }

  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-4xl">
                {userProfile.profileImage}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold bg-gray-800 border border-purple-500/30 rounded px-3 py-1 text-white mb-2 w-full"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white mb-2">{userProfile.name}</h2>
                )}
                <p className="text-gray-400">{userProfile.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {userProfile.joinDate.toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => isEditing ? handleProfileUpdate() : setIsEditing(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
            </div>

            {/* Basic Info */}
            <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={userProfile.age}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{userProfile.age} years</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Weight</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={userProfile.weight}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{userProfile.weight} kg</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Height</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={userProfile.height}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{userProfile.height} cm</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Fitness Level</label>
                  {isEditing ? (
                    <select
                      value={userProfile.fitnessLevel}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, fitnessLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                      className="w-full p-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  ) : (
                    <p className="text-white font-medium capitalize">{userProfile.fitnessLevel}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Health Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">BMI</span>
                    <span className="text-white font-bold">{getBMI().toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                      style={{ width: `${Math.min((getBMI() / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 ${getBMICategory().color}`}>
                    {getBMICategory().category}
                  </p>
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Fitness Goals</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )

      case 'stats':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center">
                <div className="text-2xl mb-2">🏋️‍♂️</div>
                <div className="text-2xl font-bold text-white">{userStats.totalWorkouts}</div>
                <div className="text-sm text-gray-400">Total Workouts</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center">
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-white">{userStats.totalCaloriesBurned.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Calories Burned</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-white">{userStats.currentStreak}</div>
                <div className="text-sm text-gray-400">Current Streak</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-white">{userStats.longestStreak}</div>
                <div className="text-sm text-gray-400">Longest Streak</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center">
                <div className="text-2xl mb-2">🏃‍♂️</div>
                <div className="text-2xl font-bold text-white">{userStats.totalDistance}</div>
                <div className="text-sm text-gray-400">Distance (km)</div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20 text-center">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-white">{userStats.averageWorkoutTime}</div>
                <div className="text-sm text-gray-400">Avg Time (min)</div>
              </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-purple-500/10 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Progress Over Time</h3>
              <div className="h-64 bg-purple-500/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-400">Progress charts coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-6 border transition-colors ${
                    achievement.earned
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-purple-500/10 border-purple-500/20'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`text-3xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold mb-2 ${
                        achievement.earned ? 'text-green-300' : 'text-white'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <div className="text-green-400 text-sm">
                          ✅ Earned on {achievement.earnedDate?.toLocaleDateString()}
                        </div>
                      ) : achievement.progress !== undefined && achievement.maxProgress !== undefined ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className="text-sm text-white">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">🔒 Locked</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
