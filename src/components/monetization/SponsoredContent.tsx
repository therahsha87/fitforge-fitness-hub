'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Star, 
  Users, 
  TrendingUp, 
  Target,
  Flame,
  Award,
  Clock,
  Eye,
  Heart
} from 'lucide-react'

interface SponsoredCampaign {
  id: string
  title: string
  brand: string
  category: 'workout' | 'nutrition' | 'challenge' | 'product'
  duration: number
  participants: number
  engagement: number
  revenue: number
  cpm: number
  description: string
  features: string[]
  forgeRewards: string[]
  status: 'active' | 'upcoming' | 'completed'
  brandLogo: string
  campaignImage: string
}

interface PerformanceData {
  totalCampaigns: number
  totalRevenue: number
  avgEngagement: number
  avgCPM: number
  topPartners: string[]
}

const SponsoredContent: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const performanceData: PerformanceData = {
    totalCampaigns: 24,
    totalRevenue: 156780,
    avgEngagement: 89.2,
    avgCPM: 15.50,
    topPartners: ['Nike', 'Optimum Nutrition', 'Fitbit', 'Under Armour']
  }

  const sponsoredCampaigns: SponsoredCampaign[] = [
    {
      id: 'nike-hiit-series',
      title: 'Nike HIIT Master Series',
      brand: 'Nike',
      category: 'workout',
      duration: 30,
      participants: 15600,
      engagement: 92.4,
      revenue: 28500,
      cpm: 18.25,
      description: 'High-intensity interval training series with Nike trainers',
      features: [
        '8 exclusive HIIT workouts',
        'Nike trainer video content',
        'Custom Nike-branded interface',
        'Limited edition Nike forge theme'
      ],
      forgeRewards: [
        'Nike Champion Badge',
        'Exclusive swoosh forge effects',
        'Premium athletic materials',
        'Nike gear discount codes'
      ],
      status: 'active',
      brandLogo: '/nike-logo.png',
      campaignImage: '/nike-hiit-campaign.jpg'
    },
    {
      id: 'optimum-nutrition-challenge',
      title: 'Optimum Nutrition Strength Builder',
      brand: 'Optimum Nutrition',
      category: 'challenge',
      duration: 21,
      participants: 12400,
      engagement: 87.8,
      revenue: 22300,
      cpm: 17.85,
      description: '21-day strength building challenge with nutrition focus',
      features: [
        'Daily nutrition tips',
        'Protein tracking integration',
        'Supplement recommendations',
        'Custom meal plans'
      ],
      forgeRewards: [
        'Protein Crystal multiplier',
        'Strength Essence bonus',
        'Optimum forge branding',
        'Product discount codes'
      ],
      status: 'active',
      brandLogo: '/optimum-logo.png',
      campaignImage: '/optimum-challenge.jpg'
    },
    {
      id: 'fitbit-step-challenge',
      title: 'Fitbit Global Step Challenge',
      brand: 'Fitbit',
      category: 'challenge',
      duration: 14,
      participants: 28900,
      engagement: 94.1,
      revenue: 35600,
      cpm: 12.30,
      description: 'Worldwide step competition with Fitbit integration',
      features: [
        'Auto-sync with Fitbit devices',
        'Global leaderboards',
        'Achievement tracking',
        'Social challenges'
      ],
      forgeRewards: [
        'Step Master Badge',
        'Cardio material bonuses',
        'Fitbit-themed forge colors',
        'Device upgrade discounts'
      ],
      status: 'completed',
      brandLogo: '/fitbit-logo.png',
      campaignImage: '/fitbit-challenge.jpg'
    },
    {
      id: 'under-armour-recovery',
      title: 'Under Armour Recovery Zone',
      brand: 'Under Armour',
      category: 'workout',
      duration: 14,
      participants: 9200,
      engagement: 85.3,
      revenue: 18400,
      cpm: 19.95,
      description: 'Recovery-focused workout series with UA technology',
      features: [
        'Recovery-focused exercises',
        'Sleep tracking integration',
        'UA HOVR shoe recommendations',
        'Recovery metrics dashboard'
      ],
      forgeRewards: [
        'Recovery Master Badge',
        'Healing Aura materials',
        'UA forge aesthetic',
        'Gear discount codes'
      ],
      status: 'upcoming',
      brandLogo: '/ua-logo.png',
      campaignImage: '/ua-recovery.jpg'
    },
    {
      id: 'muscle-milk-transformation',
      title: 'Muscle Milk 30-Day Transform',
      brand: 'Muscle Milk',
      category: 'nutrition',
      duration: 30,
      participants: 7800,
      engagement: 91.7,
      revenue: 24500,
      cpm: 31.40,
      description: 'Complete body transformation with Muscle Milk nutrition',
      features: [
        'Transformation tracking',
        'Nutrition coaching',
        'Before/after galleries',
        'Community support'
      ],
      forgeRewards: [
        'Transformation Champion Badge',
        'Legendary protein materials',
        'Muscle Milk forge branding',
        'Product sample packs'
      ],
      status: 'active',
      brandLogo: '/musclemilk-logo.png',
      campaignImage: '/musclemilk-transform.jpg'
    },
    {
      id: 'garmin-endurance',
      title: 'Garmin Endurance Challenge',
      brand: 'Garmin',
      category: 'challenge',
      duration: 45,
      participants: 18500,
      engagement: 88.9,
      revenue: 27400,
      cpm: 14.80,
      description: 'Long-distance endurance challenge with Garmin tracking',
      features: [
        'GPS route tracking',
        'Heart rate monitoring',
        'Training analytics',
        'Achievement milestones'
      ],
      forgeRewards: [
        'Endurance Master Badge',
        'Stamina material bonuses',
        'Garmin-themed interface',
        'Device trade-in credits'
      ],
      status: 'upcoming',
      brandLogo: '/garmin-logo.png',
      campaignImage: '/garmin-endurance.jpg'
    }
  ]

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string): React.ReactNode => {
    switch (category) {
      case 'workout': return <Play className="w-4 h-4" />
      case 'nutrition': return <Star className="w-4 h-4" />
      case 'challenge': return <Target className="w-4 h-4" />
      case 'product': return <Award className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getFilteredCampaigns = (): SponsoredCampaign[] => {
    if (activeFilter === 'all') return sponsoredCampaigns
    return sponsoredCampaigns.filter(campaign => campaign.status === activeFilter)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🎯 Sponsored Content Management
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Partner brand campaigns and native advertising integration
        </p>

        {/* Performance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{performanceData.totalCampaigns}</div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(performanceData.totalRevenue)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{performanceData.avgEngagement}%</div>
            <div className="text-sm text-gray-600">Avg Engagement</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">${performanceData.avgCPM}</div>
            <div className="text-sm text-gray-600">Average CPM</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          {[
            { id: 'all', name: 'All Campaigns' },
            { id: 'active', name: 'Active' },
            { id: 'upcoming', name: 'Upcoming' },
            { id: 'completed', name: 'Completed' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {getFilteredCampaigns().map((campaign) => (
          <Card key={campaign.id} className="transition-all duration-300 hover:shadow-lg">
            {/* Campaign Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center relative">
              <div className="text-gray-500 text-6xl font-bold opacity-20">
                {campaign.brand.charAt(0)}
              </div>
              <div className="absolute top-3 right-3">
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <div className="absolute top-3 left-3">
                <Badge variant="outline" className="bg-white">
                  {getCategoryIcon(campaign.category)}
                  <span className="ml-1 capitalize">{campaign.category}</span>
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                {campaign.title}
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">{campaign.brand}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                {campaign.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Campaign Metrics */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatNumber(campaign.participants)}
                  </div>
                  <div className="text-xs text-gray-600">Participants</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {campaign.engagement}%
                  </div>
                  <div className="text-xs text-gray-600">Engagement</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(campaign.revenue)}
                  </div>
                  <div className="text-xs text-gray-600">Revenue</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    ${campaign.cpm}
                  </div>
                  <div className="text-xs text-gray-600">CPM</div>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{campaign.duration} days</span>
              </div>

              {/* Forge Rewards Preview */}
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-700">Forge Rewards:</span>
                </div>
                <div className="text-xs text-gray-600">
                  {campaign.forgeRewards.slice(0, 2).join(', ')}
                  {campaign.forgeRewards.length > 2 && '...'}
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={campaign.status === 'completed'}
              >
                {campaign.status === 'active' ? 'View Campaign' :
                 campaign.status === 'upcoming' ? 'Coming Soon' :
                 'Completed'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Top Brand Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {performanceData.topPartners.map((partner, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-gray-500 font-bold text-lg">
                    {partner.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{partner}</h3>
                <div className="text-sm text-gray-600">
                  {index === 0 ? '6 campaigns' :
                   index === 1 ? '4 campaigns' :
                   index === 2 ? '3 campaigns' : '2 campaigns'}
                </div>
                <div className="flex items-center justify-center mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance Insights */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">High Engagement</h3>
          <p className="text-sm text-gray-600">
            89.2% average engagement rate across all sponsored content
          </p>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Strong Participation</h3>
          <p className="text-sm text-gray-600">
            15,000+ average participants per campaign
          </p>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <Heart className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Native Integration</h3>
          <p className="text-sm text-gray-600">
            Seamless forge-themed branded experiences
          </p>
        </div>
      </div>
    </div>
  )
}

export default SponsoredContent
