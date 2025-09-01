'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Building2,
  Star,
  Target,
  BarChart3
} from 'lucide-react'

interface RevenueData {
  totalRevenue: number
  monthlyGrowth: number
  totalUsers: number
  conversionRate: number
  averageLTV: number
  churnRate: number
}

const RevenueAnalytics: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 3031610,
    monthlyGrowth: 18.5,
    totalUsers: 12340,
    conversionRate: 12.4,
    averageLTV: 180,
    churnRate: 6.2
  })

  const revenueStreams = [
    {
      name: 'Corporate Wellness',
      revenue: 1870000,
      percentage: 61.7,
      icon: <Building2 className="w-8 h-8 text-blue-500" />,
      growth: '+23%',
      color: 'blue'
    },
    {
      name: 'Subscriptions',
      revenue: 548640,
      percentage: 18.1,
      icon: <Users className="w-8 h-8 text-green-500" />,
      growth: '+15%',
      color: 'green'
    },
    {
      name: 'In-App Purchases',
      revenue: 281000,
      percentage: 9.3,
      icon: <ShoppingCart className="w-8 h-8 text-purple-500" />,
      growth: '+28%',
      color: 'purple'
    },
    {
      name: 'Sponsored Content',
      revenue: 222000,
      percentage: 7.3,
      icon: <Target className="w-8 h-8 text-red-500" />,
      growth: '+31%',
      color: 'red'
    },
    {
      name: 'Affiliate Commissions',
      revenue: 109970,
      percentage: 3.6,
      icon: <Star className="w-8 h-8 text-orange-500" />,
      growth: '+12%',
      color: 'orange'
    }
  ]

  const topPerformers = [
    { name: 'Steel Forgemaster Plan', revenue: 312450, category: 'Subscription' },
    { name: 'TechCorp Wellness (500 emp)', revenue: 180000, category: 'Corporate' },
    { name: 'Dragon Steel Bundle', revenue: 67230, category: 'In-App' },
    { name: 'Nike Strength Challenge', revenue: 45600, category: 'Sponsored' },
    { name: 'Optimum Nutrition Partnership', revenue: 34890, category: 'Affiliate' }
  ]

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          📊 Revenue Analytics Dashboard
        </h2>
        <p className="text-xl text-gray-600">
          Comprehensive business intelligence and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(revenueData.totalRevenue)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
              +{revenueData.monthlyGrowth}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {revenueData.monthlyGrowth}%
            </div>
            <div className="text-sm text-gray-600">Monthly Growth</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {revenueData.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {revenueData.conversionRate}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              ${revenueData.averageLTV}
            </div>
            <div className="text-sm text-gray-600">Average LTV</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {revenueData.churnRate}%
            </div>
            <div className="text-sm text-gray-600">Churn Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>💰 Revenue Streams Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {revenueStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {stream.icon}
                  <div>
                    <h3 className="font-semibold text-gray-900">{stream.name}</h3>
                    <p className="text-sm text-gray-600">{stream.percentage}% of total revenue</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stream.revenue)}
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {stream.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Top Revenue Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{performer.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {performer.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(performer.revenue)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RevenueAnalytics
