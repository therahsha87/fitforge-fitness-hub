'use client'

import React, { useState, useEffect } from 'react'

interface StatCard {
  title: string
  value: string
  change: string
  icon: string
  color: string
}

interface QuickAction {
  title: string
  icon: string
  description: string
  action: () => void
}

const Dashboard: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const stats: StatCard[] = [
    {
      title: 'Calories Burned',
      value: '2,450',
      change: '+12%',
      icon: '🔥',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Workout Streak',
      value: '15 days',
      change: '+5 days',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Weight Progress',
      value: '-3.2 kg',
      change: 'This month',
      icon: '⚖️',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Muscle Gain',
      value: '+1.8 kg',
      change: '+8%',
      icon: '💪',
      color: 'from-blue-500 to-purple-500'
    }
  ]

  const quickActions: QuickAction[] = [
    {
      title: 'Quick Workout',
      icon: '🏃‍♂️',
      description: 'Start a 20-min HIIT session',
      action: () => console.log('Quick workout started')
    },
    {
      title: 'AI Trainer',
      icon: '🤖',
      description: 'Get personalized advice',
      action: () => console.log('AI Trainer opened')
    },
    {
      title: 'Meal Plan',
      icon: '🍽️',
      description: 'View today\'s nutrition',
      action: () => console.log('Meal plan opened')
    },
    {
      title: 'Progress Photo',
      icon: '📸',
      description: 'Upload progress picture',
      action: () => console.log('Photo upload started')
    }
  ]

  const todaysWorkout = {
    name: 'Upper Body Strength',
    duration: '45 min',
    exercises: [
      { name: 'Bench Press', sets: '3x8', completed: true },
      { name: 'Pull-ups', sets: '3x10', completed: true },
      { name: 'Overhead Press', sets: '3x8', completed: false },
      { name: 'Rows', sets: '3x10', completed: false }
    ]
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Champion! 🔥</h1>
            <p className="text-purple-100">
              {time.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-purple-200 mt-1">
              Current time: {time.toLocaleTimeString()}
            </p>
          </div>
          <div className="text-6xl opacity-20">🏆</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
              <div className="text-green-400 text-sm font-medium">{stat.change}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors border border-purple-500/20 hover:border-purple-500/40"
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-white font-medium text-sm mb-1">{action.title}</div>
              <div className="text-gray-400 text-xs">{action.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Workout */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Today's Workout</h2>
          <div className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium text-white">
            {todaysWorkout.duration}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">{todaysWorkout.name}</h3>
          <div className="space-y-2">
            {todaysWorkout.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  exercise.completed 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-purple-500/10 border border-purple-500/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    exercise.completed 
                      ? 'bg-green-500' 
                      : 'bg-purple-500/30 border-2 border-purple-500'
                  }`}>
                    {exercise.completed && <div className="w-full h-full flex items-center justify-center text-white text-xs">✓</div>}
                  </div>
                  <span className={`font-medium ${
                    exercise.completed ? 'text-green-300' : 'text-white'
                  }`}>
                    {exercise.name}
                  </span>
                </div>
                <span className={`text-sm ${
                  exercise.completed ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {exercise.sets}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-colors">
          Continue Workout
        </button>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Weekly Progress</h2>
        <div className="h-48 bg-purple-500/5 rounded-lg flex items-center justify-center border border-purple-500/20">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-gray-400">Progress chart coming soon</p>
          </div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">Recent Achievements</h2>
        <div className="space-y-3">
          {[
            { title: '15-Day Streak Master', icon: '🔥', description: 'Completed 15 consecutive workout days' },
            { title: 'Weight Loss Champion', icon: '🏆', description: 'Lost 3kg this month' },
            { title: 'Strength Builder', icon: '💪', description: 'Increased bench press by 10kg' }
          ].map((achievement, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-2xl">{achievement.icon}</div>
              <div>
                <div className="font-medium text-white">{achievement.title}</div>
                <div className="text-sm text-gray-400">{achievement.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
