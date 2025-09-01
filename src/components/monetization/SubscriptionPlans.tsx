'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Flame, Crown, Zap } from 'lucide-react'

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  description: string
  icon: React.ReactNode
  badge?: string
  features: PlanFeature[]
  forgePerks: string[]
  popular?: boolean
}

const SubscriptionPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(false)
  const [loading, setLoading] = useState<string | null>(null)

  const plans: Plan[] = [
    {
      id: 'iron-apprentice',
      name: 'Iron Apprentice',
      price: 0,
      yearlyPrice: 0,
      description: 'Start your fitness forge journey',
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      features: [
        { text: 'Basic 3D Forge Access', included: true },
        { text: 'Limited AI Coaching (10 msgs/day)', included: true },
        { text: 'Basic Material Gathering', included: true },
        { text: 'Community Leaderboards', included: true },
        { text: 'Advanced Analytics', included: false },
        { text: 'Premium Materials', included: false },
        { text: 'Live Coaching Sessions', included: false }
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
        { text: 'Full 3D Forge Experience', included: true },
        { text: 'Unlimited AI Coaching', included: true },
        { text: 'Premium Material Access', included: true },
        { text: 'Advanced Analytics Dashboard', included: true },
        { text: 'Custom Avatar Upgrades', included: true },
        { text: 'Weekly Challenges', included: true },
        { text: 'Live Coaching Sessions', included: false }
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
        { text: 'Ultimate Forge Experience', included: true },
        { text: 'Personal AI Trainer & Nutritionist', included: true },
        { text: 'Mythril & Legendary Materials', included: true },
        { text: 'Real-time Health Insights', included: true },
        { text: 'Live 1-on-1 Coaching', included: true },
        { text: 'Custom Meal Plans', included: true },
        { text: 'Priority Support', included: true }
      ],
      forgePerks: [
        'Mythril, Diamond & Legendary materials',
        'Masterwork tools & enchanted anvils',
        'Exclusive champion status',
        'Triple XP & rare material bonuses',
        'Custom forge themes & effects'
      ]
    }
  ]

  const handleSubscribe = async (planId: string): Promise<void> => {
    setLoading(planId)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (planId === 'iron-apprentice') {
        // Free plan - just update user status
        alert('🔥 Welcome to the Forge, Iron Apprentice! Your free journey begins now!')
      } else {
        // Paid plans - integrate with payment processor
        alert(`🔥 Upgrading to ${plans.find(p => p.id === planId)?.name}! Redirecting to secure payment...`)
      }
    } catch (error) {
      alert('⚠️ Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const getButtonText = (plan: Plan): string => {
    if (plan.id === 'iron-apprentice') return 'Start Free Journey'
    return loading === plan.id ? 'Processing...' : 'Upgrade Forge'
  }

  const formatPrice = (plan: Plan): string => {
    if (plan.price === 0) return 'Free Forever'
    const price = isYearly ? plan.yearlyPrice : plan.price
    const period = isYearly ? '/year' : '/month'
    return `$${price}${period}`
  }

  const getSavings = (plan: Plan): string | null => {
    if (plan.price === 0 || !isYearly) return null
    const monthlyTotal = plan.price * 12
    const savings = monthlyTotal - plan.yearlyPrice
    return `Save $${savings}/year`
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
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              backgroundColor: isYearly ? '#3B82F6' : '#D1D5DB'
            }}
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
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save up to $50
            </Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:shadow-xl ${
              plan.popular
                ? 'border-2 border-blue-500 scale-105 shadow-lg'
                : 'border hover:border-gray-300'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant="default"
                  className={`${
                    plan.badge === 'Most Popular'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  } text-white px-4 py-1`}
                >
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              <p className="text-gray-600 text-sm">
                {plan.description}
              </p>
              <div className="mt-4">
                <div className="text-4xl font-bold text-gray-900">
                  {formatPrice(plan)}
                </div>
                {getSavings(plan) && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    {getSavings(plan)}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Main Features */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle
                      className={`w-5 h-5 ${
                        feature.included
                          ? 'text-green-500'
                          : 'text-gray-300'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        feature.included
                          ? 'text-gray-900'
                          : 'text-gray-400 line-through'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Forge Perks */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  🔥 Forge Perks:
                </h4>
                <ul className="space-y-2">
                  {plan.forgePerks.map((perk, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start"
                    >
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
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : plan.id === 'mythril-champion'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                } text-white`}
              >
                {getButtonText(plan)}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="text-center mt-12 pt-8 border-t">
        <p className="text-sm text-gray-500 mb-4">
          Trusted by 50,000+ fitness enthusiasts worldwide
        </p>
        <div className="flex justify-center space-x-8 text-xs text-gray-400">
          <span>✓ 30-day money back guarantee</span>
          <span>✓ Cancel anytime</span>
          <span>✓ Secure payment processing</span>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlans
