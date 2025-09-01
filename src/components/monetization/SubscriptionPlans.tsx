'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Flame, Crown, Zap } from 'lucide-react'

const SubscriptionPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(false)
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    {
      id: 'iron-apprentice',
      name: 'Iron Apprentice',
      price: 0,
      yearlyPrice: 0,
      description: 'Start your fitness forge journey',
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      features: [
        'Basic 3D Forge Access',
        'Limited AI Coaching (10 msgs/day)',
        'Basic Material Gathering',
        'Community Leaderboards'
      ],
      forgePerks: [
        'Iron-grade materials only',
        'Basic forge tools',
        'Standard achievement badges'
      ]
    },
    {
      id: 'steel-forgemaster',
      name: 'Steel Forgemaster',
      price: 14.99,
      yearlyPrice: 149.99,
      description: 'Unlock the full forging experience',
      icon: <Crown className="w-8 h-8 text-blue-500" />,
      badge: 'Most Popular',
      popular: true,
      features: [
        'Full 3D Forge Experience',
        'Unlimited AI Coaching',
        'Premium Material Access',
        'Advanced Analytics Dashboard',
        'Custom Avatar Upgrades',
        'Weekly Challenges'
      ],
      forgePerks: [
        'Steel, Silver & Gold materials',
        'Enhanced forge tools & anvils',
        'Exclusive forgemaster badges',
        'Double XP weekends'
      ]
    },
    {
      id: 'mythril-champion',
      name: 'Mythril Champion',
      price: 24.99,
      yearlyPrice: 249.99,
      description: 'Master-tier forging capabilities',
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      badge: 'Premium',
      features: [
        'Ultimate Forge Experience',
        'Personal AI Trainer & Nutritionist',
        'Mythril & Legendary Materials',
        'Real-time Health Insights',
        'Live 1-on-1 Coaching',
        'Custom Meal Plans',
        'Priority Support'
      ],
      forgePerks: [
        'Mythril, Diamond & Legendary materials',
        'Masterwork tools & enchanted anvils',
        'Exclusive champion status',
        'Triple XP & rare material bonuses'
      ]
    }
  ]

  const handleSubscribe = async (planId: string): Promise<void> => {
    setLoading(planId)
    
    try {
      const response = await fetch('/api/monetization/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: 'user123', // Replace with actual user ID
          billingPeriod: isYearly ? 'yearly' : 'monthly'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`🔥 Welcome to ${plans.find(p => p.id === planId)?.name}!`)
      } else {
        alert('⚠️ Something went wrong. Please try again.')
      }
    } catch (error) {
      alert('⚠️ Network error. Please check your connection.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🔥 Choose Your Forge Tier
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Transform your fitness journey with legendary forging power
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className={`font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
            style={{ backgroundColor: isYearly ? '#3B82F6' : '#D1D5DB' }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="secondary" className="ml-2">Save 17%</Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:shadow-xl ${
              plan.popular ? 'border-2 border-blue-500 scale-105 shadow-lg' : 'border'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="bg-blue-500 text-white px-4 py-1">
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">{plan.icon}</div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              <p className="text-gray-600 text-sm">{plan.description}</p>
              <div className="mt-4">
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price === 0 ? 'Free Forever' : 
                   `$${isYearly ? plan.yearlyPrice : plan.price}${isYearly ? '/year' : '/month'}`}
                </div>
                {isYearly && plan.price > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    Save ${(plan.price * 12 - plan.yearlyPrice).toFixed(2)} annually
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">🔥 Forge Perks:</h4>
                <ul className="space-y-2">
                  {plan.forgePerks.map((perk, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full mt-6 ${
                  plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'
                } text-white`}
              >
                {loading === plan.id ? 'Processing...' : 
                 plan.id === 'iron-apprentice' ? 'Start Free Journey' : 'Upgrade Forge'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="mt-16 grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">$548K</div>
            <div className="text-sm text-gray-600">Annual Subscription Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">2,340</div>
            <div className="text-sm text-gray-600">Active Subscribers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">$180</div>
            <div className="text-sm text-gray-600">Average LTV</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">94%</div>
            <div className="text-sm text-gray-600">Retention Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SubscriptionPlans
