'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dumbbell, 
  Pill, 
  Watch, 
  Shirt, 
  Star, 
  ExternalLink,
  TrendingUp,
  Flame,
  Award,
  ShoppingCart
} from 'lucide-react'

interface AffiliateProduct {
  id: string
  name: string
  brand: string
  category: 'supplements' | 'equipment' | 'wearables' | 'apparel'
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  imageUrl: string
  affiliateUrl: string
  commission: number
  description: string
  forgeBonus: string
  features: string[]
  badge?: string
  discount?: number
}

interface PerformanceMetrics {
  clicks: number
  conversions: number
  revenue: number
  conversionRate: number
}

const AffiliateStore: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('featured')
  const [performanceData] = useState<PerformanceMetrics>({
    clicks: 12847,
    conversions: 1156,
    revenue: 18395.50,
    conversionRate: 9.0
  })

  const affiliateProducts: AffiliateProduct[] = [
    // Supplements
    {
      id: 'optimum-whey',
      name: 'Gold Standard 100% Whey Protein',
      brand: 'Optimum Nutrition',
      category: 'supplements',
      price: 58.99,
      originalPrice: 69.99,
      rating: 4.8,
      reviews: 15234,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://partner.optimumnutrition.com/whey-protein',
      commission: 15,
      description: 'The gold standard in whey protein for muscle building and recovery',
      forgeBonus: '+50 Protein Crystals daily when consumed',
      features: [
        '24g high-quality whey protein',
        '5.5g BCAAs & 4g glutamine',
        'Available in 20+ flavors',
        'Fast absorption for post-workout'
      ],
      badge: 'Best Seller',
      discount: 16
    },
    {
      id: 'creatine-monohydrate',
      name: 'Micronized Creatine Monohydrate',
      brand: 'Optimum Nutrition',
      category: 'supplements',
      price: 19.99,
      rating: 4.7,
      reviews: 8934,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://partner.optimumnutrition.com/creatine',
      commission: 12,
      description: 'Pure creatine for increased strength and power output',
      forgeBonus: '+25% Strength Essence gathering for 7 days',
      features: [
        '5g pure creatine monohydrate',
        'Micronized for better mixing',
        'Unflavored and versatile',
        'Supports muscle strength & power'
      ]
    },
    {
      id: 'pre-workout',
      name: 'C4 Original Pre-Workout',
      brand: 'Cellucor',
      category: 'supplements',
      price: 29.99,
      rating: 4.6,
      reviews: 12456,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://cellucor.com/c4-original',
      commission: 18,
      description: 'Explosive energy and focus for intense workouts',
      forgeBonus: '+100% XP gain for next workout session',
      features: [
        'Explosive energy blend',
        'Enhanced focus & endurance',
        'Beta-alanine for performance',
        'Multiple flavor options'
      ],
      badge: 'High Energy'
    },

    // Equipment
    {
      id: 'adjustable-dumbbells',
      name: 'PowerBlocks Adjustable Dumbbells',
      brand: 'PowerBlock',
      category: 'equipment',
      price: 399.99,
      originalPrice: 499.99,
      rating: 4.9,
      reviews: 3421,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://powerblock.com/adjustable-dumbbells',
      commission: 8,
      description: 'Space-saving adjustable dumbbells for home workouts',
      forgeBonus: 'Unlock Masterwork Hammer tool in your forge',
      features: [
        'Adjusts from 5-90 lbs per hand',
        'Compact expandable design',
        'Quick weight changes',
        'Commercial gym quality'
      ],
      badge: 'Space Saver',
      discount: 20
    },
    {
      id: 'resistance-bands',
      name: 'Resistance Bands Set',
      brand: 'Bodylastics',
      category: 'equipment',
      price: 49.99,
      rating: 4.5,
      reviews: 5632,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://bodylastics.com/resistance-bands',
      commission: 25,
      description: 'Complete resistance training system for all fitness levels',
      forgeBonus: '+3 Flexibility Gems per workout completed',
      features: [
        'Multiple resistance levels',
        'Snap-guard technology',
        'Door anchor & ankle straps',
        'Lifetime warranty'
      ]
    },

    // Wearables
    {
      id: 'apple-watch-ultra',
      name: 'Apple Watch Ultra 2',
      brand: 'Apple',
      category: 'wearables',
      price: 799.99,
      rating: 4.8,
      reviews: 9876,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://apple.com/watch-ultra',
      commission: 3,
      description: 'Ultimate fitness tracking with precision GPS and health monitoring',
      forgeBonus: 'Auto-sync workout data & earn double material rewards',
      features: [
        'Precision dual-frequency GPS',
        'Action button for workouts',
        'Water resistant to 100m',
        'Up to 36 hours battery life'
      ],
      badge: 'Premium'
    },
    {
      id: 'fitbit-charge-6',
      name: 'Fitbit Charge 6',
      brand: 'Fitbit',
      category: 'wearables',
      price: 199.99,
      originalPrice: 229.99,
      rating: 4.4,
      reviews: 7234,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://fitbit.com/charge6',
      commission: 6,
      description: 'Advanced health & fitness tracker with built-in GPS',
      forgeBonus: 'Real-time health stats integration with forge metrics',
      features: [
        'Built-in GPS & heart rate',
        'Google apps integration',
        '7-day battery life',
        'Sleep & stress management'
      ],
      discount: 13
    },

    // Apparel
    {
      id: 'nike-dri-fit',
      name: 'Nike Dri-FIT Training Shirt',
      brand: 'Nike',
      category: 'apparel',
      price: 35.99,
      originalPrice: 45.99,
      rating: 4.6,
      reviews: 4532,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://nike.com/dri-fit-training',
      commission: 10,
      description: 'Moisture-wicking performance shirt for intense workouts',
      forgeBonus: '+10% workout efficiency bonus when worn',
      features: [
        'Dri-FIT moisture management',
        'Lightweight & breathable',
        'Athletic fit design',
        'Multiple color options'
      ],
      discount: 22
    },
    {
      id: 'under-armour-shorts',
      name: 'Under Armour HeatGear Shorts',
      brand: 'Under Armour',
      category: 'apparel',
      price: 29.99,
      rating: 4.5,
      reviews: 3421,
      imageUrl: '/api/placeholder/300/300',
      affiliateUrl: 'https://underarmour.com/heatgear-shorts',
      commission: 12,
      description: 'Ultra-lightweight shorts that keep you cool and dry',
      forgeBonus: '+5% movement speed in forge environment',
      features: [
        'HeatGear fabric technology',
        '4-way stretch construction',
        'Anti-odor technology',
        'Loose comfortable fit'
      ]
    }
  ]

  const categories = [
    { id: 'featured', name: 'Featured', icon: <Star className="w-4 h-4" /> },
    { id: 'supplements', name: 'Supplements', icon: <Pill className="w-4 h-4" /> },
    { id: 'equipment', name: 'Equipment', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'wearables', name: 'Wearables', icon: <Watch className="w-4 h-4" /> },
    { id: 'apparel', name: 'Apparel', icon: <Shirt className="w-4 h-4" /> }
  ]

  const getFilteredProducts = (): AffiliateProduct[] => {
    if (activeCategory === 'featured') {
      return affiliateProducts.filter(product => product.badge || product.discount)
    }
    return affiliateProducts.filter(product => product.category === activeCategory)
  }

  const handleAffiliateClick = (product: AffiliateProduct): void => {
    // Track click for analytics
    console.log(`Affiliate click: ${product.name} - Commission: ${product.commission}%`)
    
    // Open affiliate link in new tab
    window.open(product.affiliateUrl, '_blank')
    
    // Show forge bonus notification
    alert(`🔥 Clicking through to ${product.brand}! ${product.forgeBonus}`)
  }

  const formatPrice = (product: AffiliateProduct): JSX.Element => {
    if (product.originalPrice) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
        </div>
      )
    }
    return <span className="text-xl font-bold text-gray-900">${product.price}</span>
  }

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🛒 Forge Partner Store
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Premium fitness products that enhance your forge experience
        </p>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-3xl mx-auto">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{performanceData.clicks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{performanceData.conversions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Conversions</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">${performanceData.revenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{performanceData.conversionRate}%</div>
            <div className="text-sm text-gray-600">Conv. Rate</div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getFilteredProducts().map((product) => (
          <Card
            key={product.id}
            className="relative transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
              {product.badge && (
                <Badge
                  variant="default"
                  className="bg-blue-500 text-white text-xs"
                >
                  {product.badge}
                </Badge>
              )}
              {product.discount && (
                <Badge
                  variant="secondary"
                  className="bg-red-500 text-white text-xs"
                >
                  -{product.discount}%
                </Badge>
              )}
            </div>

            {/* Commission Badge */}
            <div className="absolute top-3 right-3 z-10">
              <Badge
                variant="outline"
                className="bg-green-500 text-white text-xs border-green-500"
              >
                {product.commission}% comm
              </Badge>
            </div>

            <CardHeader className="pb-2">
              {/* Product Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                {product.category === 'supplements' && <Pill className="w-12 h-12 text-gray-400" />}
                {product.category === 'equipment' && <Dumbbell className="w-12 h-12 text-gray-400" />}
                {product.category === 'wearables' && <Watch className="w-12 h-12 text-gray-400" />}
                {product.category === 'apparel' && <Shirt className="w-12 h-12 text-gray-400" />}
              </div>

              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                {product.name}
              </CardTitle>
              <p className="text-sm text-gray-600 font-medium">
                {product.brand}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews.toLocaleString()})
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price */}
              <div className="flex justify-between items-center">
                {formatPrice(product)}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              {/* Forge Bonus */}
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Flame className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-700 mb-1">Forge Bonus:</div>
                    <div className="text-xs text-gray-600">{product.forgeBonus}</div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-900">Key Features:</h4>
                <ul className="space-y-1">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleAffiliateClick(product)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partner Benefits */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          🤝 Partner Benefits
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Award className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Exclusive Forge Bonuses</h4>
            <p className="text-sm text-gray-600">
              Every purchase through our partners unlocks special in-app rewards and materials
            </p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Performance Tracking</h4>
            <p className="text-sm text-gray-600">
              Real-time analytics showing clicks, conversions, and revenue performance
            </p>
          </div>
          <div className="text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Quality Partners</h4>
            <p className="text-sm text-gray-600">
              Hand-selected premium brands that align with our fitness-first philosophy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliateStore
