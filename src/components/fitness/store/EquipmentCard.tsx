'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Award,
  Hammer,
  Dumbbell,
  Target,
  Zap,
  Package,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react'

interface EquipmentCardProps {
  id: string
  name: string
  price: number
  rating: number
  image: string
  description: string
  category?: 'Strength' | 'Cardio' | 'Flexibility' | 'Accessories' | 'Home Gym'
  forgeCompatible?: boolean
  durabilityRating?: number
  forgeBonus?: string
  workoutTypes?: string[]
  inStock?: boolean
  freeShipping?: boolean
}

export function EquipmentCard({
  id,
  name,
  price,
  rating,
  image,
  description,
  category = 'Strength',
  forgeCompatible = true,
  durabilityRating = 95,
  forgeBonus = '+15% Strength Training Efficiency',
  workoutTypes = ['Strength Training', 'Muscle Building'],
  inStock = true,
  freeShipping = false
}: EquipmentCardProps) {
  const [addedToCart, setAddedToCart] = useState(false)
  const [addedToWishlist, setAddedToWishlist] = useState(false)

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Strength': return <Hammer className="h-4 w-4 text-red-500" />
      case 'Cardio': return <Zap className="h-4 w-4 text-orange-500" />
      case 'Flexibility': return <Shield className="h-4 w-4 text-purple-500" />
      case 'Accessories': return <Target className="h-4 w-4 text-blue-500" />
      case 'Home Gym': return <Dumbbell className="h-4 w-4 text-green-500" />
      default: return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Strength': return 'text-red-600 border-red-600 bg-red-50'
      case 'Cardio': return 'text-orange-600 border-orange-600 bg-orange-50'
      case 'Flexibility': return 'text-purple-600 border-purple-600 bg-purple-50'
      case 'Accessories': return 'text-blue-600 border-blue-600 bg-blue-50'
      case 'Home Gym': return 'text-green-600 border-green-600 bg-green-50'
      default: return 'text-gray-600 border-gray-600 bg-gray-50'
    }
  }

  const getDurabilityColor = (rating: number) => {
    if (rating >= 90) return 'text-green-600'
    if (rating >= 75) return 'text-yellow-600'
    if (rating >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
    console.log(`Added ${name} to cart`)
  }

  const handleAddToWishlist = () => {
    setAddedToWishlist(true)
    setTimeout(() => setAddedToWishlist(false), 2000)
    console.log(`Added ${name} to wishlist`)
  }

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      !inStock ? 'opacity-75' : ''
    }`}>
      {!inStock && (
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
          Out of Stock
        </div>
      )}
      
      {addedToCart && (
        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse z-10">
          Added to Cart!
        </div>
      )}

      {freeShipping && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          Free Shipping
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold pr-2">{name}</CardTitle>
          <Badge variant="outline" className={getCategoryColor(category)}>
            {getCategoryIcon(category)}
            <span className="ml-1">{category}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Product Image Placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative">
          <Dumbbell className="h-20 w-20 text-gray-400" />
          
          {forgeCompatible && (
            <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
              🔥 Forge Ready
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm">{description}</p>
        
        {/* Forge Integration */}
        {forgeCompatible && (
          <div className="space-y-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-sm font-medium text-orange-800">Forge Integration:</div>
            <div className="text-sm text-orange-700">{forgeBonus}</div>
            <div className="flex flex-wrap gap-1">
              {materialsProvided.map((material, index) => (
                <Badge key={index} variant="outline" className="text-xs text-orange-600 border-orange-600">
                  <Trophy className="h-3 w-3 mr-1" />
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Workout Compatibility */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Perfect for:</div>
          <div className="flex flex-wrap gap-1">
            {workoutTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-500 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({rating}/5)</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">1,247 reviews</span>
          </div>
        </div>

        {/* Durability Rating */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Forge Durability</span>
            <span className={`text-sm font-bold ${getDurabilityColor(durabilityRating)}`}>
              {durabilityRating}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                durabilityRating >= 90 ? 'bg-green-500' :
                durabilityRating >= 75 ? 'bg-yellow-500' :
                durabilityRating >= 60 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${durabilityRating}%` }}
            />
          </div>
        </div>

        {/* Price and Actions */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-green-600">${price.toFixed(2)}</span>
            <div className="text-right">
              <div className="text-xs text-gray-600">Total: ${(price * quantity).toFixed(2)}</div>
              {freeShipping && (
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <Truck className="h-3 w-3" />
                  <span>Free Shipping</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleAddToCart}
              disabled={!inStock || addedToCart}
              className={`flex-1 transition-all duration-300 ${
                addedToCart 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </Button>
            
            <Button 
              onClick={handleAddToWishlist}
              variant="outline" 
              disabled={addedToWishlist}
              className="px-3"
            >
              {addedToWishlist ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Special Features */}
        <div className="flex flex-wrap gap-2">
          {durabilityRating >= 95 && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
              <Award className="h-3 w-3 mr-1" />
              Premium Quality
            </Badge>
          )}
          
          {forgeCompatible && (
            <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
              <Target className="h-3 w-3 mr-1" />
              Forge Enhanced
            </Badge>
          )}
          
          {rating >= 4.5 && (
            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
              <Star className="h-3 w-3 mr-1" />
              Best Seller
            </Badge>
          )}
        </div>

        {/* Estimated Delivery */}
        {inStock && (
          <div className="text-xs text-gray-600 flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Estimated delivery: 2-3 business days</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
