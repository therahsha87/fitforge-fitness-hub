'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Gem, 
  Sword, 
  Shield, 
  Zap, 
  Star, 
  Crown,
  Sparkles,
  Flame
} from 'lucide-react'

const InAppPurchases: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null)
  const [cart, setCart] = useState<Array<{ id: string; quantity: number }>>([])

  const purchaseCategories = [
    {
      name: '💎 Premium Materials',
      items: [
        {
          id: 'dragon-steel',
          name: 'Dragon Steel Ingots',
          price: 4.99,
          description: 'Legendary crafting material',
          icon: <Gem className="w-8 h-8 text-red-500" />,
          rarity: 'Legendary',
          forgeBonus: '+300% XP for 7 days'
        },
        {
          id: 'celestial-crystal',
          name: 'Celestial Crystals',
          price: 2.99,
          description: 'Rare enhancement stones',
          icon: <Sparkles className="w-8 h-8 text-blue-500" />,
          rarity: 'Epic',
          forgeBonus: '+200% Material Find Rate'
        },
        {
          id: 'phoenix-ember',
          name: 'Phoenix Ember',
          price: 7.99,
          description: 'Eternal flame essence',
          icon: <Flame className="w-8 h-8 text-orange-500" />,
          rarity: 'Mythic',
          forgeBonus: 'Unlimited Forge Heat'
        }
      ]
    },
    {
      name: '⚔️ Legendary Tools',
      items: [
        {
          id: 'masterwork-hammer',
          name: 'Masterwork Hammer',
          price: 9.99,
          description: 'Craft items 3x faster',
          icon: <Sword className="w-8 h-8 text-gray-600" />,
          rarity: 'Legendary',
          forgeBonus: '+300% Crafting Speed'
        },
        {
          id: 'enchanted-anvil',
          name: 'Enchanted Anvil',
          price: 14.99,
          description: 'Double item quality chance',
          icon: <Shield className="w-8 h-8 text-gold-500" />,
          rarity: 'Mythic',
          forgeBonus: '+100% Quality Chance'
        }
      ]
    },
    {
      name: '✨ Cosmetic Items',
      items: [
        {
          id: 'flame-aura',
          name: 'Flame Aura',
          price: 1.99,
          description: 'Fiery avatar enhancement',
          icon: <Star className="w-8 h-8 text-red-400" />,
          rarity: 'Rare',
          forgeBonus: 'Visual Enhancement'
        },
        {
          id: 'golden-forge',
          name: 'Golden Forge Theme',
          price: 3.99,
          description: 'Luxury forge appearance',
          icon: <Crown className="w-8 h-8 text-yellow-500" />,
          rarity: 'Epic',
          forgeBonus: 'Premium Visuals'
        }
      ]
    },
    {
      name: '🚀 Boost Packs',
      items: [
        {
          id: 'xp-multiplier',
          name: '7-Day XP Multiplier',
          price: 5.99,
          description: 'Double all experience gains',
          icon: <Zap className="w-8 h-8 text-yellow-400" />,
          rarity: 'Epic',
          forgeBonus: '+100% XP for 7 days'
        }
      ]
    }
  ]

  const handlePurchase = async (itemId: string): Promise<void> => {
    setLoading(itemId)
    
    try {
      const response = await fetch('/api/monetization/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          userId: 'user123' // Replace with actual user ID
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const item = purchaseCategories
          .flatMap(cat => cat.items)
          .find(item => item.id === itemId)
        alert(`🔥 Successfully purchased ${item?.name}! Forge power increased!`)
      } else {
        alert('⚠️ Purchase failed. Please try again.')
      }
    } catch (error) {
      alert('⚠️ Network error. Please check your connection.')
    } finally {
      setLoading(null)
    }
  }

  const getRarityColor = (rarity: string): string => {
    const colors = {
      'Common': 'bg-gray-100 text-gray-800',
      'Rare': 'bg-blue-100 text-blue-800',
      'Epic': 'bg-purple-100 text-purple-800',
      'Legendary': 'bg-orange-100 text-orange-800',
      'Mythic': 'bg-red-100 text-red-800'
    }
    return colors[rarity as keyof typeof colors] || colors.Common
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🛍️ Forge Marketplace
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Enhance your fitness forge with premium materials and legendary tools
        </p>
      </div>

      {/* Revenue Summary */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">$281K</div>
            <div className="text-sm text-gray-600">Annual IAP Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">$12.50</div>
            <div className="text-sm text-gray-600">Average Transaction</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">42%</div>
            <div className="text-sm text-gray-600">Purchase Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">4.8★</div>
            <div className="text-sm text-gray-600">Item Satisfaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Categories */}
      <div className="space-y-12">
        {purchaseCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-3">{item.icon}</div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {item.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex justify-center space-x-2 mt-3">
                      <Badge className={getRarityColor(item.rarity)}>
                        {item.rarity}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${item.price}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-800 mb-1">🔥 Forge Bonus:</div>
                      <div className="text-sm text-blue-700">{item.forgeBonus}</div>
                    </div>

                    <Button
                      onClick={() => handlePurchase(item.id)}
                      disabled={loading === item.id}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      {loading === item.id ? 'Processing...' : `Purchase $${item.price}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Featured Bundle */}
      <Card className="mt-12 border-2 border-gradient-to-r from-orange-500 to-red-500 bg-gradient-to-r from-orange-50 to-red-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            🔥 Forgemaster Bundle
          </CardTitle>
          <p className="text-gray-600">Complete legendary toolkit - Save 40%!</p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-green-600">$24.99</div>
          <div className="text-lg text-gray-500 line-through">$41.94</div>
          <div className="text-sm text-gray-600">
            Includes: Dragon Steel, Masterwork Hammer, Flame Aura & 7-Day XP Boost
          </div>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-3"
            onClick={() => handlePurchase('forgemaster-bundle')}
          >
            Purchase Bundle - Save $16.95!
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default InAppPurchases
