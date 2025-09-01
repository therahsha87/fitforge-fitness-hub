'use client'

import React, { useState } from 'react'
import SubscriptionPlans from './SubscriptionPlans'
import InAppPurchases from './InAppPurchases'
import CorporateWellness from './CorporateWellness'
import AffiliateStore from './AffiliateStore'
import RevenueAnalytics from './RevenueAnalytics'
import SponsoredContent from './SponsoredContent'
import { 
  DollarSign, 
  Crown, 
  ShoppingCart, 
  Building2, 
  Star, 
  Target,
  BarChart3,
  TrendingUp
} from 'lucide-react'

interface MonetizationTab {
  id: string
  name: string
  icon: React.ReactNode
  component: React.ComponentType
  description: string
}

const MonetizationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('analytics')

  const monetizationTabs: MonetizationTab[] = [
    {
      id: 'analytics',
      name: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      component: RevenueAnalytics,
      description: 'Revenue insights and business metrics'
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions',
      icon: <Crown className="w-5 h-5" />,
      component: SubscriptionPlans,
      description: 'Freemium subscription tiers and pricing'
    },
    {
      id: 'corporate',
      name: 'Corporate',
      icon: <Building2 className="w-5 h-5" />,
      component: CorporateWellness,
      description: 'B2B enterprise wellness solutions'
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      icon: <ShoppingCart className="w-5 h-5" />,
      component: InAppPurchases,
      description: 'In-app purchases and virtual economy'
    },
    {
      id: 'affiliates',
      name: 'Partners',
      icon: <Star className="w-5 h-5" />,
      component: AffiliateStore,
      description: 'Affiliate marketing and partner products'
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      icon: <Target className="w-5 h-5" />,
      component: SponsoredContent,
      description: 'Brand partnerships and sponsored campaigns'
    }
  ]

  const ActiveComponent = monetizationTabs.find(tab => tab.id === activeTab)?.component || RevenueAnalytics

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <DollarSign className="w-8 h-8 mr-3 text-green-600" />
                FitForge Monetization Hub
              </h1>
              <p className="text-gray-600 mt-1">
                Complete revenue management and business intelligence platform
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$252K</div>
                <div className="text-xs text-gray-600">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">69.7K</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">8.7%</div>
                <div className="text-xs text-gray-600">Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {monetizationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-blue-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-sm text-blue-700">
            {monetizationTabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <ActiveComponent />
      </div>

      {/* Revenue Summary Footer */}
      <div className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">💰 Multi-Stream Revenue Engine</h3>
            <p className="text-gray-300">
              Six proven revenue streams generating $3M+ annual potential
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="text-center">
              <Crown className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold">$548K</div>
              <div className="text-sm text-gray-400">Subscriptions</div>
            </div>
            <div className="text-center">
              <Building2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-lg font-bold">$1.87M</div>
              <div className="text-sm text-gray-400">Corporate</div>
            </div>
            <div className="text-center">
              <ShoppingCart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-lg font-bold">$281K</div>
              <div className="text-sm text-gray-400">In-App</div>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-lg font-bold">$107K</div>
              <div className="text-sm text-gray-400">Affiliates</div>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-lg font-bold">$222K</div>
              <div className="text-sm text-gray-400">Sponsored</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold">$3.03M</div>
              <div className="text-sm text-gray-400">Total ARR</div>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              🔥 The world's first gamified fitness platform with comprehensive B2B + B2C monetization
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonetizationDashboard
