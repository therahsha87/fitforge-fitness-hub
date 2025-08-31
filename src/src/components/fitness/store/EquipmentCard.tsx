'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ShoppingCart, Truck } from 'lucide-react'
import { useState } from 'react'

interface EquipmentCardProps {
  name: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  inStock: boolean
  description: string
  features: string[]
  freeShipping?: boolean
}

export function EquipmentCard({
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  category,
  inStock,
  description,
  features,
  freeShipping = true
}: EquipmentCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-0 relative">
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg bg-gray-50">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge
            variant={category === 'Cardio' ? 'destructive' : category === 'Strength' ? 'default' : 'secondary'}
            className="absolute top-2 left-2"
          >
            {category}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-white/80 hover:bg-white ${isFavorited ? 'text-red-500' : 'text-gray-600'}`}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          {freeShipping && inStock && (
            <Badge variant="default" className="absolute bottom-2 left-2 bg-green-600">
              <Truck className="h-3 w-3 mr-1" />
              Free Shipping
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 font-medium">{brand}</p>
            <h3 className="font-bold text-lg leading-tight">{name}</h3>
          </div>

          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({reviews} reviews)</span>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">{description}</p>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Key Features:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {features.slice(0, 3).map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">${price}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
              )}
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isAddedToCart}
            className={`w-full ${isAddedToCart ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAddedToCart ? 'Added to Cart!' : inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
