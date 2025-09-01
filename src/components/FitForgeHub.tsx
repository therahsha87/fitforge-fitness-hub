'use client'

import React, { useState } from 'react'
import Dashboard from './Dashboard'
import AITrainer from './AITrainer'
import WorkoutLibrary from './WorkoutLibrary'
import Store from './Store'
import Profile from './Profile'
import Navigation from './Navigation'

export type TabType = 'dashboard' | 'ai-trainer' | 'workouts' | 'store' | 'profile'

interface TabConfig {
  id: TabType
  label: string
  icon: string
  component: React.ComponentType
}

const tabs: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', component: Dashboard },
  { id: 'ai-trainer', label: 'AI Trainer', icon: '🤖', component: AITrainer },
  { id: 'workouts', label: 'Workouts', icon: '💪', component: WorkoutLibrary },
  { id: 'store', label: 'Store', icon: '🛒', component: Store },
  { id: 'profile', label: 'Profile', icon: '👤', component: Profile },
]

const FitForgeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Dashboard

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔥</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  FitForge
                </h1>
                <p className="text-sm text-gray-300">Fitness Hub</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-green-400 text-sm">● Online</div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Navigation */}
        <Navigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  )
}

export default FitForgeHub
