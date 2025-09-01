'use client'

import React from 'react'
import type { TabType } from './FitForgeHub'

interface TabConfig {
  id: TabType
  label: string
  icon: string
  component: React.ComponentType
}

interface NavigationProps {
  tabs: TabConfig[]
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const Navigation: React.FC<NavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:block w-64 bg-black bg-opacity-30 backdrop-blur-md border-r border-purple-500/20">
        <div className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-purple-500/10 hover:text-white'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-t border-purple-500/20 z-50">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Navigation
