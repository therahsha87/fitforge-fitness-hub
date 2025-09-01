'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Flame,
  Zap,
  Shield,
  Heart,
  Trophy,
  Package
} from 'lucide-react'

interface SupplementCardProps {
  id: string
  name: string
  price: number
  rating: number
  image: string
  description: string
  category?: 'Pre-Workout' | 'Protein' | 'Recovery' | 'Vitamins' | 'Fat Burner'
  forgeBoost?: string
  materialsProvided?: string[]
  inStock?: boolean
}

export function SupplementCard({
  id,
  name,
  price,
  rating,
  image,
  description,
  category = 'Protein',
  forgeBoost = '+10 Strength Materials',
  materialsProvided = ['Protein Crystal'],
  inStock = true
}: SupplementCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Pre-Workout': return <Flame className="h-4 w-4 text-orange-500" />
      case 'Protein': return <Zap className="h-4 w-4 text-blue-500" />
      case 'Recovery': return <Shield className="h-4 w-4 text-green-500" />
      case 'Vitamins': return <Heart className="h-4 w-4 text-red-500" />
      case 'Fat Burner': return <Trophy className="h-4 w-4 text-purple-500" />
      default: return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Pre-Workout': return 'text-orange-600 border-orange-600 bg-orange-50'
      case 'Protein': return 'text-blue-600 border-blue-600 bg-blue-50'
      case 'Recovery': return 'text-green-600 border-green-600 bg-green-50'
      case 'Vitamins': return 'text-red-600 border-red-600 bg-red-50'
      case 'Fat Burner': return 'text-purple-600 border-purple-600 bg-purple-50'
      default: return 'text-gray-600 border-gray-600 bg-gray-50'
    }
  }

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    console.log(`Added ${quantity}x ${name} to cart`)
  }

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)))
  }

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      !inStock ? 'opacity-75' : ''
    }`}>
      {!inStock && (
        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
          Out of Stock
        </div>
      )}
      
      {addedToCart && (
        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
          Added to Cart!
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold">{name}</CardTitle>
          <Badge variant="outline" className={getCategoryColor(category)}>
            {getCategoryIcon(category)}
            <span className="ml-1">{category}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Product Image Placeholder */}
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
          <Package className="h-16 w-16 text-gray-400" />
        </div>
        
        <p className="text-gray-600 text-sm">{description}</p>
        
        {/* Forge Benefits */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Forge Benefits:</div>
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            <Flame className="h-3 w-3 mr-1" />
            {forgeBoost}
          </Badge>
          
          <div className="text-xs text-gray-600">
            <span className="font-medium">Materials Provided: </span>
            {materialsProvided.join(', ')}
          </div>
        </div>

        {/* Rating */}
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

        {/* Price and Quantity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">${price.toFixed(2)}</span>
            <div className="flex items-center space-x-2 border rounded-lg p-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
                className="h-6 w-6 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => adjustQuantity(1)}
                disabled={quantity >= 10}
                className="h-6 w-6 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleAddToCart}
            disabled={!inStock || addedToCart}
            className={`w-full transition-all duration-300 ${
              addedToCart 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {addedToCart ? 'Added to Cart!' : `Add ${quantity}x to Cart`}
          </Button>
        </div>

        {/* Special Offers */}
        {price > 50 && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-center">
            <div className="text-xs font-medium text-yellow-800">
              🔥 Forge Special: Free shipping on orders over $50!
            </div>
          </div>
        )}
        
        {rating >= 4.5 && (
          <div className="p-2 bg-purple-50 border border-purple-200 rounded text-center">
            <div className="text-xs font-medium text-purple-800">
              ⭐ Forge Master's Choice - Top Rated!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
