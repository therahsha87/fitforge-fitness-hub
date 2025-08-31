'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface SupplementCardProps {
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
  benefits: string[]
}

export function SupplementCard({
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
  benefits
}: SupplementCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const handleAddToCart = () => {
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="p-0 relative">
        <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-50">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge
            variant={category === 'Pre-Workout' ? 'destructive' : category === 'Protein' ? 'default' : 'secondary'}
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
            <span className="text-sm text-gray-600 ml-2">({reviews})</span>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">{description}</p>

          <div className="flex flex-wrap gap-1">
            {benefits.slice(0, 3).map((benefit) => (
              <Badge key={benefit} variant="outline" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">${price}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
              )}
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || isAddedToCart}
              className={`${isAddedToCart ? 'bg-green-500 hover:bg-green-600' : ''}`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddedToCart ? 'Added!' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
